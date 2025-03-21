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
function updateCanvasTextPosition(textZone) {
  const text = textZone.innerText.trim();
  if (text === "") return;

  const rect = textZone.getBoundingClientRect();
  const containerRect = imageContainer.getBoundingClientRect();

  // Calcul de la position du texte
  const x = rect.left - containerRect.left + textZone.clientWidth / 2;
  const y =
    rect.top - containerRect.top + Number.parseInt(textZone.style.fontSize) / 2;

  // Appliquer les styles (gras, italique)
  let fontStyle = "";
  if (textZone.style.fontWeight === "bold") {
    fontStyle += "bold ";
  }
  if (textZone.style.fontStyle === "italic") {
    fontStyle += "italic ";
  }
  const fontSize = textZone.style.fontSize || "24px";
  ctx.font = `${fontStyle}${fontSize} Impact`; // Applique le style de la police

  ctx.fillStyle = textZone.style.color || "white";
  ctx.textAlign = "center";

  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.strokeText(text, x, y); // Texte en contour pour plus de lisibilité
  ctx.fillText(text, x, y); // Texte plein

  // Gérer le soulignement (si activé)
  if (textZone.style.textDecoration === "underline") {
    const textWidth = ctx.measureText(text).width;
    const underlineY = y + Number.parseInt(textZone.style.fontSize) / 2; // Position de la ligne sous le texte

    // Dessiner la ligne de soulignement
    ctx.beginPath();
    ctx.moveTo(x - textWidth / 2, underlineY); // Début de la ligne sous le texte
    ctx.lineTo(x + textWidth / 2, underlineY); // Fin de la ligne sous le texte
    ctx.lineWidth = 2; // Largeur de la ligne de soulignement
    ctx.strokeStyle = textZone.style.color || "white"; // La couleur du soulignement
    ctx.stroke();
  }
}
// function updateCanvasTextPosition(textZone) {
//   const text = textZone.innerText.trim();
//   if (text === "") return;

//   const rect = textZone.getBoundingClientRect();
//   const containerRect = imageContainer.getBoundingClientRect();

//   // Calcul de la position du texte
//   const x = rect.left - containerRect.left + textZone.clientWidth / 2;
//   const y =
//     rect.top - containerRect.top + parseInt(textZone.style.fontSize) / 2;

//   // Dessiner le texte sur le canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas avant de redessiner

//   ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Redessiner l'image

//   ctx.font = `${textZone.style.fontSize || "24px"} Impact`;
//   ctx.fillStyle = textZone.style.color || "white";
//   ctx.textAlign = "center";

//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 3;
//   ctx.strokeText(text, x, y); // Texte en contour pour plus de lisibilité
//   ctx.fillText(text, x, y); // Texte plein
// }

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

document.getElementById("downloadButton").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas avant tout dessin
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Dessiner l'image sur le canvas

  const textZones = document.querySelectorAll(".text-zone");

  // biome-ignore lint/complexity/noForEach: <explanation>
  textZones.forEach((textZone) => {
    const text = textZone.innerText.trim();
    if (text === "") return;

    const rect = textZone.getBoundingClientRect();
    const containerRect = imageContainer.getBoundingClientRect();
    const x = rect.left - containerRect.left + textZone.clientWidth / 2;
    const y =
      rect.top -
      containerRect.top +
      Number.parseInt(textZone.style.fontSize) / 2;

    ctx.font = `${textZone.style.fontSize || "24px"} Impact`;
    ctx.fillStyle = textZone.style.color || "white";
    ctx.textAlign = "center";

    const computedStyle = window.getComputedStyle(textZone);
    const fontWeight = computedStyle.fontWeight;
    const fontStyle = computedStyle.fontStyle;
    const textDecoration = computedStyle.textDecorationLine;

    if (fontWeight === "bold") {
      ctx.font = `bold ${ctx.font}`;
    }
    if (fontStyle === "italic") {
      ctx.font = `italic ${ctx.font}`;
    }

    if (textDecoration === "underline") {
      const textWidth = ctx.measureText(text).width;
      ctx.beginPath();
      ctx.moveTo(x - textWidth / 2, y + 2); // Légèrement en dessous du texte
      ctx.lineTo(x + textWidth / 2, y + 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = textZone.style.color || "white";
      ctx.stroke();
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  });

  const link = document.createElement("a");
  link.download = "meme.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
// Bouton de téléchargement
// document.getElementById("downloadButton").addEventListener("click", () => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

//   ctx.font = "24px Impact";
//   ctx.fillStyle = "white";
//   ctx.textAlign = "center";
//   console.log(
//     'document.getElementsByClassName("text-zone")[0],',
//     document.getElementsByClassName("text-zone")[0].value
//   );
//   ctx.fillText(
//     document.getElementsByClassName("text-zone")[0].value,
//     canvas.width / 2,
//     canvas.height - 20
//   );

//   const textZones = document.querySelectorAll(".text-zone");

//   // biome-ignore lint/complexity/noForEach: <explanation>
//   textZones.forEach((textZone) => {
//     const text = memeText;
//     const x = textZone.offsetLeft - imageContainer.offsetLeft; // Position relative
//     const y = textZone.offsetTop - imageContainer.offsetTop;
//     console.log("x", x, "y", y);
//     ctx.fillText(text, x, y);
//   });

//   const link = document.createElement("a");
//   link.download = "meme.png";
//   console.log("kikoo");
//   link.href = canvas.toDataURL("assets/image/png");
//   link.click();
// });

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

function addTextOnImage() {
  console.log("kikoo");
  const textZone = document.createElement("div");
  textZone.classList.add("text-zone");
  textZone.contentEditable = true;
  textZone.innerText = "Votre texte";
  textZone.style.position = "absolute";
  textZone.style.fontSize = "24px";
  textZone.style.color = "black";
  textZone.style.fontFamily = "sans-serif";
  textZone.style.textAlign = "center";
  textZone.style.background = "transparent";
  textZone.style.border = "none";
  textZone.style.outline = "none";
  textZone.style.left = "50px"; // Position par défaut
  textZone.style.top = "50px";
  textZone.style.cursor = "move"; // Indicateur que c'est déplaçable

  imageContainer.appendChild(textZone);
  makeDraggable(textZone);

  textZone.addEventListener("click", (e) => {
    e.stopPropagation();
    currentTextZone = textZone;
    showFormattingMenu(e.pageX, e.pageY);
    colorPicker.value = rgbToHex(
      window.getComputedStyle(currentTextZone).color
    );
    fontSizeSelector.value = Number.parseInt(
      window.getComputedStyle(currentTextZone).fontSize
    );
  });

  textZone.addEventListener("contextmenu", (e) => e.preventDefault());

  // Met à jour la position du texte sur le canvas à chaque changement
  textZone.addEventListener("input", () => {
    updateCanvasTextPosition(textZone); // Met à jour la position du texte sur le canvas
  });
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
// Fonction pour ajouter la zone de texte sur l'image
// function addTextOnImage() {
//   // const textZone = document.createElement("div"); TEST
//   const textZone = document.createElement("div");
//   // textZone.type = "text";
//   textZone.classList.add("text-zone");
//   // textZone.contentEditable = true;
//   textZone.innerText = "Votre texte";
//   textZone.style.fontSize = "20px";
//   textZone.style.position = "absolute";
//   textZone.style.left = "50px";
//   textZone.style.top = "50px";

//   imageContainer.appendChild(textZone);
//   makeDraggable(textZone);

//   textZone.addEventListener("click", (e) => {
//     e.stopPropagation();
//     currentTextZone = textZone;
//     if (textZone.innerText === "Votre texte") {
//       textZone.innerText = "";
//     }
//     showFormattingMenu(e.pageX, e.pageY); // Affiche le menu de formatage
//     colorPicker.value = rgbToHex(
//       window.getComputedStyle(currentTextZone).color
//     );
//     fontSizeSelector.value = Number.parseInt(
//       window.getComputedStyle(currentTextZone).fontSize
//     );
//     // ici on a text-zone
//   });

//   textZone.addEventListener("contextmenu", (e) => e.preventDefault());

//   // let lastRightClickTime = 0;
//   // textZone.addEventListener("mousedown", (e) => {
//   //   if (e.button === 2) {
//   //     const now = Date.now();
//   //     if (now - lastRightClickTime < 400) {
//   //       textZone.remove();
//   //       formatMenu.style.display = "none";
//   //       currentTextZone = null;
//   //     }
//   //     lastRightClickTime = now;
//   //   }
//   // });

//   const zoneText = document.querySelector(".text-zone");
//   console.log("zoneText", zoneText.value);
//   zoneText.addEventListener("change", () => {
//     console.log("value", zoneText.value);
//     memeText = zoneText.value;
//   });

//   // ctx.appendChild(zoneText);
// }

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

formatMenu.addEventListener("click", (e) => {
  e.stopPropagation(); // Empêche la fermeture du menu
  const command = e.target.dataset.cmd;
  if (command && currentTextZone) {
    switch (command) {
      case "bold":
        currentTextZone.style.fontWeight =
          currentTextZone.style.fontWeight === "bold" ? "normal" : "bold";
        break;
      case "italic":
        currentTextZone.style.fontStyle =
          currentTextZone.style.fontStyle === "italic" ? "normal" : "italic";
        break;
      case "underline":
        currentTextZone.style.textDecoration =
          currentTextZone.style.textDecoration === "underline"
            ? "none"
            : "underline";
        break;
    }
    updateCanvasTextPosition(currentTextZone); // Recalcule la position après changement de style
  }
});

//lor Picker
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
