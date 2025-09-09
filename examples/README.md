# OmniBAR Examples

Complete examples demonstrating OmniBAR usage, from basic concepts to real AI-powered evaluation.

## 🚀 Quick Start

### Option 1: Start Simple (No API Keys)

```bash
python output_evaluation.py          # Basic string/regex evaluation
python custom_agent_example.py       # Framework-agnostic patterns  
python bool_vs_float_results.py      # Result type comparison
```

### Option 2: Real AI Examples (API Keys Required)

```bash
# Set up environment first:
echo "OPENAI_API_KEY=your_key_here" > .env

# Then run real AI examples:
python document_extraction_evolution.py # Document extraction prompt evolution
```

## 📁 Complete Example List

| Example | Type | What It Does | APIs Needed |
|---------|------|--------------|-------------|
| **output_evaluation.py** | Basic | String matching & regex evaluation | ✅ None |
| **custom_agent_example.py** | Basic | Framework-agnostic agent testing | ✅ None |
| **bool_vs_float_results.py** | Basic | Boolean vs scored result types | ✅ None |
| **document_extraction_evolution.py** | AI | Document extraction prompt evolution | 🔑 OpenAI GPT-4 |
| **pydantic_ai_example.py** | Framework | Pydantic AI with dual evaluation | 🔑 Anthropic + OpenAI |
| **langchain_embedding_example.py** | Framework | LangChain embedding comparison | 🔑 OpenAI + 💾 4GB RAM |
| **inventory_management_example.py** | Framework | Complex LangChain crisis management | 🔑 OpenAI |

## ⚙️ Setup

### Basic Examples (No Setup)

```bash
# Just run them directly!
python output_evaluation.py
```

### AI Examples (API Keys Required)  

```bash
# Create .env file with your API keys:
echo "OPENAI_API_KEY=sk-your-key-here" > .env
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" >> .env

# Run any AI example:
python document_extraction_evolution.py
```

### Environment Variables

Examples automatically find `.env` files in these locations:

1. Current directory (`./.env`)
2. Parent directory (`../.env`)
3. Project root (`../../.env`)
4. Or set `OMNIBAR_ENV_PATH=/custom/path/.env`

## 🔍 Example Details

### 📚 **Basic Examples**

- **No API keys needed** - Run immediately
- **Pure Python** - No external dependencies
- **Core concepts** - String matching, regex, agent patterns
- **Fast execution** - Complete in seconds

### 🤖 **AI Examples**

- **Real API calls** - Actual OpenAI/Anthropic integration
- **Practical scenarios** - Document extraction, model comparison, prompt optimization
- **Production patterns** - Error handling, iterative improvement
- **Cost awareness** - Optimized for minimal API usage

### 🏗️ **Framework Examples**

- **LangChain integration** - Tools, agents, embeddings
- **Pydantic AI integration** - Modern async patterns
- **Complex scenarios** - Multi-step workflows, crisis management
- **Resource intensive** - May require 4GB+ RAM for embeddings

## ⚠️ Important Notices

### Results Variability

Due to the non-deterministic nature of LLMs and AI systems, your results may differ from example outputs or comparisons shown in documentation. Factors affecting variability include:

- **LLM Response Variation**: Same prompts can produce different outputs between runs
- **Embedding Search Results**: Knowledge retrieval can vary based on model updates
- **LLM Judge Evaluations**: Scoring can fluctuate due to evaluation model non-determinism
- **API Changes**: Provider updates may affect model behavior over time

**Recommendation**: Run multiple iterations and use statistical averaging for more reliable comparisons.

### System Requirements

**Most examples**: Lightweight, run quickly  
**langchain_embedding_example.py**: Downloads 2GB+ models, needs 4GB+ RAM  
**All AI examples**: Require valid API keys and internet connection

## 🔬 Parity Comparisons

OmniBAR excels at head-to-head comparisons using identical evaluation criteria. 

**📊 Available Parity Studies:**
- **Model Parity**: Claude 3.5 Sonnet vs GPT-4 (`pydantic_ai_example.py`)
- **Knowledge Source Parity**: ArXiv vs Wikipedia agents (`langchain_embedding_example.py`)  
- **Prompt Strategy Parity**: 4 prompt engineering evolution stages (`document_extraction_evolution.py`)

**📋 For detailed comparison results, analysis, and insights see [Comparisons.md](Comparisons.md)**