# Code Quality and Standards

## General Coding Guidelines
- Follow consistent indentation (2 spaces for JavaScript/TypeScript, 4 spaces for Python)
- Use meaningful variable and function names that clearly describe their purpose
- Keep functions small and focused on a single responsibility
- Add comments for complex logic, but prefer self-documenting code
- Remove unused imports, variables, and dead code

## Language-Specific Rules

### JavaScript/TypeScript
- Use ES6+ syntax and modern JavaScript features
- Prefer `const` and `let` over `var`
- Use template literals for string interpolation
- Implement proper error handling with try-catch blocks
- Use TypeScript types when available for better type safety

### Python
- Follow PEP 8 style guidelines
- Use type hints for function parameters and return values
- Implement proper exception handling
- Use list comprehensions where appropriate
- Follow snake_case naming convention

### CSS/SCSS
- Use semantic class names that describe content, not appearance
- Organize styles logically (layout, typography, colors, etc.)
- Use CSS custom properties (variables) for consistent theming
- Minimize use of !important declarations
- Follow mobile-first responsive design principles

## Code Review Standards
- Ensure all code is properly formatted before committing
- Verify that new code follows existing project patterns
- Check for potential security vulnerabilities
- Validate that error handling is comprehensive
- Confirm that the code is testable and maintainable
