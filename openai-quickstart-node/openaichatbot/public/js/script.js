//Get reference to our submit button and chatbot field
const submit = document.getElementById("submit");
const responseField = document.getElementById("response");
const userInput = document.getElementById("user-input");
const chatHistory = document.getElementById("chat-history");
const loading = document.getElementById("spinner");

document.cookie =
  "patient=noName; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/";
let decodedCookie = decodeURIComponent(document.cookie);
let ca = decodedCookie.split(";");
console.log(ca);

let promptResponses = [];

//Our call to the API
const generateResponse = async () => {
  //Get the user input field value
  //Set loading spinner
  loading.classList.remove("visually-hidden");
  submit.classList.add("visually-hidden");
  const input = userInput.value;
  const response = await fetch("/chat", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      message1: input,
      messages: [{ role: "user", content: input }],
      temp: 0.6,
      patient: ca[1].substring(9),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  const message = responseData.result[0].message.content;
  console.log(message);

  //Store our previous messages
  promptResponses.push({ question: input, response: message });
  //Clear both fields
  userInput.value = "";

  const historyElement = document.createElement("div");
  historyElement.innerHTML = `<li class="list-group-item">Prompt: ${input}</li>
    <li class="list-group-item"> Response: ${message}</li>`;
  chatHistory.append(historyElement);

  //Stop loading spinner
  loading.classList.add("visually-hidden");
  submit.classList.remove("visually-hidden");
};

//Assign onclick method
submit.onclick = generateResponse;
