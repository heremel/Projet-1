import { numberOfImages } from './data.js';
const popUp = document.querySelector(".windowPopUp")
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const openPopUp = document.querySelector('.see-meme-button');
const closePopUp = document.querySelector('.close-button');
const buttonG = document.querySelector('.button-generate');
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
randomImgs();