let userScore = 0;
let compScore = 0;

const choiceMade = document.querySelectorAll(".circle"); 
const message = document.querySelector("#result-div");
const user_score = document.querySelector("#you-score");
const comp_score = document.querySelector("#comp-score");

const genCompChoice = () => {
    // Rock, paper and Scissors
    const choices = ["Rock","Paper","Scissors"];
    let Value = Math.floor(Math.random()*3);
    return choices[Value];
};

const gameDraw = () => {
    message.innerText = "Game was Draw. Play Again";
    message.style.backgroundColor = "#252349";
}

const showWinner = (userWin,userChoice,compChoice) => {
    if(userWin === true){
        message.innerText = `You Win! Your ${userChoice} beats ${compChoice}`;
        message.style.backgroundColor = "#0eab05";
        userScore++;
    }
    else{
        message.innerText = `Comp Wins! ${compChoice} beats your ${userChoice}`;
        message.style.backgroundColor = "#ea3043";
        compScore++;
    }
    showScore(userScore,compScore);
}

const showScore = (userScore,compScore) => {
    user_score.innerText = userScore;
    comp_score.innerText = compScore;
}

const playGame = (userChoice) => {
    // Now Generate choices made by the computer using another function which is called the modular way of programming
    const compChoice = genCompChoice();
    if(userChoice === compChoice){
        // Game Draw
        gameDraw();
    }
    else{
        let userWin = true;
        if(userChoice === "Rock"){
            userWin = compChoice === "Scissors" ? true : false ;
        }
        else if(userChoice === "Paper"){
            userWin = compChoice === "Rock" ? true : false ;
        }
        else{
            userWin = compChoice === "Paper" ? true : false ; 
        }
        showWinner(userWin,userChoice,compChoice);
    }
}

choiceMade.forEach((choice) => {
        choice.addEventListener("click",()=>{
            const userChoice = choice.getAttribute("id");
            playGame(userChoice);
        });
});