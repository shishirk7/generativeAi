 document.addEventListener("DOMContentLoaded", () => {
      const chatHistory = document.getElementById("chat-history");
      const userInput = document.getElementById("user-input");
      const sendButton = document.getElementById("send-button");
      const toggleThemeBtn = document.getElementById("toggle-theme");
      const clearHistoryBtn = document.getElementById("clear-history");
      const exportChatBtn = document.getElementById("export-chat");
      const micButton = document.getElementById("mic-button");
      const savePdfBtn = document.getElementById("save-pdf");

      const API_KEY = "AIzaSyBSLEnUtdQiWJd68tVEH-B5a5n1YezvG9A";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

      // Load theme from localStorage
      if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
      }

      toggleThemeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
      });

      clearHistoryBtn.addEventListener("click", () => {
        localStorage.removeItem("chat-history");
        chatHistory.innerHTML = "";
      });

      exportChatBtn.addEventListener("click", () => {
        const history = JSON.parse(localStorage.getItem("chat-history") || "[]");
        const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "gemini_chat_history.json";
        a.click();
      });

      // Save as PDF button listener fixed here:
      savePdfBtn.addEventListener("click", () => {
        console.log("Save as PDF clicked");
        window.print();
      });

      function appendMessage(role, text) {
        const msg = document.createElement("div");
        msg.className = `chat-message ${role}`;
        const avatar = role === "user"
          ? '<img src="https://i.imgur.com/ZcLLrkY.png" class="avatar" alt="User">'
          : '<img src="https://i.imgur.com/oH0YzHY.png" class="avatar" alt="Bot">';
        msg.innerHTML = `
          ${avatar}<span>${text}</span>
          <div class="timestamp">${new Date().toLocaleTimeString()}</div>
        `;
        chatHistory.appendChild(msg);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        const history = JSON.parse(localStorage.getItem("chat-history") || "[]");
        history.push({ role, text });
        localStorage.setItem("chat-history", JSON.stringify(history));
      }

      async function sendMessage() {
        const input = userInput.value.trim();
        if (!input) return;

        appendMessage("user", input);
        userInput.value = "";

        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: input }]
                }
              ]
            })
          });

          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No valid response received.";
          appendMessage("bot", reply);
        } catch (error) {
          appendMessage("bot", "❌ Error: " + error.message);
        }
      }

      sendButton.addEventListener("click", sendMessage);
      userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
      });

      function loadHistory() {
        const history = JSON.parse(localStorage.getItem("chat-history") || "[]");
        history.forEach(({ role, text }) => appendMessage(role, text));
      }

      loadHistory();

      // Voice input
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const mic = new SpeechRecognition();
        mic.lang = "en-US";
        mic.continuous = false;

        micButton.addEventListener("click", () => {
          mic.start();
        });

        mic.onresult = (event) => {
          userInput.value = event.results[0][0].transcript;
          sendMessage();
        };

        mic.onerror = (e) => {
          console.error("Speech recognition error:", e);
        };
      } else {
        micButton.disabled = true;
        micButton.title = "Speech Recognition not supported in this browser.";
      }
    });