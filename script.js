import { numberOfImages } from './data.js';

const popUp = document.querySelector(".windowPopUp")
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const openPopUp = document.querySelector('.see-meme-button');
const closePopUp = document.querySelector('.close-button');
const buttonG = document.querySelector('.button-generate');
const addTextBtn = document.getElementById('addTextButton');
const formatMenu = document.getElementById('formatMenu');
const colorPicker = document.getElementById('colorPicker');
const fontSizeSelector = document.getElementById('fontSizeSelector');
let image = new Image();  // Garder une référence à l'image
let currentImagePath = '';  // Pour garder la trace de l'image actuelle

// Fonction pour mettre à jour l'image sur le canvas
function updateImageOnCanvas(imagePath) {
    image.src = '';
    image.src = imagePath;
    image.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Redessiner l'image
    };
}

// Fonction pour générer une image aléatoire
function randomImgs() {
    let rnd = Math.floor(Math.random() * numberOfImages.length);
    updateImageOnCanvas(numberOfImages[rnd]);

    let button = document.querySelector('.button-generate');
    button.disabled = true;

    setTimeout(() => {
        button.disabled = false;
        button.style.cursor = "not-allowed";
    }, 1500);
}

// Bouton de téléchargement
document.getElementById('downloadButton').addEventListener('click', function() {
    // Avant de télécharger, on s'assure que l'image et le texte sont à jour
    // Effacer et redessiner l'image avec le texte
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Redessiner l'image
    ctx.font = '24px Impact';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(document.getElementById('texte-area').value, canvas.width / 2, canvas.height - 20); // Ajouter le texte

    // Créer un lien pour télécharger l'image avec le texte
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('assets/image/png'); // Générer l'image avec le texte
    link.click();
});

function windowPopUpFunc(){
    popUp.style.display = "flex";
}

function windowPopUpCloseFunc(){
    popUp.style.display = "none";
}

buttonG.addEventListener('click', () => {
    randomImgs()
})

openPopUp.addEventListener('click', () =>{
    windowPopUpFunc();
})

closePopUp.addEventListener('click', () =>{
    windowPopUpCloseFunc();
})

// Ajout d'une zone de texte
addTextBtn.addEventListener('click', () => {
    const textZone = document.createElement('div');
    textZone.className = 'text-zone';
    textZone.contentEditable = true;
    textZone.innerText = 'Votre texte';
    textZone.style.fontSize = '20px'; // Par défaut
    imageContainer.appendChild(textZone);
    makeDraggable(textZone);

    // Afficher le menu au clic + suppression du texte par défaut
textZone.addEventListener('click', (e) => {
    e.stopPropagation();
    currentTextZone = textZone;

    // Supprime le texte par défaut si c'est le premier clic
    if (textZone.innerText === 'Votre texte') {
        textZone.innerText = '';
    }

    showFormattingMenu(e.pageX, e.pageY);
    colorPicker.value = rgbToHex(window.getComputedStyle(currentTextZone).color);
    fontSizeSelector.value = parseInt(window.getComputedStyle(currentTextZone).fontSize);
});

    // Suppression par double clic droit
    textZone.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Empêche le menu clic droit
    });

    let lastRightClickTime = 0;
    textZone.addEventListener('mousedown', (e) => {
        if (e.button === 2) { // Bouton droit
            const now = Date.now();
            if (now - lastRightClickTime < 400) { // Double clic droit rapide
                textZone.remove();
                formatMenu.style.display = 'none';
                currentTextZone = null;
            }
            lastRightClickTime = now;
        }
    });
});

// Drag & Drop
function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, isDragging = false;
    element.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Drag uniquement clic gauche
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
    });
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
}

// Affiche le menu
function showFormattingMenu(x, y) {
    formatMenu.style.left = `${x}px`;
    formatMenu.style.top = `${y - 80}px`;
    formatMenu.style.display = 'flex';
}

// Formatage : Gras / Italique / Souligné
formatMenu.addEventListener('click', (e) => {
    const command = e.target.dataset.cmd;
    if (command && currentTextZone) {
        document.execCommand(command, false, null);
    }
    e.stopPropagation();
});

// Empêche la fermeture du menu quand on clique dedans
formatMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Color Picker
colorPicker.addEventListener('input', (e) => {
    if (currentTextZone) {
        currentTextZone.style.color = colorPicker.value;
    }
    e.stopPropagation();
});

// Changement de taille
fontSizeSelector.addEventListener('change', (e) => {
    if (currentTextZone) {
        currentTextZone.style.fontSize = `${fontSizeSelector.value}px`;
    }
    e.stopPropagation();
});

// Fermer le menu si clic ailleurs
window.addEventListener('click', () => {
    formatMenu.style.display = 'none';
    currentTextZone = null;
});

// Utilitaire conversion couleur RGB -> HEX
function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    return "#" + result.slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('');
}

randomImgs();
