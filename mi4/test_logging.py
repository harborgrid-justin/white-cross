#!/usr/bin/env python3
"""
Test script to verify logging configuration works correctly.
"""

import asyncio
import sys
from pathlib import Path
from logging_config import setup_orchestrator_logging, get_logger


async def test_basic_logging():
    """Test basic logging functionality."""
    print("=" * 60)
    print("Testing Logging Configuration")
    print("=" * 60)

    # Setup logging
    root_logger = setup_orchestrator_logging(verbose=False)
    logger = get_logger(__name__)

    print("\n1. Testing log levels...")
    logger.debug("This is a DEBUG message (should only appear in file)")
    logger.info("This is an INFO message (should appear in console and file)")
    logger.warning("This is a WARNING message")
    logger.error("This is an ERROR message")

    print("\n2. Testing subprocess simulation...")
    logger.info("[agent1] Starting task 999: Test Task")
    logger.debug("[agent1] Command: codex exec [prompt]")
    logger.info("[agent1][Task 999][OUT] Processing files...")
    logger.debug("[agent1][Task 999][OUT] Reading package.json")
    logger.info("[agent1][Task 999][OUT] Success: Files processed")
    logger.error("[agent1][Task 999][ERR] Warning: Deprecated API used")
    logger.info("[agent1] Task 999 completed successfully (exit: 0)")

    print("\n3. Testing error context...")
    try:
        raise ValueError("Test exception for logging")
    except Exception as e:
        logger.error(f"Exception occurred: {e}", exc_info=True)

    print("\n4. Checking log file...")
    log_file = Path(__file__).parent / "orchestrator.log"
    if log_file.exists():
        print(f"✓ Log file exists: {log_file}")
        size = log_file.stat().st_size
        print(f"✓ Log file size: {size} bytes")

        # Read last few lines
        with open(log_file, 'r') as f:
            lines = f.readlines()
            print(f"✓ Total lines in log: {len(lines)}")
            print("\nLast 5 lines from log file:")
            for line in lines[-5:]:
                print(f"  {line.rstrip()}")
    else:
        print(f"✗ Log file not found: {log_file}")

    print("\n5. Testing verbose mode...")
    root_logger = setup_orchestrator_logging(verbose=True)
    logger = get_logger(__name__)
    logger.debug("This DEBUG message should now appear in console")
    logger.info("This INFO message should still appear")

    print("\n" + "=" * 60)
    print("Logging Test Complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Check orchestrator.log for all messages")
    print("2. Verify colors in console output")
    print("3. Run: tail -f orchestrator.log")
    print("4. Run: python3 orchestrator.py --verbose")


async def test_subprocess_logging():
    """Test actual subprocess logging."""
    print("\n" + "=" * 60)
    print("Testing Subprocess Output Capture")
    print("=" * 60)

    logger = get_logger(__name__)

    print("\n1. Running a simple subprocess...")
    proc = await asyncio.create_subprocess_exec(
        'echo', 'Hello from subprocess',
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    output_lines = []
    error_lines = []

    async def stream_output(stream, label, line_list):
        while True:
            line = await stream.readline()
            if not line:
                break
            text = line.decode(errors="replace").rstrip("\n")
            line_list.append(text)
            logger.debug(f"[Test][{label}] {text}")
            if any(keyword in text.lower() for keyword in ['error', 'success', 'hello']):
                logger.info(f"[Test][{label}] {text}")

    await asyncio.gather(
        stream_output(proc.stdout, "OUT", output_lines),
        stream_output(proc.stderr, "ERR", error_lines)
    )

    exit_code = await proc.wait()

    print(f"\n2. Subprocess exit code: {exit_code}")
    print(f"3. Captured {len(output_lines)} output lines")
    print(f"4. Captured {len(error_lines)} error lines")

    if exit_code == 0:
        logger.info("Test subprocess completed successfully")
    else:
        logger.error(f"Test subprocess failed with exit code: {exit_code}")

    print("\n" + "=" * 60)
    print("Subprocess Test Complete!")
    print("=" * 60)


async def main():
    """Run all tests."""
    await test_basic_logging()
    await test_subprocess_logging()

    print("\n" + "=" * 60)
    print("ALL TESTS COMPLETE")
    print("=" * 60)
    print("\nTo test with orchestrator:")
    print("  python3 orchestrator.py --verbose")
    print("\nTo monitor logs in real-time:")
    print("  tail -f orchestrator.log")
    print("  tail -f orchestrator.log | grep ERROR")
    print("  tail -f orchestrator.log | grep '\\[Task'")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
    except Exception as e:
        print(f"\n\nTest failed: {e}")
        import traceback
        traceback.print_exc()
