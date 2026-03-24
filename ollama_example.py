import requests

def query_ollama(prompt, model="llama3"):
    """Sends a prompt to a local Ollama instance and returns the response."""
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(url, json=payload)
        
        # If Ollama returns a 404, it usually means the model was never downloaded
        if response.status_code == 404:
            error_data = response.json()
            return f"Ollama Error: {error_data.get('error', 'Endpoint not found.')}\nTip: Open your terminal and run 'ollama run {model}' to download it first!"
            
        response.raise_for_status()
        data = response.json()
        return data.get("response", "").strip()
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to Ollama. Is the server running locally on port 11434?"
    except Exception as e:
        return f"An error occurred: {e}"

if __name__ == "__main__":
    user_prompt = input("Enter your prompt for Ollama: ")
    print("\nThinking...")
    result = query_ollama(user_prompt)
    print("\n--- Response ---")
    print(result)