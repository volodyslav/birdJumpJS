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

// Debug 
const textTouch = document.querySelector(".touch");
textTouch.textContent = "Touch count: ";
let touchCount = 0;

// Score
let score = 0;
const scoreText = document.querySelector(".score");
const startButton = document.querySelector(".start");

startGame = false; // fset game false
score = 0;
startButton.addEventListener("click", () => {
    if (!startGame){
        startGame = true; // Toggle the game state
        console.log("Game Started:", startGame);
        startButton.disabled = true; 
        createPipes()
        moveBird()
    }
});

function stopGame() {
    startGame = false; // Set the game state to false
    startButton.disabled = false; // Enable the start button to allow restarting
    clearInterval(birdIntervalDown); // Clear the bird movement interval
    document.removeEventListener("keydown", birdIntervalUp); // Remove the space key handler
    containerDiv.querySelectorAll(".pipe").forEach(pipe => pipe.remove()); // Remove all pipes
    console.log("Game stopped.");
}


function moveBird() {
    const birdIntervalDown = setInterval(() => {
        birdTop += gravity;
        birdDiv.style.top = `${birdTop}%`;
        if (birdTop <= 0 || birdTop >= 100) {
            clearInterval(birdIntervalDown); 
            console.log("Bird hit the boundary!");
            stopGame(); 
        }
    }, 40); 
    birdIntervalUp = (event) => {
        if (event.code === "Space"){
            birdTop += speedUp;
            birdDiv.style.top = `${birdTop}%`;
            if (birdTop <= 0 || birdTop >= 100) {
                clearInterval(birdIntervalDown); 
                console.log("Bird hit the boundary!");
                stopGame();
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
            touchCount++
            textTouch.textContent = `Touch count: ${touchCount}`
            console.log("Touch!"); // Collision detected
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
        }, i * 2000)
    }  
}

