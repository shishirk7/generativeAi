// gemini.js
const readline = require("readline");//  working program

const API_KEY = "AIzaSyBSLEnUtdQiWJd68tVEH-B5a5n1YezvG9A";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Use dynamic import of node-fetch
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout

});

function askUserInput() {
  rl.question("\n👤 You: ", async (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      console.log("👋 Chat ended.");
      rl.close();
      return;
    }

    await askGemini(userInput);
    askUserInput();
  });
}

async function askGemini(prompt) {
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await res.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("\n🤖 Gemini:", output || "No valid response received.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

console.log("💬 Chat with Gemini! Type 'exit' to quit.");
askUserInput();
