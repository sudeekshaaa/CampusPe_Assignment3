 AI API Integration Assignment
 
Hey, this is Sudeeksha T

This project is part of my assignment where I explored how to integrate multiple **Generative AI APIs** using Python. The goal was to understand how different AI services work, how to interact with them using code, and how to handle their responses effectively.



 Overview

In this project, I have implemented separate Python scripts for different AI providers. Each script takes user input, sends it to the respective API, and displays the generated response.
This helped me understand how real-world applications communicate with AI systems.


 Objective

The main objectives of this assignment were to:

* Understand how AI APIs work
* Learn how to send requests and process responses
* Work with multiple AI providers
* Follow secure practices like storing API keys safely



 APIs Used

The following AI providers have been integrated:

* OpenAI
* Groq
* Ollama (local model)
* Hugging Face
* Google Gemini
* Cohere

Each provider is implemented in a separate Python file for clarity.



 Project Structure


AI-API-Integration/
│
├── openai_example.py
├── groq_example.py
├── ollama_example.py
├── huggingface_example.py
├── gemini_example.py
├── cohere_example.py
│
├── requirements.txt
├── README.md
└── screenshots/
```



 Installation

1. Clone the repository:

git clone https://github.com/YOUR-USERNAME/AI-API-Integration.git
cd AI-API-Integration


2. Install dependencies:

pip install -r requirements.txt


 Environment Variables

To keep API keys secure, I used environment variables instead of hardcoding them.

 Windows:

set OPENAI_API_KEY=your_key
set GROQ_API_KEY=your_key
set HF_API_KEY=your_key
set GOOGLE_API_KEY=your_key
set COHERE_API_KEY=your_key


 Mac/Linux:

export OPENAI_API_KEY=your_key
export GROQ_API_KEY=your_key
export HF_API_KEY=your_key
export GOOGLE_API_KEY=your_key
export COHERE_API_KEY=your_key


How to Run

Run any Python file:

python openai_example.py

Then enter a prompt, and the response will be displayed.


 Output

Screenshots of outputs from all APIs are included in the `screenshots/` folder.



 Features

* Takes user input
* Sends requests to different AI APIs
* Displays responses clearly
* Includes error handling
* Uses secure API key storage



 What I Learned

* How to integrate multiple AI APIs
* Differences between various AI providers
* Importance of secure coding practices
* Practical understanding of API-based applications



Conclusion

This assignment gave me hands-on experience with Generative AI APIs and helped me understand how they can be used in real-world applications.




