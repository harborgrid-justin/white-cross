#!/bin/bash

# Install Storybook dependencies for White Cross Next.js application
echo "Installing Storybook dependencies..."

npm install --save-dev \
  @storybook/nextjs@^9.1.15 \
  @storybook/react@^9.1.15 \
  @storybook/addon-essentials@^9.1.15 \
  @storybook/addon-interactions@^9.1.15 \
  @storybook/addon-links@^9.1.15 \
  @storybook/addon-a11y@^9.1.15 \
  @storybook/addon-viewport@^9.1.15 \
  @storybook/addon-backgrounds@^9.1.15 \
  @storybook/addon-styling-webpack@^1.0.0 \
  @storybook/test@^9.1.15 \
  @storybook/theming@^9.1.15 \
  @storybook/blocks@^9.1.15 \
  @chromatic-com/storybook@^3.2.2 \
  storybook-dark-mode@^4.0.2 \
  storybook@^9.1.15 \
  style-loader@^4.0.0 \
  css-loader@^7.1.2 \
  postcss-loader@^8.1.1

echo ""
echo "✅ Storybook dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run storybook' to start development server"
echo "2. Access Storybook at http://localhost:6006"
echo "3. Run 'npm run build-storybook' to build for production"
