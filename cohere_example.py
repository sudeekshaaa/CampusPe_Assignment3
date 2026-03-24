import os
import cohere
from dotenv import load_dotenv


def get_api_key():
    """Load and return the Cohere API key."""
    load_dotenv()
    return os.getenv("COHERE_API_KEY")


def query_cohere(prompt, api_key=None):
    """Send prompt to Cohere and return response."""
    if api_key is None:
        api_key = get_api_key()

    if not api_key:
        return "Error: COHERE_API_KEY environment variable not set."

    try:
        co = cohere.Client(api_key, timeout=120)

        response = co.chat(
            model="command-r-08-2024",
            message=prompt
        )

        return response.text.strip()

    except Exception as e:
        return f"An error occurred: {e}"


def main():
    """Main function to run the program."""
    api_key = get_api_key()

    if not api_key:
        print("Error: COHERE_API_KEY environment variable not set.")
        return

    user_prompt = input("Enter your prompt for Cohere: ")
    print("\nThinking...")

    result = query_cohere(user_prompt, api_key)

    print("\n--- Response ---")
    print(result)


if __name__ == "__main__":
    main()