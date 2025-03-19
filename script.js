
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();  // Garder une référence à l'image
let currentImagePath = '';  // Pour garder la trace de l'image actuelle

// Fonction pour mettre à jour l'image sur le canvas
function updateImageOnCanvas(imagePath) {
    image.src = imagePath;
    image.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Redessiner l'image
    };
}

// Fonction pour générer une image aléatoire
function randomImgs() {
    const myImages = [];
    const numberOfImages = 41;
    for (let i = 1; i <= numberOfImages; i++) {
        myImages.push(`assets/memes/image${i}.png`);
    }

    let rnd = Math.floor(Math.random() * myImages.length);
    updateImageOnCanvas(myImages[rnd]);

    let button = document.querySelector('.img-button');
    button.disabled = true;

    setTimeout(() => {
        button.disabled = false;
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

randomImgs();

const popUp = document.querySelector(".windowPopUp")
function windowPopUpFunc(){
    popUp.style.display = "flex";
}

function windowPopUpCloseFunc(){
    popUp.style.display = "none";
}