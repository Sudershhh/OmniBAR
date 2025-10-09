# Backend - OmniBAR AI Agent Testing API

A FastAPI backend that provides APIs for testing AI agents using the OmniBAR framework.

## What it does

- Accepts evaluation requests from frontend
- Runs AI agent evaluations using OmniBAR
- Stores results in SQLite database
- Provides APIs for retrieving evaluation data and statistics

## Tech Stack

- FastAPI for REST API
- SQLAlchemy for database ORM
- Pydantic for data validation
- OmniBAR for AI agent evaluation
- OpenAI API for AI models

## Project Structure

```
backend/
├── main.py          # FastAPI app and routes
├── database.py      # Database models and connection
├── models.py        # Pydantic request/response models
├── services.py      # Business logic and OmniBAR integration
├── requirements.txt # Python dependencies
└── evaluations.db   # SQLite database (auto-created)
```

## Setup

1. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Create environment file:

   ```bash
   # Create .env file with your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Start the server:

   ```bash
   python main.py
   ```

4. API will be available at http://localhost:8000

## API Endpoints

- `POST /evaluate` - Submit new evaluation
- `GET /runs` - Get all evaluation runs
- `GET /runs/{id}` - Get specific run details
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /` - Health check

## Supported Models

- GPT-4, GPT-4 Turbo, GPT-4o, GPT-4o Mini
- GPT-3.5 Turbo, GPT-3.5 Turbo 16K

## Evaluation Objectives

- String Equality - Exact text matching
- LLM Judge - AI-powered quality assessment
- Combined - Multi-objective evaluation

## Data Flow

1. Frontend sends evaluation request
2. Backend creates AI agent for specified model
3. OmniBAR runs evaluation with chosen objective
4. Results extracted and stored in database
5. Response sent back to frontend

## Environment Variables

Required:

- `OPENAI_API_KEY` - Your OpenAI API key

Optional:

- `DATABASE_URL` - Database connection string (defaults to SQLite)

## Development

The backend uses:

- FastAPI for automatic API documentation
- SQLAlchemy for database operations
- OmniBAR for AI agent evaluation
- Pydantic for request/response validation

API documentation available at:

- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Assumptions

- OpenAI API Access: Assumes valid OpenAI API key with sufficient credits
- Synchronous Evaluation: Evaluations run synchronously (no background job processing)
- No Data Persistence: Database file is not backed up or replicated

## Tradeoffs

- Chose SQLite over PostgreSQL : Super easy for demos but not for production scale
- Chose CORS Allow-All for Development : Security risk for production and allowing every domain to access the endpoints

## What I Kept and Why

### **Core OmniBAR Integration**

- All three evaluation objectives (String Equality, LLM Judge, Combined)
- Proper result extraction and storage
- Clean separation between frontend and backend
