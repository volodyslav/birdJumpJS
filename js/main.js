const containerDiv = document.querySelector(".container");

// get the bird's rect
const birdDiv = document.querySelector(".bird");
const birdRect = birdDiv.getBoundingClientRect();


function deletePipes(){
    const pipeDivPrev = document.querySelectorAll(".pipe");
    if (pipeDivPrev){
        pipeDivPrev.forEach(pipe => {
            pipe.remove(); // Remove each pipe element
        });
    }
}

function createPipe(){
    // create the pipe element
    const pipeDiv = document.createElement("div");
    pipeDiv.classList.add("pipe");
    containerDiv.appendChild(pipeDiv);
    pipeDiv.style.transition = "left 5s linear";

    setTimeout(() => {
        pipeDiv.style.left = "-200px"; // Move it 200px to the left
    }, 1000);

    const collisionCheckInterval = setInterval(() => {
        const birdRect = birdDiv.getBoundingClientRect();
        const pipeRect = pipeDiv.getBoundingClientRect();

        if (birdRect.right > pipeRect.left && birdRect.left < pipeRect.right && birdRect.bottom > pipeRect.top && birdRect.top < pipeRect.bottom) {
            console.log("Touch!"); // Collision detected
            clearInterval(collisionCheckInterval); // Stop checking after collision
        }
    }, 100);
}

setInterval(() => {
    deletePipes();
}, 10000)

for (let i = 0; i < pipeAmount; i++){
    setTimeout(() => {
        createPipe();
    }, i * 2000)
    
}


