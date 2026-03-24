import sys
from groq_example import query_groq
from ollama_example import query_ollama
from huggingface_example import query_huggingface
from gemini_example import query_gemini
from cohere_example import query_cohere

def main():
    print("=== AI API Integration ===")
    print("1. Groq")
    print("2. Ollama (Local)")
    print("3. Hugging Face")
    print("4. Google Gemini")
    print("5. Cohere")
    print("0. Exit")
    
    choice = input("\nSelect a provider (0-5): ").strip()
    
    if choice == '0':
        print("Exiting...")
        sys.exit(0)
        
    providers = {
        '1': ("Groq", query_groq),
        '2': ("Ollama", query_ollama),
        '3': ("Hugging Face", query_huggingface),
        '4': ("Google Gemini", query_gemini),
        '5': ("Cohere", query_cohere)
    }
    
    if choice not in providers:
        print("Invalid selection. Please try again.")
        return

    provider_name, query_func = providers[choice]
    print(f"\n--- Selected {provider_name} ---")
    prompt = input("Enter your prompt: ").strip()
    
    if not prompt:
        print("Prompt cannot be empty.")
        return
        
    print(f"\nThinking using {provider_name}...")
    result = query_func(prompt)
    
    print("\n--- Response ---")
    print(result)

if __name__ == "__main__":
    try:
        while True:
            main()
            print("\n" + "="*40 + "\n")
    except KeyboardInterrupt:
        print("\nExiting program.")
        sys.exit(0)