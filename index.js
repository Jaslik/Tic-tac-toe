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
    wypierdalaj = false;
    count = 0;
    pokaz.style.display = "none"; //hides button
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
        document.querySelector('.butt').disabled = false; //sets timeout for button after winning
    }, 4200);

}
function disableButtonDraw(){
    document.querySelector('.butt').disabled = true;
    setTimeout(function() {
        document.querySelector('.butt').disabled = false; //sets timeout for button after draw
    }, 1000);

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
const chuj2 = document.getElementById("dwa"); //selects four paragrpahs
const chuj3 = document.getElementById("trzy"); 
const chuj4 = document.getElementById("cztery");
const pokaz = document.querySelector(".butt");  //button selector

const checker = new WinChecker(fields, SOLUTIONS);

let currentPlayer = Player.X;
let count = 0;
let wypierdalaj = false;

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
            

            chuj.textContent = "Winner";
            chuj2.textContent = "Is";
            chuj3.textContent = currentPlayer;                                  
            wypierdalaj = true;
            pokaz.style.display = "block"; 

            setTimeout(function() {
                showButtonWithDelay();
            }, 6000);
            return;
        } 
        
        if (++count === 9) {
            addClassDraw();
            disableButtonDraw();
            

            chuj4.textContent = "Draw";
            pokaz.style.display = "block";

            setTimeout(function() {
                showButtonWithDelay();
            }, 1000);
            return;
            
        }
        
        if (currentPlayer === Player.X) {
            currentPlayer = Player.O;
        } else {
            currentPlayer = Player.X;
        }
    });
}
