# Logging Quick Reference

## Run with Logging

```bash
# Default (INFO to console, DEBUG to file)
python3 orchestrator.py

# Verbose mode (DEBUG everywhere)
python3 orchestrator.py --verbose
```

## Monitor in Real-Time

```bash
# Watch all logs
tail -f orchestrator.log

# Watch errors only
tail -f orchestrator.log | grep ERROR

# Watch specific task
tail -f orchestrator.log | grep "Task 1"

# Watch agent activity
tail -f orchestrator.log | grep "\[agent1\]"
```

## Search Logs

```bash
# Find completed tasks
grep "marked as done" orchestrator.log

# Find failed tasks
grep "marked as error" orchestrator.log

# Find Codex errors
grep "\[ERR\]" orchestrator.log

# Find slow tasks (>5min)
grep "completed in" orchestrator.log | awk '{if ($(NF-1) > 300) print}'

# View recent activity
tail -100 orchestrator.log

# Count task statuses
grep -c "marked as done" orchestrator.log
grep -c "marked as error" orchestrator.log
```

## Debug a Failed Task

```bash
# 1. Find the task failure
grep "Task 1" orchestrator.log | grep ERROR

# 2. See what command was run
grep "Task 1" orchestrator.log | grep "Executing command"

# 3. See all output for that task
grep "Task 1" orchestrator.log

# 4. See just the errors
grep "Task 1" orchestrator.log | grep "\[ERR\]"
```

## Log Files

- **Main log**: `orchestrator.log`
- **Rotated**: `orchestrator.log.1`, `orchestrator.log.2`, `orchestrator.log.3`
- **Max size**: 50MB per file
- **Location**: `/workspaces/white-cross/mi4/`

## What Gets Logged

### Console (INFO level)
- Task start/completion
- Important events
- Errors and warnings
- Exit codes

### File (DEBUG level)
- Everything from console
- Every subprocess line
- Internal state changes
- Debug information

## Log Format

### Console
```
INFO     | orchestrator    | Executing Codex task 1: Title here
ERROR    | orchestrator    | Task 1 failed with exit code: 1
```

### File
```
2025-11-13 18:36:47 | INFO  | __main__ | _execute_codex_task | Executing Codex task 1: Title
2025-11-13 18:36:47 | ERROR | __main__ | execute_with_process_pool | Task 1 failed with exit code: 1
```

## Common Debugging Patterns

### Why did task fail?
```bash
# Find the error
grep "Task X" orchestrator.log | grep -E "ERROR|failed|exit code"

# See the command
grep "Task X" orchestrator.log | grep "Executing command"

# See stderr output
grep "Task X" orchestrator.log | grep "\[ERR\]"
```

### What's the orchestrator doing?
```bash
# Watch live
tail -f orchestrator.log

# Recent status
tail -50 orchestrator.log | grep -E "Starting task|completed"
```

### Performance issues?
```bash
# Find slow tasks
grep "completed in" orchestrator.log | awk '{if ($(NF-1) > 60) print}'

# Average task time
grep "completed in" orchestrator.log | awk '{sum+=$(NF-1); count++} END {print sum/count}'
```

## Tips

1. **Always check the log file** - Console shows highlights, file has details
2. **Use grep** - Much faster than scrolling
3. **Watch in real-time** - `tail -f` for live debugging
4. **Filter by keyword** - "error", "failed", "Task N", "[agentN]"
5. **Check exit codes** - Non-zero means failure

## Emergency Commands

```bash
# Stop hanging orchestrator
pkill -f orchestrator.py

# Clear logs (keeps last 1MB)
tail -c 1048576 orchestrator.log > orchestrator.log.tmp
mv orchestrator.log.tmp orchestrator.log

# Full log cleanup (WARNING: Deletes all logs)
rm orchestrator.log*
```
