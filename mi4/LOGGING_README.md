# White Cross Orchestrator - Logging Guide

## Overview

The orchestrator now has comprehensive logging enabled to help debug issues with Codex execution and task processing.

## Logging Architecture

### Components

1. **logging_config.py** - Centralized logging configuration
   - Colored console output for better readability
   - Rotating file handler (50MB max, 3 backups)
   - Separate log levels for console and file
   - Structured format with timestamps and function names

2. **orchestrator.py** - Main orchestration with logging
   - Task lifecycle logging (start, progress, completion, failure)
   - Subprocess output capture and logging
   - Error context logging (command, exit code, output)
   - Debug logging for internal operations

## Log Levels

### Console Output (INFO by default)
- Task start/completion
- Important subprocess output (errors, warnings, success messages)
- Command execution summaries
- Critical errors with context

### File Output (DEBUG always)
- All console output
- Every line of subprocess output
- Internal state changes
- Detailed command construction
- Scratchpad operations
- Cache operations

## Usage

### Basic Usage
```bash
# Run with default logging (INFO to console, DEBUG to file)
python3 orchestrator.py
```

### Verbose Mode
```bash
# Enable DEBUG level logging to console
python3 orchestrator.py --verbose
# or
python3 orchestrator.py -v
```

### Custom Log File
```bash
# Specify custom log file location
python3 orchestrator.py --log-file /path/to/custom.log
```

## Log File Location

Default: `/workspaces/white-cross/mi4/orchestrator.log`

The log file uses rotation:
- Maximum size: 50MB
- Backup count: 3
- Old logs: orchestrator.log.1, orchestrator.log.2, orchestrator.log.3

## Log Format

### Console
```
INFO     | orchestrator                | Executing Codex task 1: Implement user authentication
```

### File
```
2025-11-13 18:30:45 | INFO     | orchestrator                   | _execute_codex_task  | Executing Codex task 1: Implement user authentication
```

## What Gets Logged

### Task Execution
- ✓ Task start with ID and title
- ✓ Command construction and summary
- ✓ All subprocess stdout/stderr (to file)
- ✓ Important subprocess lines (to console)
- ✓ Exit code and status
- ✓ Error output (last 10 lines)
- ✓ Execution time
- ✓ Task completion status

### Subprocess Output Filtering
Lines containing these keywords are logged to console:
- error
- failed
- warning
- success
- completed

All other lines are logged to file only.

### Error Logging
When a task fails, you'll see:
- ✓ Exit code
- ✓ Full command that was executed
- ✓ Last 10 lines of stderr
- ✓ Stack trace for exceptions
- ✓ Full error context

### Debug Information (--verbose only)
- Adaptive token budgeting
- Scratchpad creation and stats
- Cache hits/misses
- Internal state changes
- Process pool operations

## Debugging Common Issues

### Codex Command Failures

Look for lines like:
```
ERROR    | orchestrator                | Task 1 failed with exit code: 1
ERROR    | orchestrator                | Command: codex exec -C /workspaces/white-cross --add-dir ... [prompt]
ERROR    | orchestrator                | Task 1 stderr output:
ERROR    | orchestrator                |   Error: Invalid command
```

### Task Timeouts

Look for:
```
ERROR    | orchestrator                | Task 1 timed out after 3600s
ERROR    | orchestrator                | Command: codex exec ...
```

### Missing Dependencies

Look for subprocess output:
```
DEBUG    | orchestrator                | [Task 1][ERR] ModuleNotFoundError: No module named 'xyz'
```

### Permission Issues

Look for:
```
INFO     | orchestrator                | [agent1][Task 1][ERR] Permission denied: /path/to/file
```

## Performance Monitoring

The logging system captures performance metrics:

```bash
# View execution times
grep "completed in" orchestrator.log

# View failed tasks
grep "failed with exit code" orchestrator.log

# View all errors
grep "ERROR" orchestrator.log

# View specific task
grep "Task 1" orchestrator.log
```

## Log Analysis Commands

```bash
# Count tasks by status
grep -c "marked as done" orchestrator.log
grep -c "marked as error" orchestrator.log

# Find slow tasks (>5 minutes)
grep "completed in" orchestrator.log | awk '{if ($NF > 300) print}'

# View agent activity
grep "^\[agent1\]" orchestrator.log

# Find all Codex errors
grep "\[ERR\]" orchestrator.log | grep -i error

# View recent activity (last 100 lines)
tail -100 orchestrator.log
```

## Troubleshooting

### No logs appearing in file
Check:
1. File permissions: `ls -la orchestrator.log`
2. Disk space: `df -h`
3. File handler initialization in logs

### Too much output
Use:
1. Default mode (not --verbose)
2. Filter console output: `python3 orchestrator.py 2>&1 | grep ERROR`
3. Only check log file for details

### Missing subprocess output
- Subprocess output is ALWAYS captured (both stdout and stderr)
- Check the log file with: `grep "\[OUT\]\|\[ERR\]" orchestrator.log`
- Important lines appear on console
- All lines appear in file

## Best Practices

1. **Use verbose mode for debugging**: `--verbose`
2. **Check log file for full details**: `tail -f orchestrator.log`
3. **Search by task ID**: `grep "Task 1" orchestrator.log`
4. **Monitor in real-time**: `tail -f orchestrator.log | grep ERROR`
5. **Archive old logs**: Rotation happens automatically
6. **Clean up logs**: `rm orchestrator.log.* ` (keeps main log)

## Example Debugging Session

```bash
# 1. Run with verbose logging
python3 orchestrator.py --verbose

# 2. In another terminal, watch the log
tail -f orchestrator.log

# 3. Filter for specific agent
tail -f orchestrator.log | grep "\[agent1\]"

# 4. Find what went wrong
grep "Task 1" orchestrator.log | grep -A 10 "ERROR"

# 5. Check subprocess output
grep "Task 1" orchestrator.log | grep "\[ERR\]"
```

## Integration with Monitoring

The logging system integrates with:
- Task metrics tracking
- Performance profiling
- Health monitoring
- Circuit breaker state
- Token usage tracking

All these are logged appropriately for debugging.

## Future Enhancements

Planned improvements:
- [ ] JSON structured logging option
- [ ] Log shipping to external systems
- [ ] Real-time log streaming API
- [ ] Log aggregation across agents
- [ ] Automatic error pattern detection
- [ ] Log-based alerting

## Support

For issues with logging:
1. Check this README
2. Review orchestrator.log
3. Run with --verbose
4. Check logging_config.py for configuration
5. Verify file permissions and disk space
