#!/bin/bash

# Security Dependencies Installation Script
# Installs required packages for OAuth2, MFA, password reset, and email verification

echo "================================================"
echo "Installing Security Dependencies for Backend"
echo "================================================"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"

echo "Installing production dependencies..."
npm install \
  speakeasy \
  qrcode \
  passport-google-oauth20 \
  passport-microsoft

echo ""
echo "Installing development dependencies..."
npm install --save-dev \
  @types/speakeasy \
  @types/qrcode \
  @types/passport-google-oauth20 \
  @types/passport-microsoft

echo ""
echo "================================================"
echo "Installation Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Configure OAuth credentials in .env file"
echo "2. Run database migration: npm run migration:run"
echo "3. Restart the backend server"
echo ""
echo "See SECURITY_IMPLEMENTATION_GUIDE.md for details"
echo ""
