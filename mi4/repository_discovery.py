"""
Repository discovery and analysis module for the White Cross Orchestrator.

This module provides advanced repository discovery capabilities, leveraging insights
from OpenAI package analysis to identify optimization opportunities and hidden features.
"""

import asyncio
import os
import json
import subprocess
import re
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple, Any
from dataclasses import dataclass, field
from concurrent.futures import ThreadPoolExecutor
import logging

try:
    import git
    GIT_AVAILABLE = True
except ImportError:
    GIT_AVAILABLE = False

try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False


@dataclass
class RepositoryInfo:
    """Information about a discovered repository."""
    path: str
    name: str
    is_git_repo: bool = False
    has_package_json: bool = False
    has_requirements_txt: bool = False
    has_pyproject_toml: bool = False
    has_openai_deps: bool = False
    has_codex_config: bool = False
    language: Optional[str] = None
    frameworks: List[str] = field(default_factory=list)
    openai_features: List[str] = field(default_factory=list)
    last_modified: Optional[float] = None
    size_mb: float = 0.0


@dataclass
class OpenAIFeatureAnalysis:
    """Analysis of OpenAI features discovered in repositories."""
    streaming_apis: bool = False
    realtime_features: bool = False
    advanced_error_handling: bool = False
    upload_utilities: bool = False
    batch_processing: bool = False
    custom_endpoints: bool = False
    rate_limiting: bool = False
    caching_mechanisms: bool = False
    discovered_features: List[str] = field(default_factory=list)


class RepositoryDiscoverer:
    """Advanced repository discovery and analysis engine."""
    
    def __init__(self, base_paths: Optional[List[str]] = None):
        self.base_paths = base_paths or ["/workspaces"]
        self.logger = logging.getLogger(__name__)
        self._executor = ThreadPoolExecutor(max_workers=4)
        
        # OpenAI package analysis patterns
        self.openai_patterns = {
            'streaming': [
                r'stream.*=.*True',
                r'for.*chunk.*in.*stream',
                r'stream\.on\(',
                r'StreamingResponse'
            ],
            'realtime': [
                r'realtime',
                r'websocket',
                r'live.*audio',
                r'real.*time'
            ],
            'error_handling': [
                r'APIError',
                r'RateLimitError',
                r'AuthenticationError',
                r'retry.*backoff',
                r'exponential.*backoff'
            ],
            'uploads': [
                r'upload.*file',
                r'multipart',
                r'FormData',
                r'files.*='
            ],
            'batch': [
                r'batch',
                r'bulk',
                r'multiple.*request'
            ],
            'custom_endpoints': [
                r'base_url',
                r'custom.*endpoint',
                r'api.*key.*custom'
            ],
            'rate_limiting': [
                r'rate.*limit',
                r'throttle',
                r'backoff',
                r'retry.*after'
            ],
            'caching': [
                r'cache',
                r'memoize',
                r'lru_cache',
                r'redis'
            ]
        }
    
    async def discover_repositories(self, max_depth: int = 3) -> List[RepositoryInfo]:
        """Discover all repositories in the base paths."""
        all_repos = []
        
        for base_path in self.base_paths:
            if not os.path.exists(base_path):
                self.logger.warning(f"Base path does not exist: {base_path}")
                continue
            
            repos = await self._scan_directory(base_path, max_depth)
            all_repos.extend(repos)
        
        # Remove duplicates and sort by relevance
        unique_repos = self._deduplicate_repositories(all_repos)
        return sorted(unique_repos, key=lambda x: (x.has_openai_deps, x.has_codex_config), reverse=True)
    
    async def _scan_directory(self, path: str, max_depth: int, current_depth: int = 0) -> List[RepositoryInfo]:
        """Recursively scan directory for repositories."""
        if current_depth > max_depth:
            return []
        
        repos = []
        
        try:
            entries = await asyncio.get_event_loop().run_in_executor(
                self._executor, os.scandir, path
            )
            
            subdirs = []
            for entry in entries:
                if entry.is_dir() and not entry.name.startswith('.'):
                    # Check if this directory is a repository
                    repo_info = await self._analyze_directory(entry.path)
                    if repo_info:
                        repos.append(repo_info)
                    
                    # Continue scanning subdirectories
                    subdirs.append(entry.path)
            
            # Recursively scan subdirectories
            for subdir in subdirs:
                sub_repos = await self._scan_directory(subdir, max_depth, current_depth + 1)
                repos.extend(sub_repos)
                
        except (OSError, PermissionError) as e:
            self.logger.warning(f"Error scanning directory {path}: {e}")
        
        return repos
    
    async def _analyze_directory(self, path: str) -> Optional[RepositoryInfo]:
        """Analyze a directory to determine if it's a repository and extract metadata."""
        try:
            path_obj = Path(path)
            stat = path_obj.stat()
            
            # Check for repository indicators
            is_git = (path_obj / '.git').exists()
            has_package_json = (path_obj / 'package.json').exists()
            has_requirements_txt = (path_obj / 'requirements.txt').exists()
            has_pyproject_toml = (path_obj / 'pyproject.toml').exists()
            
            # Only consider it a repository if it has version control or package files
            if not (is_git or has_package_json or has_requirements_txt or has_pyproject_toml):
                return None
            
            repo_info = RepositoryInfo(
                path=str(path_obj),
                name=path_obj.name,
                is_git_repo=is_git,
                has_package_json=has_package_json,
                has_requirements_txt=has_requirements_txt,
                has_pyproject_toml=has_pyproject_toml,
                last_modified=stat.st_mtime,
                size_mb=stat.st_size / (1024 * 1024)
            )
            
            # Analyze contents
            await self._analyze_repository_contents(repo_info)
            
            return repo_info
            
        except (OSError, PermissionError) as e:
            self.logger.warning(f"Error analyzing directory {path}: {e}")
            return None
    
    async def _analyze_repository_contents(self, repo_info: RepositoryInfo):
        """Analyze repository contents for language, frameworks, and OpenAI features."""
        try:
            # Determine primary language
            repo_info.language = self._detect_language(repo_info.path)
            
            # Detect frameworks
            repo_info.frameworks = await self._detect_frameworks(repo_info.path)
            
            # Analyze OpenAI usage and features
            openai_analysis = await self._analyze_openai_usage(repo_info.path)
            repo_info.has_openai_deps = openai_analysis.has_openai_dependencies()
            repo_info.has_codex_config = openai_analysis.has_codex_config
            repo_info.openai_features = openai_analysis.discovered_features
            
        except Exception as e:
            self.logger.warning(f"Error analyzing contents of {repo_info.path}: {e}")
    
    def _detect_language(self, path: str) -> Optional[str]:
        """Detect the primary programming language of the repository."""
        path_obj = Path(path)
        
        # Check for language-specific files
        if (path_obj / 'package.json').exists():
            return 'javascript'
        elif (path_obj / 'requirements.txt').exists() or (path_obj / 'pyproject.toml').exists():
            return 'python'
        elif (path_obj / 'Cargo.toml').exists():
            return 'rust'
        elif (path_obj / 'go.mod').exists():
            return 'go'
        elif (path_obj / 'pom.xml').exists() or (path_obj / 'build.gradle').exists():
            return 'java'
        
        # Check file extensions in the directory
        extensions = []
        for file_path in path_obj.rglob('*'):
            if file_path.is_file():
                extensions.append(file_path.suffix.lower())
        
        # Count extensions
        from collections import Counter
        ext_counts = Counter(extensions)
        
        # Map extensions to languages
        lang_map = {
            '.py': 'python',
            '.js': 'javascript',
            '.ts': 'typescript',
            '.java': 'java',
            '.go': 'go',
            '.rs': 'rust',
            '.cpp': 'cpp',
            '.c': 'c',
            '.php': 'php',
            '.rb': 'ruby'
        }
        
        for ext, lang in lang_map.items():
            if ext in ext_counts and ext_counts[ext] > 0:
                return lang
        
        return None
    
    async def _detect_frameworks(self, path: str) -> List[str]:
        """Detect frameworks used in the repository."""
        frameworks = []
        path_obj = Path(path)
        
        try:
            # Check package.json for Node.js frameworks
            if (path_obj / 'package.json').exists():
                with open(path_obj / 'package.json', 'r') as f:
                    package_data = json.load(f)
                
                deps = {**package_data.get('dependencies', {}), **package_data.get('devDependencies', {})}
                
                framework_deps = {
                    'react': 'react',
                    'vue': 'vue',
                    'angular': 'angular',
                    'express': 'express',
                    'next': 'next.js',
                    'nuxt': 'nuxt.js',
                    'svelte': 'svelte',
                    'nestjs': '@nestjs/core',
                    'fastify': 'fastify'
                }
                
                for dep, framework in framework_deps.items():
                    if dep in deps:
                        frameworks.append(framework)
            
            # Check requirements.txt for Python frameworks
            if (path_obj / 'requirements.txt').exists():
                with open(path_obj / 'requirements.txt', 'r') as f:
                    requirements = f.read().lower()
                
                framework_patterns = {
                    'django': 'django',
                    'flask': 'flask',
                    'fastapi': 'fastapi',
                    'tornado': 'tornado',
                    'bottle': 'bottle'
                }
                
                for pattern, framework in framework_patterns.items():
                    if pattern in requirements:
                        frameworks.append(framework)
                        
        except Exception as e:
            self.logger.warning(f"Error detecting frameworks in {path}: {e}")
        
        return frameworks
    
    async def _analyze_openai_usage(self, path: str) -> 'OpenAIAnalysisResult':
        """Analyze OpenAI usage patterns and features in the repository."""
        result = OpenAIAnalysisResult()
        path_obj = Path(path)
        
        try:
            # Search for OpenAI-related files and code
            for file_path in path_obj.rglob('*'):
                if file_path.is_file() and file_path.suffix in ['.py', '.js', '.ts', '.json']:
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        # Check for OpenAI imports/requires
                        if self._contains_openai_imports(content):
                            result.has_openai_deps = True
                        
                        # Check for Codex configuration
                        if 'codex' in content.lower() or 'gpt-4' in content.lower():
                            result.has_codex_config = True
                        
                        # Analyze for advanced features
                        await self._analyze_code_for_features(content, result)
                        
                    except Exception as e:
                        continue  # Skip files that can't be read
                        
        except Exception as e:
            self.logger.warning(f"Error analyzing OpenAI usage in {path}: {e}")
        
        return result
    
    def _contains_openai_imports(self, content: str) -> bool:
        """Check if content contains OpenAI imports."""
        patterns = [
            r'import.*openai',
            r'from.*openai',
            r'require.*openai',
            r'import.*OpenAI',
            r'const.*openai',
            r'openai\s*=',
            r'new\s+OpenAI'
        ]
        
        return any(re.search(pattern, content, re.IGNORECASE) for pattern in patterns)
    
    async def _analyze_code_for_features(self, content: str, result: 'OpenAIAnalysisResult'):
        """Analyze code for OpenAI advanced features."""
        for feature_type, patterns in self.openai_patterns.items():
            for pattern in patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    setattr(result, feature_type, True)
                    if feature_type not in result.discovered_features:
                        result.discovered_features.append(feature_type)
                    break
    
    def _deduplicate_repositories(self, repos: List[RepositoryInfo]) -> List[RepositoryInfo]:
        """Remove duplicate repositories based on path."""
        seen_paths = set()
        unique_repos = []
        
        for repo in repos:
            if repo.path not in seen_paths:
                seen_paths.add(repo.path)
                unique_repos.append(repo)
        
        return unique_repos


@dataclass
class OpenAIAnalysisResult:
    """Result of OpenAI usage analysis."""
    has_openai_deps: bool = False
    has_codex_config: bool = False
    streaming: bool = False
    realtime: bool = False
    error_handling: bool = False
    uploads: bool = False
    batch: bool = False
    custom_endpoints: bool = False
    rate_limiting: bool = False
    caching: bool = False
    discovered_features: List[str] = field(default_factory=list)
    
    def has_openai_dependencies(self) -> bool:
        return self.has_openai_deps
    
    def get_advanced_features(self) -> List[str]:
        """Get list of advanced OpenAI features detected."""
        features = []
        if self.streaming: features.append('streaming')
        if self.realtime: features.append('realtime')
        if self.error_handling: features.append('advanced_error_handling')
        if self.uploads: features.append('upload_utilities')
        if self.batch: features.append('batch_processing')
        if self.custom_endpoints: features.append('custom_endpoints')
        if self.rate_limiting: features.append('rate_limiting')
        if self.caching: features.append('caching_mechanisms')
        return features


class RepositoryAnalyzer:
    """Advanced repository analyzer with OpenAI optimization insights."""
    
    def __init__(self):
        self.discoverer = RepositoryDiscoverer()
        self.logger = logging.getLogger(__name__)
    
    async def analyze_workspace(self) -> Dict[str, Any]:
        """Perform comprehensive analysis of the workspace."""
        self.logger.info("Starting comprehensive workspace analysis...")
        
        # Discover repositories
        repositories = await self.discoverer.discover_repositories()
        
        # Analyze OpenAI usage patterns
        openai_analysis = await self._analyze_openai_patterns(repositories)
        
        # Generate optimization recommendations
        recommendations = self._generate_optimization_recommendations(repositories, openai_analysis)
        
        return {
            'repositories': [repo.__dict__ for repo in repositories],
            'openai_analysis': openai_analysis,
            'recommendations': recommendations,
            'summary': self._generate_summary(repositories, openai_analysis)
        }
    
    async def _analyze_openai_patterns(self, repositories: List[RepositoryInfo]) -> Dict[str, Any]:
        """Analyze OpenAI usage patterns across repositories."""
        patterns = {
            'total_repos_with_openai': 0,
            'repos_with_codex': 0,
            'feature_usage': {},
            'language_distribution': {},
            'framework_integration': {}
        }
        
        for repo in repositories:
            if repo.has_openai_deps:
                patterns['total_repos_with_openai'] += 1
            
            if repo.has_codex_config:
                patterns['repos_with_codex'] += 1
            
            # Track feature usage
            for feature in repo.openai_features:
                patterns['feature_usage'][feature] = patterns['feature_usage'].get(feature, 0) + 1
            
            # Track language distribution
            if repo.language:
                patterns['language_distribution'][repo.language] = \
                    patterns['language_distribution'].get(repo.language, 0) + 1
            
            # Track framework integration
            for framework in repo.frameworks:
                patterns['framework_integration'][framework] = \
                    patterns['framework_integration'].get(framework, 0) + 1
        
        return patterns
    
    def _generate_optimization_recommendations(self, repositories: List[RepositoryInfo], 
                                             openai_analysis: Dict[str, Any]) -> List[str]:
        """Generate optimization recommendations based on analysis."""
        recommendations = []
        
        # Check for streaming opportunities
        streaming_usage = openai_analysis['feature_usage'].get('streaming', 0)
        if streaming_usage == 0:
            recommendations.append(
                "Consider implementing streaming APIs for real-time responses and better user experience"
            )
        
        # Check for error handling improvements
        error_handling = openai_analysis['feature_usage'].get('error_handling', 0)
        if error_handling < len([r for r in repositories if r.has_openai_deps]) * 0.5:
            recommendations.append(
                "Implement comprehensive error handling with exponential backoff and rate limit recovery"
            )
        
        # Check for batch processing opportunities
        batch_usage = openai_analysis['feature_usage'].get('batch', 0)
        if batch_usage == 0:
            recommendations.append(
                "Consider batch processing for multiple requests to optimize API usage and costs"
            )
        
        # Check for caching opportunities
        caching_usage = openai_analysis['feature_usage'].get('caching', 0)
        if caching_usage == 0:
            recommendations.append(
                "Implement response caching to reduce API calls and improve performance"
            )
        
        # Language-specific recommendations
        python_repos = [r for r in repositories if r.language == 'python' and r.has_openai_deps]
        if python_repos:
            recommendations.append(
                "Python repositories: Leverage asyncio for concurrent OpenAI API calls"
            )
        
        js_repos = [r for r in repositories if r.language in ['javascript', 'typescript'] and r.has_openai_deps]
        if js_repos:
            recommendations.append(
                "JavaScript/TypeScript: Consider using OpenAI's streaming APIs with async generators"
            )
        
        return recommendations
    
    def _generate_summary(self, repositories: List[RepositoryInfo], 
                         openai_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate analysis summary."""
        total_repos = len(repositories)
        openai_repos = len([r for r in repositories if r.has_openai_deps])
        
        return {
            'total_repositories': total_repos,
            'repositories_with_openai': openai_repos,
            'openai_adoption_rate': openai_repos / total_repos if total_repos > 0 else 0,
            'most_used_features': sorted(
                openai_analysis['feature_usage'].items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:5],
            'primary_languages': sorted(
                openai_analysis['language_distribution'].items(),
                key=lambda x: x[1],
                reverse=True
            )[:3]
        }


# Global instances
discoverer = RepositoryDiscoverer()
analyzer = RepositoryAnalyzer()