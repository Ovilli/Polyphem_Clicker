const scoreElem = document.getElementById("score");
const clickTarget = document.getElementById("clickTarget");
const resetScore = document.getElementById("resetScore");
const acceptAGB = document.getElementById("accept_agb");
const volMaster = document.getElementById("volmaster");
const soundEffect = document.getElementById("soundEffect");
const soundPoint = document.getElementById("soundPoint");


chrome.storage.local.get(["score", "acceptAGB", "volmaster"], (data) => {
  scoreElem.textContent = data.score ?? 0;
  acceptAGB.checked = !!data.acceptAGB;
  volMaster.value = data.volmaster ?? 100;
  updateVolume(volMaster.value);
  updateFace();
});


clickTarget.addEventListener("click", () => {
  soundEffect.currentTime = 0;
  soundEffect.play();
});


resetScore.addEventListener("click", () => {
  chrome.storage.local.set({ score: 0 }, () => {
    scoreElem.textContent = 0;
  });
});


acceptAGB.addEventListener("change", () => {
  const accepted = acceptAGB.checked;
  chrome.storage.local.set({ acceptAGB: accepted, agbAccepted: accepted }, () => {
    updateFace();
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, { type: "AGB_ACCEPTED_CHANGED", accepted }, () => {
          if (chrome.runtime.lastError) {
            
          }
        });
      }
    });
  });
});


volMaster.addEventListener("input", () => {
  const volume = parseInt(volMaster.value, 10);
  chrome.storage.local.set({ volmaster: volume });
  updateVolume(volume);
});


function updateFace() {
  clickTarget.src = acceptAGB.checked ? "images/face.png" : "images/face1.png";
}


function updateVolume(vol) {
  const scaled = vol / 100;
  soundEffect.volume = scaled;
  soundPoint.volume = scaled;
}


document.querySelectorAll(".info-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", !expanded);
    content.hidden = expanded;
  });
});

// Open AGB overlay
document.getElementById("openAGB").addEventListener("click", () => {
  document.getElementById("AGB").style.width = "100%";
});

// Close AGB overlay
document.querySelector(".closebtn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("AGB").style.width = "0";
});
