let pokemonImages = [];
let cards = [];
let selectedCards = [];
let matchedPairs = 0;
let canClick = true;
let canvasSize = 550;
let spacing = 10; 

function preload() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
        .then(response => response.json())
        .then(data => {
            let promises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
            Promise.all(promises).then(pokemonData => {
                pokemonImages = pokemonData.map(p => p.sprites.front_default);
                setupGame();
            });
        });
}

function setupGame() {
    let images = [...pokemonImages, ...pokemonImages]; 
    images = shuffle(images); 
    cards = images.map(img => ({ img, revealed: false, matched: false }));
    
    createCanvas(canvasSize, canvasSize).position((windowWidth - canvasSize) / 2, (windowHeight - canvasSize) / 2);
    noLoop();
}

function draw() {
    background(200);
    let cols = 5;
    let rows = 4;
    let cardWidth = (width - (cols + 1) * spacing) / cols;
    let cardHeight = (height - (rows + 1) * spacing) / rows;
    
    for (let i = 0; i < cards.length; i++) {
        let x = (i % cols) * (cardWidth + spacing) + spacing;
        let y = floor(i / cols) * (cardHeight + spacing) + spacing;
        
        if (cards[i].matched || cards[i].revealed) {
            let img = loadImage(cards[i].img, loadedImg => image(loadedImg, x, y, cardWidth, cardHeight));
        } else {
            fill(100);
            rect(x, y, cardWidth, cardHeight);
        }
    }
}

function mousePressed() {
    if (!canClick) return;
    let cols = 5;
    let rows = 4;
    let cardWidth = (width - (cols + 1) * spacing) / cols;
    let cardHeight = (height - (rows + 1) * spacing) / rows;
    
    let xIndex = floor((mouseX - spacing) / (cardWidth + spacing));
    let yIndex = floor((mouseY - spacing) / (cardHeight + spacing));
    let index = xIndex + yIndex * cols;
    
    if (index < cards.length && !cards[index].revealed && !cards[index].matched) {
        cards[index].revealed = true;
        selectedCards.push(index);
        redraw(); 
        
        if (selectedCards.length === 2) {
            canClick = false;
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    let [first, second] = selectedCards;
    if (cards[first].img === cards[second].img) {
        cards[first].matched = true;
        cards[second].matched = true;
        matchedPairs++;
        if (matchedPairs === pokemonImages.length) {
            alert("¡Ganaste! Has encontrado todas las parejas.");
        }
    } else {
        setTimeout(() => {
            cards[first].revealed = false;
            cards[second].revealed = false;
            redraw();
        }, 1000);
    }
    selectedCards = [];
    canClick = true;
} 

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
