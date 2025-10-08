from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class EvaluationRequest(BaseModel):
    prompt: str
    expected_output: Optional[str] = Field(None, alias="expectedOutput")
    objective: str  
    model: str
    iterations: int = 1
    
    class Config:
        populate_by_name = True

class EvaluationResponse(BaseModel):
    run_id: str
    status: str
    score: float
    agent_response: Optional[str] = None
    objectives: Optional[Dict[str, Any]] = None
    timestamp: str
    error_message: Optional[str] = None

class EvaluationRun(BaseModel):
    id: str
    prompt: str
    expected_output: Optional[str]
    agent_response: Optional[str]
    objective: str
    model: str
    score: float
    status: str
    timestamp: datetime
    objectives: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None

class DashboardStats(BaseModel):
    totalRuns: int
    averageScore: float
    successRate: float