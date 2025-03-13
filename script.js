function randomImg1() {
	const myImages1 = [];
	const numberOfImages = 42;
	for (let i = 1; i <= numberOfImages; i++){
		myImages1.push(`memes/image${i}.png`);
	}
	
	let rnd = Math.floor( Math.random() * myImages1.length );
	console.log('Image sélectionnée :', myImages1[rnd]);
    
    let html_code = '<img class="memes" src="' + myImages1[rnd] + '" alt="random meme" />';
    document.getElementById('imageContainer').innerHTML = html_code;

let button = document.querySelector('.button-generate');
    button.disabled = true; // Désactive le bouton

    // Réactive le bouton après 2 secondes
    setTimeout(function() {
        button.disabled = false; // Réactive le bouton
    }, 1500);
}


