import os
from google import genai
from dotenv import load_dotenv


def get_api_key():
    """Load and return the Google Gemini API key."""
    load_dotenv()
    return os.getenv("GOOGLE_API_KEY")


def query_gemini(prompt, api_key=None):
    """Send a prompt to Google Gemini and return the response."""
    if api_key is None:
        api_key = get_api_key()

    if not api_key:
        return "Error: GOOGLE_API_KEY environment variable not set."

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )

        return response.text.strip()

    except Exception as e:
        return f"An error occurred: {e}"


def main():
    """Main function to execute the program."""
    api_key = get_api_key()

    if not api_key:
        print("Error: GOOGLE_API_KEY environment variable not set.")
        return

    user_prompt = input("Enter your prompt for Google Gemini: ")
    print("\nThinking...")

    result = query_gemini(user_prompt, api_key)

    print("\n--- Response ---")
    print(result)


if __name__ == "__main__":
    main()