import * as webllm from './web-llm.js';
const apiUrl = "https://pracc-0dcdba945892.herokuapp.com"; // Backend base URL

const queryInput = document.getElementById('prompt');
const progressbar = document.getElementById('progressBar');
const errorMessage = document.getElementById('errorMessage');


const selectedModel = "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC";

const engine = new webllm.MLCEngine();

function UpdateEngineInitProgress(report){
  progressbar.style.width = (report.progress * 100) + "%";
  queryInput.value = report.text;
}
engine.setInitProgressCallback(UpdateEngineInitProgress);

async function initalizeWebllmEngine() {
  const config={
    temperature: 1.0,
    top_p: 1
  }

  await engine.reload(selectedModel, config);

}

document.addEventListener("DOMContentLoaded", async function(){
  queryInput.disabled = true; 
 initalizeWebllmEngine();
 queryInput.disabled = false; 
 queryInput.value = "";
});

const messages = [{
  "role":"system",
  "content":"You are my AI assistant. You must ONLY reply with the user's language and only contexts about me. You are not allowed to change any information lie about things. if you don't have the anwser to the question just tell 'I don't know'."
}];

async function sendMessage() {
  const prompt = queryInput.value; 

  addMessagesToFront(prompt, "user");

  messages.push({
    "role":"user",
    "content": prompt
  });

  try{
    await askToLLM(messages);
  }
  catch (err){
    console.log("error");
  }
  
};

function addMessagesToFront(message, type){
  const messageArea = document.getElementById("messages");

  if(type == "user"){
    messageArea.innerHTML =  `<li class="list-item user-Message">  ${message} </li>`
  }
  else{
    messageArea.innerHTML = `<li class="list-item bot-Message"> ${message} </li>`
  }

};

async function askToLLM(message, anwser){
  try{
    let currentMessage = ""; 

    queryInput.value = ""; 
    queryInput.disabled = true; 

    const completion = await engine.chat.completions.create({
      stream: true, 
      message
    });

    for await (const chunk of completion){
      let currentData = chunk.choices[0].delta.content;
      if(currentData){
        currentMessage = currentData;
      }
      anwser.innerHTML = currentMessage;
    }

    const finalMSG = await engine.getMessage();
    anwser.innerHTML = finalMSG;

    queryInput.disabled = false;
    
  }
  catch(err){
    console.log("error");
  }
}


fetch(apiUrl)
  .then(response => response.text()) // Use text() as backend sends plain text
  .then(data => {
    if(data === ""){
      return; // No need to log empty response
    }
    else{
      console.log("Root Endpoint Data:", data);
      document.getElementById("text").textContent = data;
    }
  })
  .catch(error => console.error("Error fetching root endpoint:", error));




