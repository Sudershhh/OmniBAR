from sqlalchemy import create_engine, Column, String, Float, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./evaluations.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class EvaluationRun(Base):
    __tablename__ = "evaluation_runs"
    
    id = Column(String, primary_key=True, index=True)
    prompt = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=True)
    agent_response = Column(Text, nullable=True)
    objective = Column(String, nullable=False)
    model = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    objectives = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()