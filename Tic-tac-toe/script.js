//Select three elements i.e <p> , all box <div> , <button>

const boxes=document.querySelectorAll(".box");  // 9 boxes
const gameinfo=document.querySelector(".game-info");
const new_game_btn=document.querySelector(".btn");

//Variables needed
let current_player;  /* current player konn hai */

// all possible cases of winning
const winning_position=[
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]; 

//Game ke grid jann ne ke liye like kya sare boxes fill ho chuke hain yaa game kaha takk gaya hai
let game_grid;

//Initial time main kya thaa uske liye ekk function
function init_game(){
    current_player="X";
    game_grid = ["", "", "", "", "", "", "", "", ""]; // hamare grid main change
    //UI main v change karna padega :- sare boxes empty hoga
    boxes.forEach((box, index) => {
        box.innerText = "";
        box.style.pointerEvents = "all";
        box.classList.remove("win"); //remove green color
      });
    new_game_btn.classList.remove("active");
    gameinfo.innerText=`Current Player - ${current_player}`;
}

init_game();

//Event listner in every box
//Index represent which box is click
boxes.forEach((box,index)=>{
    box.addEventListener("click",()=>{
        handle_click(index);
    })
})


//Handle_click() current user ke hisab se X ya 0 karega
//unclickable to current box
//next click ko jane se pehle check karna kahi jitt toh nahi gaya current player
function handle_click(index) {
    // Make sure only, Empty cells are filled
    //Agar empty hai toh kamm karega
    if (game_grid[index] === "") {
        boxes[index].style.pointerEvents = "none"; //Means current box further access nai ho payega
        //pointer hni jabb nai ayega dusri barr click kese hoga
        boxes[index].innerText = current_player; //UI main change hoga
        game_grid[index] = current_player; // hamare grid main change
        swapTurn(); //SWap karo turn ko
        checkGameOver(); //check koi jitt toh nai gaya
    }
  }
function swapTurn() {
    if (current_player === "X") {
      current_player = "0";
    } else {
      current_player = "X";
    }
    gameinfo.innerText = `Current Player - ${current_player}`;
}
function checkGameOver(){
//Three cases present here
//1.result
//2.continue
//3.tie
    let result="";
    //Farak hamme ui se nia grid main jo hai usse padta hai
    
    winning_position.forEach((position)=>{
        //All three boxes should be none empty and exactly same in value which winning_position
        if (
            (game_grid[position[0]] !== "" && game_grid[position[1]] !== "" && game_grid[position[2]] !== "") 
            && game_grid[position[0]] === game_grid[position[1]] && game_grid[position[0]] === game_grid[position[2]]){

                //Check wiiner is  X or not
                if (game_grid[position[0]] === "X") result = "X";
                else result = "0";

                //now we know who is winner thne color it
                boxes[position[0]].classList.add("win");
                boxes[position[1]].classList.add("win");
                boxes[position[2]].classList.add("win");

                //color karne ke badd next click karne matt do
                boxes.forEach((box)=>{
                    box.style.pointerEvents="none";
                })
          }
    });

    //If we have a winner then change it to dash board 
    if(result!==""){
        gameinfo.innerText=`Winner Player - ${result}`;
        new_game_btn.classList.add("active");
        return;
    }

    //Tie condition:--- board/game_grid is filled but winner is not decide
    let boardFilled = true;
        game_grid.forEach((box) => {
            if (box === "") boardFilled = false;
        });
    // Board is filled, but game is tie
    if(boardFilled) {
        gameinfo.innerText = "Game Tied !";
        new_game_btn.classList.add("active");
        return;
  }

}


//New_game_btn
new_game_btn.addEventListener("click",init_game)