let inputs = document.querySelectorAll(".inputBox");
let scrapeBtn = document.querySelector(".scrape");
let addOneMoreVideoBtn = document.querySelector(".addOneMoreVideo");
let inputGroupBox = document.querySelector(".input-groups");
let plusBtnDiv = document.querySelector(".btn");
let count = document.getElementById("commentCount");
let outputBox = document.querySelector(".outputBox");
let removeBtn = document.querySelector(".remove");
const aiBtn = document.querySelector(".send-btn");
const aiInput = document.querySelector(".chat-input input");
const aiChatContainer = document.querySelector(".ai-chat-container");

let chatHistory = [];

let inputArray = [];

aiBtn.addEventListener("click", async () => {
  const userMessage = aiInput.value.trim();
  if (!userMessage) return;

  // Append user message
  const userDiv = document.createElement("div");
  userDiv.className = "chat-message user";
  userDiv.textContent = userMessage;
  aiChatContainer.appendChild(userDiv);

  aiInput.value = "";
  aiChatContainer.scrollTop = aiChatContainer.scrollHeight;

  try {
    const res = await fetch("http://localhost:3000/ask-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, history: chatHistory }),
    });

    const data = await res.json();

    // Append AI response
    const aiDiv = document.createElement("div");
    aiDiv.className = "chat-message ai";
    aiDiv.textContent = data.text;
    aiChatContainer.appendChild(aiDiv);

    aiChatContainer.scrollTop = aiChatContainer.scrollHeight;

    // Update chat history
    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
    chatHistory.push({ role: "model", parts: [{ text: data.text }] });
  } catch (err) {
    console.error(err);
  }
});

addOneMoreVideoBtn.addEventListener("click", () => {
  const currentInputs = inputGroupBox.querySelectorAll("li");

  if (currentInputs.length >= 9) {
    // max 10 inputs
    plusBtnDiv.classList.add("plusBtn"); // hide button
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = `<input type="text" class="inputBox" placeholder="Paste YouTube video URL" /> 
                  <button class="remove">X</button>`;
  inputGroupBox.appendChild(li);
  inputArray.push(li);
});

function extractVideoId(input) {
  const trimmed = input.trim();

  // direct video ID (length 11)
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  // youtu.be short links
  if (trimmed.includes("youtu.be/")) {
    const parts = trimmed.split("/");
    return parts[parts.length - 1].split("?")[0];
  }

  // full youtube URL
  if (trimmed.includes("youtube.com/watch")) {
    try {
      const url = new URL(
        trimmed.startsWith("http") ? trimmed : "https://" + trimmed
      );
      return url.searchParams.get("v");
    } catch (e) {
      return null;
    }
  }

  return null; // invalid
}

scrapeBtn.addEventListener("click", async () => {
  const inputF = document.querySelectorAll(".inputBox"); // fresh NodeList
  const videoIds = [];

  inputF.forEach((input) => {
    if (input.value.trim() === "") {
      input.classList.add("red");
    } else {
      input.classList.remove("red");

      const id = extractVideoId(input.value);
      if (id) videoIds.push(id);
      else input.classList.add("red"); // mark invalid URL/ID
    }
  });

  const commentCount = Number(count.value);

  if (!videoIds.length) return;

  // call backend
  const response = await fetch("http://localhost:3000/scrape-comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoIds, commentCount }),
  });

  const data = await response.json();
  console.log(data); // show fetched comments

  // Save comments to IndexedDB
  data.results.forEach((video, index) => {
    saveMessage({
      type: "video_comments",
      videoId: video.videoId,
      comments: video.comments,
      date: new Date(),
    });
  });

  // Load back (if you want to test)
  getMessages((all) => {
    console.log("Loaded from IndexedDB:", all);
  });

  // optionally display in outputBox

  outputBox.innerHTML = ""; // clear previous output
  if (data.success && data.results.length) {
    data.results.forEach((video, index) => {
      // use index for numbering
      const videoDiv = document.createElement("div");
      videoDiv.classList.add("video-comments");

      const title = document.createElement("h3");
      title.textContent = `Video ${index + 1}`; // Video 1, Video 2, ...
      videoDiv.appendChild(title);
      // JSON.stringify(title.localStorage(`Video ${index + 1}`))

      const idLabel = document.createElement("p");
      idLabel.textContent = `ID: ${video.videoId}`;
      idLabel.classList.add("video-id");
      videoDiv.appendChild(idLabel);

      const ul = document.createElement("ul");
      video.comments.forEach((comment) => {
        const li = document.createElement("li");
        li.innerHTML = comment; // preserve links/formatting
        ul.appendChild(li);
      });

      videoDiv.appendChild(ul);
      outputBox.appendChild(videoDiv);
    });
  } else {
    outputBox.textContent = "No comments found or invalid video ID(s).";
  }
});

inputGroupBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    let li = e.target.parentElement; // the <li> containing input + button
    li.remove(); // remove from DOM

    // optional if you want to keep track with array
    inputArray = inputArray.filter((item) => item !== li);

    // show + button if under max
    if (inputGroupBox.querySelectorAll("li").length < 10) {
      plusBtnDiv.classList.remove("plusBtn");
    }
  }
});

// const count = document.getElementById("commentCount").value;
// console.log(count); // "10"
