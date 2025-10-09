#!/usr/bin/env python3
"""
Simple test runner for backend API tests
"""

import subprocess
import sys
import os

def run_tests():
    """Run the backend API tests"""
    print("Running backend API tests...")
    
    # Change to the backend directory (parent of tests)
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(backend_dir)
    
    # Run pytest on the tests
    try:
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "tests/test_api.py", 
            "-v",
            "--tb=short"
        ], capture_output=True, text=True)
        
        print("STDOUT:")
        print(result.stdout)
        
        if result.stderr:
            print("STDERR:")
            print(result.stderr)
        
        if result.returncode == 0:
            print("✅ All tests passed!")
        else:
            print("❌ Some tests failed!")
            
        return result.returncode
        
    except Exception as e:
        print(f"Error running tests: {e}")
        return 1

if __name__ == "__main__":
    exit_code = run_tests()
    sys.exit(exit_code)
