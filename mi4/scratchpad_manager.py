"""
Scratchpad workspace manager for Codex agent temporary file operations.

This module provides isolated workspaces for agents to experiment, test,
and generate code without affecting the main repository.
"""

import asyncio
import shutil
import time
from pathlib import Path
from typing import Dict, List, Optional, Set
from dataclasses import dataclass
import logging

from config import settings as config


@dataclass
class ScratchpadSession:
    """Represents an active scratchpad session."""
    session_id: str
    workspace_path: Path
    created_at: float
    task_id: str
    files_created: Set[str]
    last_accessed: float
    
    def is_expired(self, max_age_hours: int = 24) -> bool:
        """Check if session has expired."""
        age_hours = (time.time() - self.created_at) / 3600
        return age_hours > max_age_hours


class ScratchpadManager:
    """
    Manage isolated scratchpad workspaces for Codex agents.
    
    Features:
    - Isolated workspaces per task
    - Automatic cleanup of expired sessions
    - File tracking and management
    - Session persistence across restarts
    """
    
    def __init__(self):
        self.base_dir = config.scratchpad_dir_path
        self.retention_hours = config.scratchpad_retention_hours
        self.sessions: Dict[str, ScratchpadSession] = {}
        self.logger = logging.getLogger(__name__)
        self._lock = asyncio.Lock()
        
        # Create base scratchpad directory
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self.logger.info(f"Scratchpad manager initialized: {self.base_dir}")
    
    async def create_session(self, task_id: str, session_id: Optional[str] = None) -> ScratchpadSession:
        """
        Create a new scratchpad session for a task.
        
        Args:
            task_id: The task identifier
            session_id: Optional session ID (generated if not provided)
        
        Returns:
            ScratchpadSession instance
        """
        if session_id is None:
            session_id = f"{task_id}_{int(time.time())}"
        
        workspace_path = self.base_dir / session_id
        
        async with self._lock:
            # Create workspace directory
            workspace_path.mkdir(parents=True, exist_ok=True)
            
            # Create README for context
            readme_path = workspace_path / "README.md"
            readme_content = f"""# Scratchpad Workspace: {session_id}

Task ID: {task_id}
Created: {time.strftime('%Y-%m-%d %H:%M:%S')}

This is a temporary workspace for Codex agent experimentation.
Files here will be automatically cleaned up after {self.retention_hours} hours.

## Purpose
Use this space to:
- Test code changes before applying to main repo
- Generate temporary files and scripts
- Experiment with different approaches
- Store intermediate analysis results

## Structure
- `/test/` - Test files and scripts
- `/output/` - Generated outputs
- `/drafts/` - Draft implementations
"""
            readme_path.write_text(readme_content)
            
            # Create standard subdirectories
            (workspace_path / "test").mkdir(exist_ok=True)
            (workspace_path / "output").mkdir(exist_ok=True)
            (workspace_path / "drafts").mkdir(exist_ok=True)
            
            # Create session
            session = ScratchpadSession(
                session_id=session_id,
                workspace_path=workspace_path,
                created_at=time.time(),
                task_id=task_id,
                files_created={str(readme_path)},
                last_accessed=time.time()
            )
            
            self.sessions[session_id] = session
            self.logger.info(f"Created scratchpad session: {session_id}")
            
            return session
    
    async def get_session(self, session_id: str) -> Optional[ScratchpadSession]:
        """Get an existing session."""
        async with self._lock:
            session = self.sessions.get(session_id)
            if session:
                session.last_accessed = time.time()
            return session
    
    async def add_file(self, session_id: str, file_path: Path):
        """Track a file created in a session."""
        async with self._lock:
            session = self.sessions.get(session_id)
            if session:
                session.files_created.add(str(file_path))
                session.last_accessed = time.time()
    
    async def cleanup_session(self, session_id: str) -> bool:
        """
        Clean up a scratchpad session.
        
        Args:
            session_id: The session to clean up
        
        Returns:
            True if cleaned up successfully
        """
        async with self._lock:
            session = self.sessions.get(session_id)
            if not session:
                return False
            
            try:
                # Remove workspace directory
                if session.workspace_path.exists():
                    shutil.rmtree(session.workspace_path)
                
                # Remove from sessions
                del self.sessions[session_id]
                
                self.logger.info(f"Cleaned up session: {session_id}")
                return True
                
            except Exception as e:
                self.logger.error(f"Failed to cleanup session {session_id}: {e}")
                return False
    
    async def cleanup_expired_sessions(self) -> int:
        """
        Clean up expired sessions.
        
        Returns:
            Number of sessions cleaned up
        """
        expired_sessions = []
        
        async with self._lock:
            for session_id, session in list(self.sessions.items()):
                if session.is_expired(self.retention_hours):
                    expired_sessions.append(session_id)
        
        # Clean up outside the lock
        cleaned = 0
        for session_id in expired_sessions:
            if await self.cleanup_session(session_id):
                cleaned += 1
        
        if cleaned > 0:
            self.logger.info(f"Cleaned up {cleaned} expired scratchpad sessions")
        
        return cleaned
    
    async def get_session_stats(self, session_id: str) -> Optional[Dict]:
        """Get statistics for a session."""
        session = await self.get_session(session_id)
        if not session:
            return None
        
        workspace_size = 0
        file_count = 0
        
        try:
            for file_path in session.workspace_path.rglob('*'):
                if file_path.is_file():
                    file_count += 1
                    workspace_size += file_path.stat().st_size
        except Exception as e:
            self.logger.error(f"Failed to get stats for {session_id}: {e}")
        
        return {
            'session_id': session_id,
            'task_id': session.task_id,
            'created_at': session.created_at,
            'last_accessed': session.last_accessed,
            'age_hours': (time.time() - session.created_at) / 3600,
            'files_tracked': len(session.files_created),
            'total_files': file_count,
            'workspace_size_kb': workspace_size / 1024,
            'workspace_path': str(session.workspace_path)
        }
    
    def get_all_stats(self) -> Dict:
        """Get overall scratchpad statistics."""
        total_size = 0
        total_files = 0
        
        try:
            for session in self.sessions.values():
                for file_path in session.workspace_path.rglob('*'):
                    if file_path.is_file():
                        total_files += 1
                        total_size += file_path.stat().st_size
        except Exception as e:
            self.logger.error(f"Failed to get overall stats: {e}")
        
        return {
            'total_sessions': len(self.sessions),
            'total_files': total_files,
            'total_size_mb': total_size / (1024 * 1024),
            'base_dir': str(self.base_dir),
            'retention_hours': self.retention_hours
        }
    
    async def export_session(self, session_id: str, destination: Path) -> bool:
        """
        Export session workspace to a destination.
        
        Args:
            session_id: The session to export
            destination: Destination directory
        
        Returns:
            True if exported successfully
        """
        session = await self.get_session(session_id)
        if not session:
            return False
        
        try:
            if destination.exists():
                shutil.rmtree(destination)
            
            shutil.copytree(session.workspace_path, destination)
            self.logger.info(f"Exported session {session_id} to {destination}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to export session {session_id}: {e}")
            return False
    
    async def list_sessions(self, task_id: Optional[str] = None) -> List[str]:
        """
        List all active sessions, optionally filtered by task.
        
        Args:
            task_id: Optional task ID to filter by
        
        Returns:
            List of session IDs
        """
        async with self._lock:
            if task_id:
                return [
                    sid for sid, session in self.sessions.items()
                    if session.task_id == task_id
                ]
            return list(self.sessions.keys())


# Global scratchpad manager instance
scratchpad_manager = ScratchpadManager()


async def cleanup_expired_scratchpads():
    """Periodic cleanup task for expired scratchpad sessions."""
    while True:
        try:
            await scratchpad_manager.cleanup_expired_sessions()
            await asyncio.sleep(3600)  # Run every hour
        except asyncio.CancelledError:
            break
        except Exception as e:
            logging.error(f"Scratchpad cleanup error: {e}")
            await asyncio.sleep(3600)
