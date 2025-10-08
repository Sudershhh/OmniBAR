import os
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from omnibar import OmniBarmarker, Benchmark
from omnibar.objectives import StringEqualityObjective, LLMJudgeObjective, CombinedBenchmarkObjective
from omnibar.core.types import BoolEvalResult, FloatEvalResult, EvalResult
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from database import EvaluationRun as DBEvaluationRun
from models import EvaluationRequest, EvaluationResponse, DashboardStats
from dotenv import load_dotenv
load_dotenv()  

class SimpleAgent:
    def __init__(self, model: str):
        self.llm = ChatOpenAI(
            model=model,
            temperature=0,
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
    
    def invoke(self, query: str) -> Dict[str, Any]:
        response = self.llm.invoke(query)
        return {"response": response.content}

def create_agent_for_model(model: str):
    """Create agent based on model selection"""
    return SimpleAgent(model)

def create_objective_from_request(objective: str, expected_output: Optional[str] = None):
    """Create OmniBAR objective from request"""
    if objective == "string-equality":
        goal = expected_output or ""
        
        return StringEqualityObjective(
            name="string_equality",
            output_key="response",
            goal=goal,
            valid_eval_result_type=BoolEvalResult
        )
    elif objective == "llm-judge":
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required for LLM Judge objective")
        
        def create_llm_judge_invoke():
            from langchain_openai import ChatOpenAI
            from langchain.prompts import PromptTemplate
            from langchain_core.output_parsers import JsonOutputParser
            from omnibar.core.types import FloatEvalResult
            
            class LLMPartialOutputSchema(BaseModel):
                result: float = Field(description="A score between 0 and 1 indicating how close the output is to the expected output")
                message: str = Field(description="A message explaining why the output is correct or not")
            
            llm = ChatOpenAI(model="gpt-4", temperature=0, openai_api_key=api_key)
            parser = JsonOutputParser(pydantic_object=LLMPartialOutputSchema)
            
            prompt = PromptTemplate(
                template="""Your job is to judge the output of an AI Agent and return a score between 0 and 1 indicating how close the output is to the expected output and a message explaining why.

The expected output is:
{expected_output}

The output of the AI Agent is:
{input}

The format of the output should be:
{format_instructions}""",
                input_variables=["input"],
                partial_variables={
                    "format_instructions": parser.get_format_instructions(),
                    "expected_output": expected_output or "Evaluate the quality of this response"
                }
            )
            
            chain = prompt | llm | parser
            return chain.invoke
        
        return LLMJudgeObjective(
            name="llm_judge",
            output_key="response",
            goal=expected_output or "Evaluate the quality of this response",
            valid_eval_result_type=FloatEvalResult,
            invoke_method=create_llm_judge_invoke()
        )
    elif objective == "combined":
        string_obj = StringEqualityObjective(
            name="string_equality",
            output_key="response",
            goal=expected_output or "",
            valid_eval_result_type=BoolEvalResult
        )
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required for combined objective")
        
        def create_llm_judge_invoke():
            from langchain_openai import ChatOpenAI
            from langchain.prompts import PromptTemplate
            from langchain_core.output_parsers import JsonOutputParser
            
            class LLMPartialOutputSchema(BaseModel):
                result: float = Field(description="A score between 0 and 1 indicating how close the output is to the expected output")
                message: str = Field(description="A message explaining why the output is correct or not")
            
            llm = ChatOpenAI(model="gpt-4", temperature=0, openai_api_key=api_key)
            parser = JsonOutputParser(pydantic_object=LLMPartialOutputSchema)
            
            prompt = PromptTemplate(
                template="""Your job is to judge the output of an AI Agent and return a score between 0 and 1 indicating how close the output is to the expected output and a message explaining why.

The expected output is:
{expected_output}

The output of the AI Agent is:
{input}

The format of the output should be:
{format_instructions}""",
                input_variables=["input"],
                partial_variables={
                    "format_instructions": parser.get_format_instructions(),
                    "expected_output": expected_output or "Evaluate the quality of this response"
                }
            )
            
            chain = prompt | llm | parser
            return chain.invoke
        
        llm_obj = LLMJudgeObjective(
            name="llm_judge",
            output_key="response",
            goal=expected_output or "Evaluate the quality of this response",
            valid_eval_result_type=FloatEvalResult,
            invoke_method=create_llm_judge_invoke()
        )
        
        return CombinedBenchmarkObjective(
            name="combined_evaluation",
            objectives=[string_obj, llm_obj]
        )
    else:
        raise ValueError(f"Unsupported objective: {objective}")

def extract_evaluation_results(benchmarker: OmniBarmarker, run_id: str, request: EvaluationRequest) -> Dict[str, Any]:
    """Extract results from OmniBAR benchmarker"""
    logs = benchmarker.logger.get_all_logs()
    if not logs:
        return {
            "run_id": run_id,
            "status": "failed",
            "score": 0.0,
            "timestamp": datetime.now().isoformat(),
            "error_message": "No evaluation results found"
        }
    
    if request.objective == "combined":
        return extract_combined_results(logs, run_id, request)
    
    latest_log = logs[-1]
    
    if not latest_log.entries:
        return {
            "run_id": run_id,
            "status": "failed",
            "score": 0.0,
            "timestamp": datetime.now().isoformat(),
            "error_message": "No evaluation entries found"
        }
    
    latest_entry = latest_log.entries[-1]
    
    agent_response = latest_entry.evaluated_output.get("response", "")
    
    print(f"DEBUG: Agent response: '{agent_response}'")
    print(f"DEBUG: Expected output: '{request.expected_output}'")
    print(f"DEBUG: Evaluation result: {latest_entry.eval_result}")
    
    result_value = latest_entry.eval_result[0] 
    message_value = latest_entry.eval_result[1] if len(latest_entry.eval_result) > 1 else None
    
    print(f"DEBUG: result_value: {result_value} (type: {type(result_value)})")
    print(f"DEBUG: message_value: {message_value}")
    
    if isinstance(result_value, bool):
        score = 100.0 if result_value else 0.0
    elif isinstance(result_value, (int, float)):
        score = float(result_value) * 100
    else:
        score = 0.0
    
    status = "completed" if score > 0 else "failed"
    
    objectives = None
    if request.objective == "string-equality":
        objectives = {
            "stringEquality": {
                "passed": bool(result_value),
                "score": int(score)
            }
        }
    elif request.objective == "llm-judge":
        objectives = {
            "llmJudge": {
                "passed": score > 0,
                "score": int(score),
                "reasoning": message_value or ""
            }
        }
    
    return {
        "run_id": run_id,
        "status": status,
        "score": score,
        "agent_response": agent_response,
        "objectives": objectives,
        "timestamp": datetime.now().isoformat()
    }

def extract_combined_results(logs, run_id: str, request: EvaluationRequest) -> Dict[str, Any]:
    """Extract results for combined objectives"""
    print(f"DEBUG: Processing combined results from {len(logs)} logs")
    
    string_log = None
    llm_log = None
    
    for log in logs:
        if log.entries:
            entry = log.entries[-1]
            objective_name = log.metadata.get('objective_name', '')
            print(f"DEBUG: Found log with objective: {objective_name}")
            
            if 'string_equality' in objective_name:
                string_log = log
            elif 'llm_judge' in objective_name:
                llm_log = log
    
    agent_response = ""
    if logs and logs[0].entries:
        agent_response = logs[0].entries[-1].evaluated_output.get("response", "")
    
    string_passed = False
    string_score = 0
    if string_log and string_log.entries:
        entry = string_log.entries[-1]
        result_value = entry.eval_result[0]
        string_passed = bool(result_value)
        string_score = 100 if string_passed else 0
        print(f"DEBUG: String equality - passed: {string_passed}, score: {string_score}")
    
    llm_passed = False
    llm_score = 0
    llm_reasoning = ""
    if llm_log and llm_log.entries:
        entry = llm_log.entries[-1]
        result_value = entry.eval_result[0]
        message_value = entry.eval_result[1] if len(entry.eval_result) > 1 else None
        
        if isinstance(result_value, (int, float)):
            llm_score = int(float(result_value) * 100)
            llm_passed = llm_score > 0
        llm_reasoning = message_value or ""
        print(f"DEBUG: LLM judge - passed: {llm_passed}, score: {llm_score}, reasoning: {llm_reasoning}")
    
    overall_score = (string_score + llm_score) / 2
    status = "completed" if overall_score > 0 else "failed"
    
    objectives = {
        "stringEquality": {
            "passed": string_passed,
            "score": string_score
        },
        "llmJudge": {
            "passed": llm_passed,
            "score": llm_score,
            "reasoning": llm_reasoning
        }
    }
    
    return {
        "run_id": run_id,
        "status": status,
        "score": overall_score,
        "agent_response": agent_response,
        "objectives": objectives,
        "timestamp": datetime.now().isoformat()
    }


async def run_evaluation(request: EvaluationRequest, db: Session) -> EvaluationResponse:
    """Run evaluation using OmniBAR"""
    run_id = str(uuid.uuid4())
    
    try:
        agent = create_agent_for_model(request.model)
        
        objective = create_objective_from_request(request.objective, request.expected_output)
        
        benchmark = Benchmark(
            name=f"Evaluation_{run_id[:8]}",
            input_kwargs={"query": request.prompt},
            objective=objective,
            iterations=request.iterations
        )
        
        benchmarker = OmniBarmarker(
            executor_fn=lambda: agent,
            executor_kwargs={},
            initial_input=[benchmark]
        )
        
        await benchmarker.benchmark_async(max_concurrent=1)
        
        result_data = extract_evaluation_results(benchmarker, run_id, request)
        
        db_run = DBEvaluationRun(
            id=run_id,
            prompt=request.prompt,
            expected_output=request.expected_output,
            agent_response=result_data.get("agent_response"),
            objective=request.objective,
            model=request.model,
            score=result_data["score"],
            status=result_data["status"],
            objectives=result_data.get("objectives"),
            error_message=result_data.get("error_message")
        )
        db.add(db_run)
        db.commit()
        
        return EvaluationResponse(**result_data)
        
    except Exception as e:
        error_data = {
            "id": run_id,
            "prompt": request.prompt,
            "expected_output": request.expected_output,
            "agent_response": None,
            "objective": request.objective,
            "model": request.model,
            "score": 0.0,
            "status": "failed",
            "objectives": None,
            "error_message": str(e)
        }
        
        db_run = DBEvaluationRun(**error_data)
        db.add(db_run)
        db.commit()
        
        return EvaluationResponse(
            run_id=run_id,
            status="failed",
            score=0.0,
            timestamp=datetime.now().isoformat(),
            error_message=str(e)
        )

def get_all_runs(db: Session):
    """Get all evaluation runs"""
    runs = db.query(DBEvaluationRun).order_by(DBEvaluationRun.timestamp.desc()).all()
    return runs

def get_run_by_id(db: Session, run_id: str):
    """Get specific evaluation run"""
    return db.query(DBEvaluationRun).filter(DBEvaluationRun.id == run_id).first()

def get_dashboard_stats(db: Session) -> DashboardStats:
    """Get dashboard statistics"""
    runs = db.query(DBEvaluationRun).all()
    
    if not runs:
        return DashboardStats(totalRuns=0, averageScore=0.0, successRate=0.0)
    
    total_runs = len(runs)
    completed_runs = [r for r in runs if r.status == "completed"]
    average_score = sum(r.score for r in completed_runs) / len(completed_runs) if completed_runs else 0.0
    success_rate = (len(completed_runs) / total_runs) * 100 if total_runs > 0 else 0.0
    
    return DashboardStats(
        totalRuns=total_runs,
        averageScore=round(average_score, 2),
        successRate=round(success_rate, 2)
    )