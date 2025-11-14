#!/usr/bin/env bash
# Setup script for MI4 Orchestrator with all optimizations

set -e

echo "🚀 MI4 Orchestrator Setup & Optimization"
echo "========================================"
echo ""

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Install/upgrade pip
echo ""
echo "📦 Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements
echo ""
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

# Check for codex CLI
echo ""
echo "🔍 Checking for Codex CLI..."
if command -v codex &> /dev/null; then
    echo "✅ Codex CLI found: $(which codex)"
    codex --version
else
    echo "❌ Codex CLI not found!"
    echo "   Install from: https://codex.anthropic.com"
    echo "   Or run: npm install -g @anthropic-ai/codex-cli"
    exit 1
fi

# Create scratchpad directory
echo ""
echo "📝 Creating scratchpad directory..."
mkdir -p scratchpad/{test,output,drafts}
echo "✅ Scratchpad created at: ./scratchpad/"

# Create .env template if not exists
if [ ! -f .env ]; then
    echo ""
    echo "📄 Creating .env template..."
    cat > .env << 'EOF'
# MI4 Orchestrator Configuration

# Redis LangCache (Required for semantic caching)
LANGCACHE_ENABLED=true
LANGCACHE_SERVER_URL=https://gcp-us-east4.langcache.redis.io
LANGCACHE_CACHE_ID=e257ac5aa004431695433df5999f8510
LANGCACHE_API_KEY=your_api_key_here

# API Keys (Optional but recommended)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
REDIS_URL=redis://localhost:6379

# Orchestration Settings
ORCHESTRATION__MAX_AGENTS=3
CODEX__ENABLE_WEB_SEARCH=false
CODEX__MODEL=

# Efficiency Features
CODEX__ENABLE_PROCESS_REUSE=true
CODEX__ENABLE_TASK_BATCHING=true
CODEX__ENABLE_ADAPTIVE_BUDGETING=true
CODEX__ENABLE_CACHING=true

# Scratchpad Settings
SCRATCHPAD_RETENTION_HOURS=24
EOF
    echo "✅ Created .env template"
    echo "⚠️  Please update .env with your API keys!"
else
    echo "✅ .env file already exists"
fi

# Test imports
echo ""
echo "🧪 Testing Python imports..."
python -c "
import asyncio
import tiktoken
from pydantic import BaseModel
from rich.console import Console
print('✅ All core imports successful')
"

# Test LangCache
echo ""
echo "🧪 Testing LangCache..."
python -c "
try:
    from langcache import LangCache
    print('✅ LangCache available')
except ImportError:
    print('⚠️  LangCache not available - install with: pip install langcache')
"

# Create initial tasks.json if not exists
if [ ! -f tasks.json ]; then
    echo ""
    echo "📋 Creating initial tasks.json..."
    cat > tasks.json << 'EOF'
[
  {
    "id": "example-1",
    "title": "Example Task",
    "description": "This is an example task. Replace with your actual tasks.",
    "status": "done",
    "created_at": "2025-11-13T00:00:00Z"
  }
]
EOF
    echo "✅ Created tasks.json"
fi

# Test configuration
echo ""
echo "🧪 Testing configuration..."
python -c "
from config import settings
print(f'✅ Config loaded successfully')
print(f'   Base dir: {settings.base_dir}')
print(f'   Max agents: {settings.orchestration.max_agents}')
print(f'   LangCache enabled: {settings.langcache_enabled}')
print(f'   Scratchpad dir: {settings.scratchpad_dir_path}')
"

# Run quick validation
echo ""
echo "🧪 Validating orchestrator..."
python -c "
import asyncio
from orchestrator import WhiteCrossOrchestrator

async def validate():
    orch = WhiteCrossOrchestrator()
    print('✅ Orchestrator initialized successfully')
    print(f'   Process pool max workers: {orch.process_pool.max_workers}')
    print(f'   Circuit breaker threshold: {orch.circuit_breaker.failure_threshold}')
    print(f'   Task batcher size: {orch.task_batcher.batch_size}')

asyncio.run(validate())
"

echo ""
echo "=" "========================================="
echo "🎉 Setup Complete!"
echo "==========================================="
echo ""
echo "Next steps:"
echo "1. Update .env with your API keys"
echo "2. Review tasks.json and add your tasks"
echo "3. Run: python orchestrator.py"
echo ""
echo "Optimization Features Enabled:"
echo "✅ Process pool management"
echo "✅ Circuit breaker pattern"
echo "✅ Task batching"
echo "✅ Semantic caching (LangCache)"
echo "✅ Scratchpad workspaces"
echo "✅ Adaptive token budgeting"
echo "✅ Performance monitoring"
echo ""
echo "Useful commands:"
echo "  python orchestrator.py              # Run orchestrator"
echo "  python performance_monitor.py       # Monitor performance"
echo "  codex --help                        # View Codex options"
echo ""
