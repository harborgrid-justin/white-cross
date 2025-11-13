#!/usr/bin/env python3
"""Test script to verify Codex CLI integration works correctly."""

import asyncio
import sys
from pathlib import Path

# Add mi4 to path
sys.path.insert(0, str(Path(__file__).parent))

from config import settings
from orchestrator import WhiteCrossOrchestrator


async def test_basic_command():
    """Test basic Codex command execution."""
    print("Testing Codex CLI Integration")
    print("=" * 60)

    # Test 1: Check config
    print("\n1. Testing configuration...")
    print(f"   Command: {settings.codex.command}")
    expected = ['codex', 'exec', '--full-auto', '--sandbox', 'workspace-write']
    if settings.codex.command == expected:
        print("   ✓ Config is correct")
    else:
        print(f"   ✗ Config is wrong. Expected: {expected}")
        return False

    # Test 2: Test subprocess command
    print("\n2. Testing subprocess execution...")
    cmd = settings.codex.command + ["echo 'Hello from test'"]
    print(f"   Running: {' '.join(cmd[:5])}...")

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        # Wait with timeout
        try:
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=10.0)
            exit_code = proc.returncode

            print(f"   Exit code: {exit_code}")
            if stderr:
                stderr_text = stderr.decode('utf-8', errors='replace')
                print(f"   STDERR: {stderr_text[:200]}")
            if stdout:
                stdout_text = stdout.decode('utf-8', errors='replace')
                print(f"   STDOUT: {stdout_text[:200]}")

            if exit_code == 0:
                print("   ✓ Command executed successfully")
                return True
            else:
                print(f"   ✗ Command failed with exit code {exit_code}")
                return False

        except asyncio.TimeoutError:
            proc.kill()
            print("   ✗ Command timed out")
            return False

    except Exception as e:
        print(f"   ✗ Exception: {e}")
        return False


async def test_orchestrator_initialization():
    """Test orchestrator can initialize."""
    print("\n3. Testing orchestrator initialization...")
    try:
        orchestrator = WhiteCrossOrchestrator()
        print("   ✓ Orchestrator created")
        return True
    except Exception as e:
        print(f"   ✗ Failed to create orchestrator: {e}")
        return False


async def main():
    """Run all tests."""
    results = []

    # Run tests
    results.append(await test_basic_command())
    results.append(await test_orchestrator_initialization())

    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")

    if all(results):
        print("✓ All tests passed!")
        return 0
    else:
        print("✗ Some tests failed")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
