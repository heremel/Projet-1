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

// Fonction d'ajout du texte
document.getElementById('texte-area').addEventListener('input', function() {
    // Efface et redessine l'image et le texte sur le canvas à chaque fois que le texte change
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Redessine l'image
    ctx.font = '24px Impact';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(this.value, canvas.width / 2, canvas.height - 20); // Ajoute le texte
});

// Fonction pour générer une image aléatoire
function randomImgs() {
    const myImages = [];
    const numberOfImages = 42;
    for (let i = 1; i <= numberOfImages; i++) {
        myImages.push(`memes/image${i}.png`);
    }

    let rnd = Math.floor(Math.random() * myImages.length);

    updateImageOnCanvas(myImages[rnd]);

    let button = document.querySelector('.button-generate');
    button.disabled = true;

    setTimeout(function() {
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
    link.href = canvas.toDataURL('image/png'); // Générer l'image avec le texte
    link.click();
});