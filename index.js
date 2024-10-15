class Player {
    static X = "X";
    static O = "O";
}

class WinChecker {
    constructor(elements, solutions) {
        this.elements = elements; // 9 DOM elements
        this.solutions = solutions; // 8x3
    }

    checkWin() {
        for (const solution of this.solutions) {
            const [i1, i2, i3] = solution;

            const e1 = this.elements[i1].textContent;
            const e2 = this.elements[i2].textContent;
            const e3 = this.elements[i3].textContent;

            if (e1 !== "" && e1 === e2 && e2 === e3) {
                return true;
            }
        }
        
        return false;
    }
}

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10
        };
        this.alpha = 1.5;
        this.friction = 0.99;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = { x: 0, y: Math.random() * -2.5 - 0.5 };
        this.particles = [];
        this.lifespan = 250;
        this.hasExploded = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    explode() {
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    update() {
        this.lifespan--;

        if (this.lifespan <= 0 && !this.hasExploded) {
            this.explode();
            this.velocity = { x: 0, y: 0 };
            this.hasExploded = true;
        } else if (this.lifespan > 0) {
            this.y += this.velocity.y;
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();
        }
    }
}

let fireworks = [];
let animationFrameId;

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();

        // Remove finished fireworks
        if (firework.lifespan <= 0 && firework.particles.every(p => p.alpha <= 0)) {
            fireworks.splice(index, 1);
        }
    });

    // Randomly generate new fireworks
    if (Math.random() < 0.015) { 
        const x = Math.random() * canvas.width;
        const color = `hsl(120, 100%, 50%)`;
        fireworks.push(new Firework(x, canvas.height, color));
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
}

function resetFields() {
    for (const field of fields) {
        field.textContent = ""; // Reset value of fields
    }
}

function resetAnnouncement() {
    chuj.textContent = "";
    chuj2.textContent = ""; // Resets value of Announcement
    chuj3.textContent = "";
    chuj4.textContent = "";
}

function resetPlayer() {
    currentPlayer = Player.X; // Changes player back to X
}

function resetClass(){
    chuj.classList.remove('rotatingText-adjective1');
    chuj2.classList.remove('rotatingText-adjective2'); // Removes classes that make animation possible
    chuj3.classList.remove('rotatingText-adjective3');
    chuj4.classList.remove('rotatingText-adjective4');
}

function reset() {
    resetFields();
    resetAnnouncement();
    resetPlayer();
    resetClass();
    resetFireworks();  // Reset fireworks during reset
    wypierdalaj = false;
    count = 0;
    pokaz.style.display = "none"; // Hides button
}

function addClass() {
    chuj.classList.add('rotatingText-adjective1');
    chuj2.classList.add('rotatingText-adjective2'); // Adds class that makes animation possible
    chuj3.classList.add('rotatingText-adjective3');
}

function addClassDraw(){
    chuj4.classList.add('rotatingText-adjective4');
}

function disableButtonWin(){
    document.querySelector('.butt').disabled = true;
    setTimeout(function() {
        document.querySelector('.butt').disabled = false; // Sets timeout for button after winning
    }, 4200);
}

function disableButtonDraw(){
    document.querySelector('.butt').disabled = true;
    setTimeout(function() {
        document.querySelector('.butt').disabled = false; // Sets timeout for button after draw
    }, 1000);
}

function resetFireworks() {
    fireworks = []; // Clear the fireworks array
    clearCanvas(); // Clear the canvas completely
    cancelAnimationFrame(animationFrameId); // Stop the current animation loop
    animationFrameId = null; // Reset the animation frame ID
}

const SOLUTIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8]
];

let fields = document.querySelectorAll(".pole"); 
const chuj = document.getElementById("jeden");
const chuj2 = document.getElementById("dwa"); // Selects four paragraphs
const chuj3 = document.getElementById("trzy"); 
const chuj4 = document.getElementById("cztery");
const pokaz = document.querySelector(".butt");  // Button selector
const winHistoryX = document.querySelector(".Xhistory");
const winHistoryO = document.querySelector(".Ohistory");
const drawHistory = document.querySelector(".Draws");


const checker = new WinChecker(fields, SOLUTIONS);

let currentPlayer = Player.X;
let count = 0;
let wypierdalaj = false;


let winCounterX = parseInt(localStorage.getItem("WinX")) || 0;
let winCounterO = parseInt(localStorage.getItem("WinO")) || 0;
let drawCounter = parseInt(localStorage.getItem("draw")) || 0;


winHistoryX.textContent = winCounterX;
winHistoryO.textContent = winCounterO;
drawHistory.textContent = drawCounter;

for (const field of fields) {
    field.addEventListener("click", function() {
        if (field.textContent !== "") {
            alert("Learn how to play you moron");
            return;
        }
        if (wypierdalaj) {
            return;
        }
       
        field.textContent = currentPlayer;
        if (checker.checkWin()) {
            addClass();
            disableButtonWin();
            animate(); // Start fireworks
        
            chuj.textContent = "Winner";
            chuj2.textContent = "Is";
            chuj3.textContent = currentPlayer;                                  
            wypierdalaj = true;
            pokaz.style.display = "block"; 

            if(currentPlayer === "X"){
                winCounterX++;
                localStorage.setItem("WinX", winCounterX);  // Store updated win count
            }
            if (currentPlayer === "O"){
                winCounterO++;
                localStorage.setItem("WinO", winCounterO);  // Store updated win count
            }
            
           
            winHistoryX.textContent = localStorage.getItem("WinX");
            winHistoryO.textContent = localStorage.getItem("WinO");
            
            setTimeout(function() {
                showButtonWithDelay();
            }, 6000);
            return;
        } 
        
        if (++count === 9) {
            addClassDraw();
            disableButtonDraw();
            drawCounter++;
            localStorage.setItem("draw", drawCounter);  // Store updated draw count
            
            chuj4.textContent = "Draw";
            pokaz.style.display = "block";
            
            // Update the displayed draw history
            drawHistory.textContent = localStorage.getItem("draw");
            
            setTimeout(function() {
                showButtonWithDelay();
            }, 1000);
            return;
        }
        
        // Toggle player
        currentPlayer = (currentPlayer === Player.X) ? Player.O : Player.X;
    });
}
