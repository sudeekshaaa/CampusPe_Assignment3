import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv


def get_api_key():
    """Load and return the Hugging Face API key."""
    load_dotenv()
    return os.getenv("HUGGINGFACE_API_KEY")


def query_huggingface(prompt, api_key=None):
    """Send a prompt to Hugging Face and return the response."""
    if api_key is None:
        api_key = get_api_key()

    if not api_key:
        return "Error: HUGGINGFACE_API_KEY environment variable not set."

    try:
        client = InferenceClient(api_key=api_key)

        messages = [{"role": "user", "content": prompt}]

        response = client.chat_completion(
            model="Qwen/Qwen2.5-7B-Instruct",
            messages=messages,
            max_tokens=250
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"An error occurred: {e}"


def main():
    """Main function to execute the program."""
    api_key = get_api_key()

    if not api_key:
        print("Error: HUGGINGFACE_API_KEY environment variable not set.")
        return

    user_prompt = input("Enter your prompt for Hugging Face: ")
    print("\nThinking...")

    result = query_huggingface(user_prompt, api_key)

    print("\n--- Response ---")
    print(result)


if __name__ == "__main__":
    main()