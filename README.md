 # AI API Integration Assignment

Hey there!  I'm Sudeeksha T, and this is my submission for the AI API Integration assignment.

For this project, I explored how different Generative AI services can be integrated using Python. Instead of working with just one API, I implemented multiple providers to understand how each of them works and how their responses differ. This helped me get a clearer picture of how real-world applications interact with AI systems.

---

## What I Built

I created separate Python scripts for the following AI providers:

1. **Groq** – for fast LLM inference  
2. **Ollama** – to run LLaMA 3 locally on my system  
3. **Hugging Face** – using open-source models  
4. **Google Gemini** – for text generation  
5. **Cohere** – for NLP-based responses  

Each script takes user input, sends it to the respective API, and prints the generated response.

---

## Project Structure

```
AI-API-Integration/
├── .env
├── .gitignore
├── openai_example.py
├── groq_example.py
├── ollama_example.py
├── huggingface_example.py
├── gemini_example.py
├── cohere_example.py
├── requirements.txt
├── README.md
└── screenshots/
```

---

## How to Set It Up

### 1. Prerequisites

- Python 3.8 or above  
- API keys for:
  - OpenAI  
  - Groq  
  - Hugging Face  
  - Google Gemini  
  - Cohere  
- Ollama installed (for local model)

---

### 2. Installation

```
python -m venv venv
```

Activate environment:

- Windows:
```
venv\Scripts\activate
```

- Mac/Linux:
```
source venv/bin/activate
```

Install dependencies:

```
pip install -r requirements.txt
```

---

### 3. API Keys Setup

Create a `.env` file:

```
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
HF_API_KEY=your_huggingface_key
GOOGLE_API_KEY=your_gemini_key
COHERE_API_KEY=your_cohere_key
```

---

## Running the Code

Run any file:

```
python openai_example.py
```

---

## Output

Screenshots are available in the `screenshots/` folder.

---

## What I Learned

- Working with multiple AI APIs  
- Differences between providers  
- Secure API key handling  
- Real-world API integration  

---

## Challenges Faced

- Understanding different API structures  
- Fixing model errors  
- Setting up Ollama  
- Managing API keys securely  

---

## Conclusion

This project helped me understand how AI APIs are used in real-world applications and improved my practical coding skills.

---
