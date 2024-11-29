let startGame = false; // game is off
const gravity = 1; // gravity
const speedUp = -10;
let birdTop = 50;

let birdIntervalDown;
let birdIntervalUp;
// Container
const containerDiv = document.querySelector(".container");
// get the bird's rect
const birdDiv = document.querySelector(".bird");
const birdRect = birdDiv.getBoundingClientRect();

// Score
let score = 0;
const scoreText = document.querySelector(".score");
const startButton = document.querySelector(".start");

startButton.addEventListener("click", () => {
    if (!startGame){
        score = 0;
        startGame = true; // Toggle the game stat
        startButton.disabled = true; 
        createPipes()
        moveBird()
    }
});

function stopGame() {
    location.reload(true);
    startGame = false; // reset game false
    startButton.disabled = false;
}

function moveBird() {
    const birdIntervalDown = setInterval(() => {
        birdTop += gravity;
        birdDiv.style.top = `${birdTop}%`;
        if (birdTop <= 0 || birdTop >= 100) {
            clearInterval(birdIntervalDown); 
            scoreText.textContent = `Your Lose!`;
            setTimeout(() => {
                stopGame();
            }, 3000)
        }
    }, 40); 
    birdIntervalUp = (event) => {
        if (event.code === "Space"){
            birdTop += speedUp;
            birdDiv.style.top = `${birdTop}%`;
            if (birdTop <= 0 || birdTop >= 100) {
                clearInterval(birdIntervalDown); 
                scoreText.textContent = `Your Lose!`;
                setTimeout(() => {
                    stopGame();
                }, 3000)
            } 
        }
    }
    document.addEventListener("keydown", birdIntervalUp);
}

function movePipe(){
    // create the pipe element
    const randomPipeSize = Math.floor(Math.random() * pipeHeightTop.length); 
    // Top pipe
    const pipeDivTop = document.createElement("div");
    pipeDivTop.style.height = `${pipeHeightTop[randomPipeSize]}px`;
    pipeDivTop.style.top = `${positionPipe["top"]}%`
    pipeDivTop.classList.add("pipe");
    containerDiv.appendChild(pipeDivTop);
    pipeDivTop.style.transition = "left 5s linear";
    
    // Bottom pipe
    const pipeDivBottom = document.createElement("div");
    pipeDivBottom.style.height = `${pipeHeightBottom[randomPipeSize]}px`;
    pipeDivBottom.style.bottom = `${positionPipe["bottom"]}%`
    pipeDivBottom.classList.add("pipe");
    containerDiv.appendChild(pipeDivBottom);
    pipeDivBottom.style.transition = "left 5s linear";

    setInterval(() => {
        pipeDivTop.remove(); // Remove the pipe if it’s completely off-screen to the left by time
        pipeDivBottom.remove()
    }, 6000)

    setTimeout(() => {
        pipeDivTop.style.left = "-200px"; // Move it 200px to the left
        pipeDivBottom.style.left = "-200px"; // Move it 200px to the left
    }, 1000);

    const collisionCheckInterval = setInterval(() => {
        const birdRect = birdDiv.getBoundingClientRect(); // Changes the bird postions when move
        const pipeRectTop = pipeDivTop.getBoundingClientRect();
        const pipeRectBottom = pipeDivBottom.getBoundingClientRect();
        if ((birdRect.right > pipeRectTop.left && birdRect.left < pipeRectTop.right && birdRect.bottom > pipeRectTop.top && birdRect.top < pipeRectTop.bottom) || (birdRect.right > pipeRectBottom.left && birdRect.left < pipeRectBottom.right && birdRect.bottom > pipeRectBottom.top && birdRect.top < pipeRectBottom.bottom)) {
            stopGame();  // Stop the game when collision detected
            clearInterval(collisionCheckInterval); // Stop checking after collision
        }
    }, 100);
}

function createPipes(){
    for (let i = 0; i < pipeAmount; i++){
        setTimeout(() => {
            movePipe();
            score++;
            scoreText.textContent = `Score: ${score}`;
            if (score === pipeAmount){
                scoreText.textContent = `Congratulations! You win`;
                setTimeout(() => {
                    stopGame();
                }, 3000)
                clearInterval(birdIntervalDown);
                clearInterval(birdIntervalUp);
                document.removeEventListener("keydown", birdIntervalUp); // Stop listening to keyboard inputs when game over
            }
        }, i * 2000)
    }  
}

// Load the sound classifier model
const classifier = ml5.soundClassifier('SpeechCommands18w', () => {
    console.log('Model Loaded!');
    classifySound();
});

function classifySound() {
    classifier.classifyStart((results) => {
        // Display the most likely wor
        if (results[0].label === "up" && startGame){
            const resultDiv = document.querySelector('.result');
            resultDiv.textContent = `Label: ${results[0].label}, Confidence: ${results[0].confidence.toFixed(2)}`;
            birdTop += speedUp;
            birdDiv.style.top = `${birdTop}%`;
            if (birdTop <= 0 || birdTop >= 100) {
                clearInterval(birdIntervalDown); 
                scoreText.textContent = `Your Lose!`;
                setTimeout(() => {
                    stopGame();
                }, 3000)
            } 
        }
    });
  }