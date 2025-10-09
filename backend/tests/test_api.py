import pytest
import os
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import the main app and dependencies
from main import app
from database import get_db, Base
from models import EvaluationRequest
from services import get_dashboard_stats, get_all_runs, get_run_by_id

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

@pytest.fixture(scope="module")
def setup_database():
    """Create test database tables"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "OmniBAR API is running"}

def test_get_runs_empty():
    """Test getting runs when database is empty"""
    response = client.get("/runs")
    assert response.status_code == 200
    assert response.json() == []

def test_get_dashboard_stats_empty():
    """Test dashboard stats when no runs exist"""
    response = client.get("/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["totalRuns"] == 0
    assert data["averageScore"] == 0.0
    assert data["successRate"] == 0.0

def test_get_run_not_found():
    """Test getting a run that doesn't exist"""
    response = client.get("/runs/nonexistent-id")
    assert response.status_code == 404

@patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"})
def test_evaluate_endpoint_mock():
    """Test evaluation endpoint with mocked OmniBAR"""
    with patch('services.run_evaluation') as mock_run:
        mock_run.return_value = {
            "run_id": "test-id",
            "status": "completed",
            "score": 100.0,
            "agent_response": "4",
            "objectives": {"stringEquality": {"passed": True, "score": 100}},
            "timestamp": "2024-01-01T00:00:00",
            "error_message": None
        }
        
        request_data = {
            "prompt": "What is 2 + 2?",
            "expectedOutput": "4",
            "objective": "string-equality",
            "model": "gpt-4",
            "iterations": 1
        }
        
        response = client.post("/evaluate", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["run_id"] == "test-id"
        assert data["status"] == "completed"
        assert data["score"] == 100.0

def test_evaluate_invalid_model():
    """Test evaluation with invalid model"""
    request_data = {
        "prompt": "What is 2 + 2?",
        "expectedOutput": "4",
        "objective": "string-equality",
        "model": "invalid-model",
        "iterations": 1
    }
    
    response = client.post("/evaluate", json=request_data)
    assert response.status_code == 500

def test_evaluate_missing_openai_key():
    """Test evaluation without OpenAI API key"""
    with patch.dict(os.environ, {}, clear=True):
        request_data = {
            "prompt": "What is 2 + 2?",
            "expectedOutput": "4",
            "objective": "llm-judge",
            "model": "gpt-4",
            "iterations": 1
        }
        
        response = client.post("/evaluate", json=request_data)
        assert response.status_code == 500

def test_services_get_dashboard_stats():
    """Test dashboard stats service function"""
    from database import SessionLocal
    db = SessionLocal()
    
    try:
        stats = get_dashboard_stats(db)
        assert stats.totalRuns == 0
        assert stats.averageScore == 0.0
        assert stats.successRate == 0.0
    finally:
        db.close()

def test_services_get_all_runs():
    """Test get all runs service function"""
    from database import SessionLocal
    db = SessionLocal()
    
    try:
        runs = get_all_runs(db)
        assert isinstance(runs, list)
    finally:
        db.close()

def test_services_get_run_by_id():
    """Test get run by id service function"""
    from database import SessionLocal
    db = SessionLocal()
    
    try:
        run = get_run_by_id(db, "nonexistent-id")
        assert run is None
    finally:
        db.close()
