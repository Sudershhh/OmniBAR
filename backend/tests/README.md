# Backend Tests

Simple tests for the backend API endpoints and services.

## What's tested

- Health check endpoint
- Empty database scenarios
- Dashboard stats calculation
- Run retrieval (existing and non-existing)
- Evaluation endpoint with mocked OmniBAR
- Error handling for invalid models
- Error handling for missing API keys
- Service functions directly

## Running tests

1. Install backend dependencies (includes test dependencies):

   ```bash
   pip install -r requirements.txt
   ```

2. Run tests:

   ```bash
   python tests/run_tests.py
   ```

   Or directly with pytest:

   ```bash
   pytest tests/test_api.py -v
   ```

## Test database

Tests use a separate SQLite database (`test.db`) that is created and destroyed for each test run.
