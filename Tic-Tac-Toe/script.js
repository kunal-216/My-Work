let boxes = document.querySelectorAll(".box");
let rstBtn = document.querySelector(".rst-btn");
let newBtn = document.querySelector(".new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true;
let winPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

boxes.forEach((box)=> {
    box.addEventListener("click", ()=>{
        if(turnO){
            // Player O turn
            box.innerText = "O";
            turnO = false;
        }
        else{
            // Player X turn
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true; // to avoid changing the text of the box on clicking it again
        checkWinner();
    })
})

const disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;
    }
}

const enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerText = "";
    }
}

const printWinner = (winner) => {
    msg.innerText = `Congratulations Winner is Player ${winner}`;
    msgContainer.classList.remove("hide"); // This will unhide the msg container and the winning message will be showed
}

const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
}

const checkWinner = () => {
    for(pattern of winPatterns){   
        let posVal1 = boxes[pattern[0]].innerText;
        let posVal2 = boxes[pattern[1]].innerText;  
        let posVal3 = boxes[pattern[2]].innerText;

        if(posVal1 != "" && posVal2 != "" && posVal3 != ""){
            if(posVal1 === posVal2 && posVal2 === posVal3){
                console.log(`Player${posVal1} wins`);
                disableBoxes();
                printWinner(posVal1);
                break;
            }
        }
    }
}

rstBtn.addEventListener("click" , resetGame);
newBtn.addEventListener("click" , resetGame);