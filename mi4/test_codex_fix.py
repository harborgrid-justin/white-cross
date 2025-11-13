#!/usr/bin/env python3
"""Test script to verify the Codex CLI integration fixes."""

import asyncio
import sys
from pathlib import Path

# Add mi4 to path
sys.path.insert(0, str(Path(__file__).parent))

from config import settings


async def test_codex_command():
    """Test that the Codex command works end-to-end."""
    print("Testing Codex CLI Integration Fix")
    print("=" * 70)

    # Test 1: Verify configuration
    print("\n1. Configuration Check:")
    print(f"   Command: {settings.codex.command}")
    expected = ['codex', 'exec', '--full-auto', '--sandbox', 'workspace-write']
    if settings.codex.command == expected:
        print("   ✓ Configuration is correct")
    else:
        print(f"   ✗ Expected: {expected}")
        return False

    # Test 2: Test subprocess execution with stdin handling
    print("\n2. Subprocess Execution Test:")
    cmd = settings.codex.command + ["echo 'Test successful'"]
    print(f"   Command: {' '.join(cmd[:5])}... (prompt truncated)")

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdin=asyncio.subprocess.PIPE,  # THIS WAS THE KEY FIX
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        # Close stdin immediately (THIS WAS THE KEY FIX)
        if proc.stdin:
            proc.stdin.close()

        print("   Waiting for completion (10s timeout)...")
        try:
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=10.0)
            exit_code = proc.returncode

            print(f"   Exit code: {exit_code}")

            if exit_code == 0:
                print("   ✓ Command executed successfully")
                if stdout:
                    stdout_text = stdout.decode('utf-8', errors='replace')
                    print(f"   Output preview: {stdout_text[:100]}")
                return True
            else:
                print(f"   ✗ Command failed with exit code {exit_code}")
                if stderr:
                    stderr_text = stderr.decode('utf-8', errors='replace')
                    print(f"   STDERR: {stderr_text[:200]}")
                return False

        except asyncio.TimeoutError:
            print("   ✗ Command timed out")
            proc.kill()
            await proc.wait()
            return False

    except Exception as e:
        print(f"   ✗ Exception: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_error_logging():
    """Test that error logging captures stderr properly."""
    print("\n3. Error Logging Test:")

    # Intentionally use an invalid flag to trigger an error
    cmd = ['codex', 'exec', '--invalid-flag', 'test']
    print(f"   Testing error capture with: {' '.join(cmd)}")

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        if proc.stdin:
            proc.stdin.close()

        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=5.0)
        exit_code = proc.returncode

        if exit_code != 0:
            stderr_text = stderr.decode('utf-8', errors='replace')
            if stderr_text and 'error' in stderr_text.lower():
                print(f"   ✓ Error properly captured in stderr")
                print(f"   Sample: {stderr_text[:100]}")
                return True
            else:
                print(f"   ✗ No error message in stderr")
                return False
        else:
            print(f"   ✗ Command unexpectedly succeeded")
            return False

    except asyncio.TimeoutError:
        print("   ✗ Timed out")
        proc.kill()
        await proc.wait()
        return False
    except Exception as e:
        print(f"   ✗ Exception: {e}")
        return False


async def main():
    """Run all tests."""
    results = []

    # Run tests
    results.append(await test_codex_command())
    results.append(await test_error_logging())

    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")

    if all(results):
        print("\n✓ All tests passed!")
        print("\nKey Fixes Applied:")
        print("1. Removed invalid '--ask-for-approval' flag from config.py")
        print("2. Added stdin=asyncio.subprocess.PIPE to subprocess creation")
        print("3. Close stdin immediately after process creation")
        print("4. Split stdout/stderr tracking for better error reporting")
        print("5. Added detailed error logging with first 5 lines of output")
        print("6. Added exc_info=True for better exception tracing")
        return 0
    else:
        print("\n✗ Some tests failed")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
