if (!document.getElementById("face-clicker-image")) {
  const face = document.createElement("img");

  const faceSize = 50;
  const margin = 20;

  face.id = "face-clicker-image";

  Object.assign(face.style, {
    position: "fixed",
    width: faceSize + "px",
    height: faceSize + "px",
    objectFit: "cover",
    cursor: "pointer",
    borderRadius: "50%",
    zIndex: "9999",
    transition: "opacity 0.3s ease",
    top: "0px",
    left: "0px",
    opacity: "1",
    pointerEvents: "auto"
  });

  face.onerror = () => {
    console.error("Failed to load face image, switching to placeholder.");
    face.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Profile_avatar_placeholder_large.png/600px-Profile_avatar_placeholder_large.png";
  };

  function updateFaceImageFromStorage() {
    chrome.storage.local.get("agbAccepted", (data) => {
      const agbAccepted = data.agbAccepted === true;
      const imageName = agbAccepted ? "images/face.png" : "images/face1.png";
      face.src = chrome.runtime.getURL(imageName);
    });
  }

  function moveFaceRandomly() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const maxX = vw - faceSize - margin;
    const maxY = vh - faceSize - margin;

    const randomX = Math.floor(Math.random() * (maxX - margin + 1)) + margin;
    const randomY = Math.floor(Math.random() * (maxY - margin + 1)) + margin;

    face.style.left = randomX + "px";
    face.style.top = randomY + "px";
  }

  function showFace() {
    moveFaceRandomly();
    updateFaceImageFromStorage();
    face.style.opacity = "1";
    face.style.pointerEvents = "auto";
  }

  function hideFace() {
    face.style.opacity = "0";
    face.style.pointerEvents = "none";
  }

  document.body.appendChild(face);
  showFace();

  let score = 0;
  let scoreLoaded = false;

  chrome.storage.local.get("score", (data) => {
    if (chrome.runtime.lastError) {
      console.warn("Failed to load score:", chrome.runtime.lastError);
    } else {
      score = data.score || 0;
      scoreLoaded = true;
      console.log("Score loaded:", score);
    }
  });

  face.addEventListener("click", () => {
    if (!scoreLoaded) {
      console.warn("Score not loaded yet, ignoring clicks.");
      return;
    }

    score++;

    chrome.storage.local.set({ score }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to save score:", chrome.runtime.lastError);
        return;
      }

      console.log("Score saved:", score);
      hideFace();

      const delay = 5000 + Math.random() * 5000;
      setTimeout(() => {
        showFace();
      }, delay);
    });
  });


  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "AGB_ACCEPTED_CHANGED") {
      const imageName = msg.accepted ? "images/face.png" : "images/face1.png";
      face.src = chrome.runtime.getURL(imageName);
    }
  });
}
