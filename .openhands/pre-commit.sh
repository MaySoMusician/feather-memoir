#!/bin/bash

echo "Running OpenHands pre-commit hook..."

# Store the exit code to return at the end
# This allows us to be additive to existing pre-commit hooks
EXIT_CODE=0

echo "Checking if the tests passes..."
npm run test -- --no-clear
if [ $? -ne 0 ]; then
    echo "Tests failed. Please fix the issues before committing."
    EXIT_CODE=1
fi

echo "Checking lint results..."
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed. Please fix the issues before committing."
    EXIT_CODE=1
fi

echo "Checking formatting results..."
npx prettier --check .
if [ $? -ne 0 ]; then
    echo "Linting failed. Please fix the issues before committing."
    EXIT_CODE=1
fi

echo "Checks passed!"

# Run any existing pre-commit hooks that might have been installed by the user
# This makes our hook additive rather than replacing existing hooks
if [ -f ".git/hooks/pre-commit.local" ]; then
    echo "Running existing pre-commit hooks..."
    bash .git/hooks/pre-commit.local
    if [ $? -ne 0 ]; then
        echo "Existing pre-commit hooks failed."
        EXIT_CODE=1
    fi
fi

if [ $EXIT_CODE -eq 0 ]; then
    echo "All pre-commit checks passed!"
else
    echo "Some pre-commit checks failed. Please fix the issues before committing."
fi

exit $EXIT_CODE
