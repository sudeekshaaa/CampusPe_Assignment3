import os
from groq import Groq
from dotenv import load_dotenv


def get_api_key():
    """Load and return the Groq API key."""
    load_dotenv()
    return os.getenv("GROQ_API_KEY")


def query_groq(prompt, api_key=None):
    """Send a prompt to Groq and return the response."""
    if api_key is None:
        api_key = get_api_key()

    if not api_key:
        return "Error: GROQ_API_KEY environment variable not set."

    try:
        client = Groq(api_key=api_key)

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
        )

        return chat_completion.choices[0].message.content.strip()

    except Exception as e:
        return f"An error occurred: {e}"


def main():
    """Main function to execute the program."""
    api_key = get_api_key()

    if not api_key:
        print("Error: GROQ_API_KEY environment variable not set.")
        return

    user_prompt = input("Enter your prompt for Groq: ")
    print("\nThinking...")

    result = query_groq(user_prompt, api_key)

    print("\n--- Response ---")
    print(result)


if __name__ == "__main__":
    main()