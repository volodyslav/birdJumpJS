
let startGame = false; // game is off
const gravity = 1; // gravity
const speedUp = -10;
let birdTop = 50;
// Container
const containerDiv = document.querySelector(".container");

// get the bird's rect
const birdDiv = document.querySelector(".bird");
const birdRect = birdDiv.getBoundingClientRect();

// Debug 
const textTouch = document.querySelector(".touch");
textTouch.textContent = "Touch count: ";
let touchCount = 0;


function moveBird() {
    const interval = setInterval(() => {
        birdTop += gravity;
        birdDiv.style.top = `${birdTop}%`;
        if (birdTop <= 0 || birdTop >= 100) {
            clearInterval(interval); 
            console.log("Bird hit the boundary!");
        }
    }, 40); 
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space"){
            birdTop += speedUp;
            birdDiv.style.top = `${birdTop}%`;
            if (birdTop <= 0 || birdTop >= 100) {
                clearInterval(interval); 
                console.log("Bird hit the boundary!");
            } 
        }
    })
}

function movePipe(){
    // create the pipe element
    const randomPipeSize = Math.floor(Math.random() * pipeHeightTop.length);  
    console.log(randomPipeSize);

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
        if (birdRect.right > pipeRectTop.left && birdRect.left < pipeRectTop.right && birdRect.bottom > pipeRectTop.top && birdRect.top < pipeRectTop.bottom) {
            touchCount++
            textTouch.textContent = `Touch count: ${touchCount}`
            console.log("Touch!"); // Collision detected
            clearInterval(collisionCheckInterval); // Stop checking after collision
        }
        if (birdRect.right > pipeRectBottom.left && birdRect.left < pipeRectBottom.right && birdRect.bottom > pipeRectBottom.top && birdRect.top < pipeRectBottom.bottom) {
            touchCount++
            textTouch.textContent = `Touch count: ${touchCount}`
            console.log("Touch!"); // Collision detected
            clearInterval(collisionCheckInterval); // Stop checking after collision
        }
    }, 100);
}

function createPipes(){
    for (let i = 0; i < pipeAmount; i++){
        setTimeout(() => {
            movePipe();
        }, i * 2000)
    }    
}


createPipes()
moveBird()

