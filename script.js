import * as webllm from "./web-llm.js";
const apiUrl = "https://pracc-0dcdba945892.herokuapp.com"; // Backend base URL

const queryInput = document.getElementById("prompt");
const progressbar = document.getElementById("progressBar");
const errorMessage = document.getElementById("error-msg");

const selectedModel = "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC";

const engine = new webllm.MLCEngine();

function UpdateEngineInitProgress(report) {
  progressbar.style.width = report.progress * 100 + "%";
  errorMessage.innerHTML = report.text;
}
engine.setInitProgressCallback(UpdateEngineInitProgress);

async function initalizeWebllmEngine() {
  const config = {
    temperature: 1.0,
    top_p: 1,
  };

  await engine.reload(selectedModel, config);
}

document.addEventListener("DOMContentLoaded", async function () {
  queryInput.disabled = true;
  initalizeWebllmEngine();
  queryInput.disabled = false;
  queryInput.value = "";
});

document.getElementById("prompt").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Enter tuşunun varsayılan davranışını engeller (form gönderimi gibi)
    sendMessage();
  }
});

const messages = [
  {
    role: "system",
    content:
      "You are my AI assistant. You must ONLY reply with the user's language and only contexts about me. You are not allowed to change any information or lie about things. if you don't have the anwser to the question just tell 'I don't know'.",
  },
];

async function sendMessage() {
  const sendbutton = document.getElementById("sendButton"); 
  const prompt = queryInput.value.trim(); // Trim ile boşlukları kaldır

  if (!prompt) {
    alert("Message cannot be empty!"); // Boş mesaj kontrolü
    return;
  }

  // Kullanıcı mesajını ekrana ekle
  addMessagesToFront(prompt, "user");

  // Mesajı `messages` dizisine ekle
  messages.push({
    "role": "user",
    "content": prompt
  });

  console.log("Message array before sending:", messages); // Debug log

  try {
    // `askToLLM` fonksiyonunu çağır
    await askToLLM(messages);
    sendbutton.innerHTML = ""; 
    alert("Prompt successfully sent!");
  } catch (err) {
    alert("Error while sending message"); 
    console.error("Error in sendMessage:", err);
  }
}

function addMessagesToFront(message, type) {
  const messageArea = document.getElementById("messages");

  // Yeni mesaj öğesi oluştur
  const newMessage = document.createElement("li");
  newMessage.classList.add("list-item");
  newMessage.classList.add(type === "user" ? "user-Message" : "bot-Message");
  newMessage.textContent = message;

  // Mesajı listeye ekle
  messageArea.appendChild(newMessage);
}

async function askToLLM(message) {
  try {
    // Mesajın bir dizi olup olmadığını ve boş olmadığını kontrol et
    if (!Array.isArray(message) || message.length === 0) {
      console.error("Invalid or empty message array:", message);
      return;
    }

    let currentMessage = ""; 
    queryInput.value = ""; 
    queryInput.disabled = true; 

    // Engine üzerinden tamamlanma isteği gönder
    const completion = await engine.chat.completions.create({
      stream: true,
      message
    });

    // Gelen verileri işleme
    for await (const chunk of completion) {
      const currentData = chunk.choices[0]?.delta?.content; // Güvenli erişim
      if (currentData) {
        currentMessage += currentData;
      }
    }

    console.log("Final message:", currentMessage);

    queryInput.disabled = false;
  } catch (err) {
    console.error("Error in askToLLM:", err);
  }
}

fetch(apiUrl)
  .then((response) => response.text()) // Use text() as backend sends plain text
  .then((data) => {
    if (data === "") {
      return; // No need to log empty response
    } else {
      console.log("Root Endpoint Data:", data);
      document.getElementById("text").textContent = data;
    }
  })
  .catch((error) => console.error("Error fetching root endpoint:", error));
