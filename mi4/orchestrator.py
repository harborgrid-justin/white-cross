#!/usr/bin/env python3
import asyncio
import json
from pathlib import Path
from typing import List, Dict, Any

"""

Orchestrator module for managing and executing tasks using multiple agents with Codex CLI.

This module loads tasks from a JSON file, assigns them to agents, and runs Codex CLI in separate workspaces.

"""

# ----------------- CONFIG -----------------

MAX_AGENTS = 3
AGENTS = ["alpha", "bravo", "charlie"][:MAX_AGENTS]

BASE_DIR = Path(__file__).parent
TASK_FILE = BASE_DIR / "tasks.json"
WORKSPACES_DIR = BASE_DIR / "workspaces"

# Command template for Codex CLI.
# Adjust this to whatever you actually run, e.g.:
#   codex cli --non-interactive --prompt "..." 
# or
#   codex exec --file task_prompt.txt
#
# We'll build the prompt dynamically per task.
CODEX_CMD = ["codex", "cli"]

# ----------------- UTILITIES -----------------


def load_tasks() -> List[Dict[str, Any]]:
    with TASK_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_tasks(tasks: List[Dict[str, Any]]) -> None:
    with TASK_FILE.open("w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2)


def get_open_tasks(tasks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [t for t in tasks if t.get("status") == "open"]


def mark_task(tasks: List[Dict[str, Any]], task_id: int, **updates) -> None:
    for t in tasks:
        if t["id"] == task_id:
            t.update(updates)
            break


def ensure_workspaces():
    WORKSPACES_DIR.mkdir(exist_ok=True)
    for agent in AGENTS:
        (WORKSPACES_DIR / f"agent_{agent}").mkdir(parents=True, exist_ok=True)


def build_prompt_for_task(task: Dict[str, Any]) -> str:
    """
    You can customise this to tell Codex exactly how to behave for each task.
    """
    return f"""
You are a local coding agent working in a repo.

Task ID: {task['id']}
Task Title: {task['title']}

Task Description:
{task['description']}

Instructions:
- Work ONLY inside the current repo / workspace.
- Make minimal, focused changes to complete this task.
- Run tests if appropriate.
- When done, summarise the changes you made and any follow-ups.
"""


async def run_codex_for_task(agent: str, task: Dict[str, Any]) -> int:
    """
    Launch Codex CLI as a subprocess, passing the prompt via stdin.
    We stream stdout/stderr and prefix with [agent][task-id].
    """
    workspace = WORKSPACES_DIR / f"agent_{agent}"

    prompt = build_prompt_for_task(task)

    # Compose the complete command. Here we assume `codex cli` reads from stdin.
    # If your Codex CLI uses different flags, tweak this.
    cmd = CODEX_CMD

    print(f"[{agent}][task {task['id']}] Starting in {workspace} with cmd: {' '.join(cmd)}")

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        cwd=str(workspace),
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )

    # Send prompt and close stdin
    if proc.stdin is not None:
        proc.stdin.write(prompt.encode("utf-8"))
        await proc.stdin.drain()
        proc.stdin.close()

    async def stream_output(stream, label):
        while True:
            line = await stream.readline()
            if not line:
                break
            text = line.decode(errors="replace").rstrip("\n")
            print(f"[{agent}][task {task['id']}][{label}] {text}")

    # Stream stdout and stderr concurrently
    await asyncio.gather(
        stream_output(proc.stdout, "OUT"),
        stream_output(proc.stderr, "ERR"),
    )

    return await proc.wait()


# ----------------- ORCHESTRATION -----------------


async def worker(agent: str, task_queue: asyncio.Queue, tasks_state: List[Dict[str, Any]]):
    while True:
        try:
            task = task_queue.get_nowait()
        except asyncio.QueueEmpty:
            return

        task_id = task["id"]
        mark_task(tasks_state, task_id, status="running", agent=agent)
        save_tasks(tasks_state)

        try:
            exit_code = await run_codex_for_task(agent, task)
            if exit_code == 0:
                print(f"[{agent}][task {task_id}] Completed successfully")
                mark_task(tasks_state, task_id, status="done")
            else:
                print(f"[{agent}][task {task_id}] Exited with code {exit_code}")
                mark_task(tasks_state, task_id, status="error", exit_code=exit_code)
        except Exception as e:
            print(f"[{agent}][task {task_id}] ERROR: {e}")
            mark_task(tasks_state, task_id, status="error", error=str(e))
        finally:
            save_tasks(tasks_state)
            task_queue.task_done()


async def main():
    ensure_workspaces()

    tasks_state = load_tasks()
    open_tasks = get_open_tasks(tasks_state)

    if not open_tasks:
        print("No open tasks found in tasks.json")
        return

    print(f"Found {len(open_tasks)} open tasks. Spawning up to {len(AGENTS)} agents.")

    task_queue: asyncio.Queue = asyncio.Queue()
    for t in open_tasks:
        task_queue.put_nowait(t)

    workers = [
        asyncio.create_task(worker(agent, task_queue, tasks_state))
        for agent in AGENTS
    ]

    await task_queue.join()

    for w in workers:
        w.cancel()

    print("All tasks processed. Final task state:")
    for t in tasks_state:
        print(f"  - Task {t['id']}: {t.get('status')} (agent={t.get('agent')})")


if __name__ == "__main__":
    asyncio.run(main())
