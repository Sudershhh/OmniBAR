from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
from dotenv import load_dotenv

from database import get_db
from models import EvaluationRequest, EvaluationResponse, EvaluationRun, DashboardStats
from services import run_evaluation, get_all_runs, get_run_by_id, get_dashboard_stats

load_dotenv()

app = FastAPI(title="OmniBAR API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate(request: EvaluationRequest, db: Session = Depends(get_db)):
    """Run a new evaluation"""
    return await run_evaluation(request, db)

@app.get("/runs", response_model=List[EvaluationRun])
async def get_runs(db: Session = Depends(get_db)):
    """Get all evaluation runs"""
    runs = get_all_runs(db)
    return runs

@app.get("/runs/{run_id}", response_model=EvaluationRun)
async def get_run(run_id: str, db: Session = Depends(get_db)):
    """Get specific evaluation run"""
    run = get_run_by_id(db, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@app.get("/dashboard/stats", response_model=DashboardStats)
async def get_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    return get_dashboard_stats(db)

@app.get("/")
async def root():
    """Health check"""
    return {"message": "OmniBAR API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)