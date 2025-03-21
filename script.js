import { numberOfImages } from "./data.js";

const popUp = document.querySelector(".windowPopUp");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");
const openPopUp = document.querySelector(".see-meme-button");
const closePopUp = document.querySelector(".close-button");
const buttonG = document.querySelector(".button-generate");
const addTextBtn = document.getElementById("addTextButton");
const formatMenu = document.getElementById("formatMenu");
const colorPicker = document.getElementById("colorPicker");
const fontSizeSelector = document.getElementById("fontSizeSelector");
const imageContainer = document.getElementById("imageContainer");
const image = new Image(); // Garder une référence à l'image
let currentTextZone = null; // Pour garder la trace de la zone de texte active

// Fonction pour mettre à jour l'image sur le canvas
function updateImageOnCanvas(imagePath) {
  image.src = "";
  image.src = imagePath;
  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Redessiner l'image
    addTextOnImage(); // Ajouter la zone de texte après avoir chargé l'image
  };
}

// Fonction pour générer une image aléatoire
function randomImgs() {
  const rnd = Math.floor(Math.random() * numberOfImages.length);
  updateImageOnCanvas(numberOfImages[rnd]);

  buttonG.disabled = true;
  setTimeout(() => {
    buttonG.disabled = false;
    buttonG.style.cursor = "not-allowed";
  }, 1500);
}

// Bouton de téléchargement
document.getElementById("downloadButton").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.font = "24px Impact";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(
    document.getElementById("texte-area").value,
    canvas.width / 2,
    canvas.height - 20
  );

  const link = document.createElement("a");
  link.download = "meme.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// PopUp handlers
function windowPopUpFunc() {
  popUp.style.display = "flex";
}
function windowPopUpCloseFunc() {
  popUp.style.display = "none";
}

buttonG.addEventListener("click", () => randomImgs());
openPopUp.addEventListener("click", () => windowPopUpFunc());
closePopUp.addEventListener("click", () => windowPopUpCloseFunc());

addTextBtn.addEventListener("click", () => {
  addTextOnImage(); // Ajoute la zone de texte lorsque le bouton est cliqué
});

// Fonction pour ajouter la zone de texte sur l'image
function addTextOnImage() {
  const textZone = document.createElement("div");
  textZone.classList.add("text-zone");
  textZone.contentEditable = true;
  textZone.innerText = "Votre texte";
  textZone.style.fontSize = "20px";
  textZone.style.position = "absolute";
  textZone.style.left = "50px";
  textZone.style.top = "50px";
  imageContainer.appendChild(textZone);
  makeDraggable(textZone);

  textZone.addEventListener("click", (e) => {
    e.stopPropagation();
    currentTextZone = textZone;
    if (textZone.innerText === "Votre texte") {
      textZone.innerText = "";
    }
    showFormattingMenu(e.pageX, e.pageY); // Affiche le menu de formatage
    colorPicker.value = rgbToHex(
      window.getComputedStyle(currentTextZone).color
    );
    fontSizeSelector.value = Number.parseInt(
      window.getComputedStyle(currentTextZone).fontSize
    );
  });

  textZone.addEventListener("contextmenu", (e) => e.preventDefault());

  let lastRightClickTime = 0;
  textZone.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
      const now = Date.now();
      if (now - lastRightClickTime < 400) {
        textZone.remove();
        formatMenu.style.display = "none";
        currentTextZone = null;
      }
      lastRightClickTime = now;
    }
  });
}

// Drag & Drop
function makeDraggable(element) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  element.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
  });
  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  });
  window.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

// Affiche le menu de formatage
function showFormattingMenu(x, y) {
  formatMenu.style.left = `${x}px`;
  formatMenu.style.top = `${y - 80}px`;
  formatMenu.style.display = "flex";
}

// Menu de formatage (fusion des deux écouteurs)
formatMenu.addEventListener("click", (e) => {
  e.stopPropagation(); // Empêche la fermeture du menu
  const command = e.target.dataset.cmd;
  if (command && currentTextZone) {
    document.execCommand(command, false, null);
  }
});

// Color Picker
colorPicker.addEventListener("input", (e) => {
  if (currentTextZone) {
    currentTextZone.style.color = colorPicker.value;
  }
  e.stopPropagation();
});

// Changement de taille
fontSizeSelector.addEventListener("change", (e) => {
  if (currentTextZone) {
    currentTextZone.style.fontSize = `${fontSizeSelector.value}px`;
  }
  e.stopPropagation();
});

// Fermer le menu si clic ailleurs
window.addEventListener("click", () => {
  formatMenu.style.display = "none";
  currentTextZone = null;
});

// Conversion RGB -> HEX
function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  return `#${result
    .slice(0, 3)
    .map((x) => (+x).toString(16).padStart(2, "0"))
    .join("")}`;
}

// Génère une image au chargement
randomImgs();
