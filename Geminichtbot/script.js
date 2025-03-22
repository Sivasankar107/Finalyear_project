document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");

    function appendMessage(text, className) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${className}`;
        messageDiv.innerText = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const query = userInput.value.trim();
        if (!query) return;

        appendMessage(query, "user");
        userInput.value = "";

        const typingIndicator = document.createElement("div");
        typingIndicator.className = "message bot typing";
        typingIndicator.innerText = "Typing...";
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;

        console.log("Sending request to Flask API...");  // ✅ Debug log

        try {
            const response = await fetch("http://127.0.0.1:5000/chat", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            console.log("Response received:", response);  // ✅ Debug log

            const data = await response.json();
            console.log("API Response Data:", data);  // ✅ Debug log

            chatBox.removeChild(typingIndicator);
            appendMessage(data.response || "No response received", "bot");
        } catch (error) {
            chatBox.removeChild(typingIndicator);
            appendMessage("Error: Unable to fetch response.", "bot");
            console.error("Fetch Error:", error);  // ✅ Debug log
        }
    }

    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});