#!/usr/bin/env python3
"""
Configuration Diagnostic Tool

This script validates that the configuration is correctly loaded and all
environment variables are properly set.
"""

import sys
from pathlib import Path
import json


def test_config_loading():
    """Test configuration loading."""
    print("=" * 70)
    print("CONFIGURATION DIAGNOSTIC TOOL")
    print("=" * 70)
    print()

    # Test 1: Import config
    print("Test 1: Configuration Loading")
    print("-" * 70)
    try:
        from config import settings, validate_environment

        print("✅ Configuration module imported successfully")
        print(f"   Base directory: {settings.base_dir}")
        print()

        # Run validation
        diagnostics = validate_environment()
        print("Environment Diagnostics:")
        for key, value in diagnostics.items():
            icon = "✅" if value else "❌"
            if isinstance(value, bool):
                print(f"   {icon} {key}: {value}")
            else:
                print(f"   ℹ️  {key}: {value}")

    except Exception as e:
        print(f"❌ Failed to import configuration: {e}")
        import traceback
        traceback.print_exc()
        return False

    print()

    # Test 2: LangCache Configuration
    print("Test 2: LangCache Configuration")
    print("-" * 70)
    try:
        api_key = settings.langcache_api_key
        if api_key:
            print(f"✅ LangCache API key configured (length: {len(api_key)})")
            print(f"   Server: {settings.langcache_server_url}")
            print(f"   Cache ID: {settings.langcache_cache_id}")
            print(f"   Enabled: {settings.langcache_enabled}")
        else:
            print("❌ LangCache API key NOT configured")
            print("   Please set LANGCACHE_API_KEY in .env file")
    except Exception as e:
        print(f"❌ Failed to check LangCache configuration: {e}")

    print()

    # Test 3: LangCache Initialization
    print("Test 3: LangCache Initialization")
    print("-" * 70)
    try:
        from langcache_integration import semantic_cache

        print(f"✅ LangCache integration imported successfully")
        print(f"   Enabled: {semantic_cache.enabled}")
        print(f"   Initialized: {semantic_cache._lang_cache is not None}")

        if not semantic_cache.enabled:
            print("   ⚠️  LangCache is disabled")
        elif semantic_cache._lang_cache is None:
            print("   ⚠️  LangCache not initialized")
        else:
            print("   ✅ LangCache ready to use")

    except Exception as e:
        print(f"❌ Failed to initialize LangCache: {e}")
        import traceback
        traceback.print_exc()

    print()

    # Test 4: Other API Keys
    print("Test 4: Other API Keys")
    print("-" * 70)
    print(f"   OpenAI API Key: {'✅ Configured' if settings.openai_api_key else '❌ Not configured'}")
    print(f"   Anthropic API Key: {'✅ Configured' if settings.anthropic_api_key else '❌ Not configured'}")
    print(f"   Redis URL: {'✅ Configured' if settings.redis_url else '❌ Not configured'}")

    print()
    print("=" * 70)
    print("DIAGNOSTIC COMPLETE")
    print("=" * 70)

    return True


if __name__ == "__main__":
    success = test_config_loading()
    sys.exit(0 if success else 1)
