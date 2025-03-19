const imageContainer = document.getElementById('imageContainer');
const addTextBtn = document.getElementById('addTextButton');
let image = new Image(); // Garder une référence à l'image
let currentImagePath = ''; // Pour garder une trace de l'image actuelle

// Ajout d'une zone de texte dynamique
addTextBtn.addEventListener('click', () => {
    const textZone = document.createElement('div');
    textZone.className = 'text-zone';
    textZone.contentEditable = true;
    textZone.innerText = 'Votre texte';
    imageContainer.appendChild(textZone);
    makeDraggable(textZone);
});

// Fonction de déplacement
function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, isDragging = false;
// Cliquer pour déplacer
    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
    });
// Déplace la zone de texte
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    });
// Pose et bloque la position de la zone de texte
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
