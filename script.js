function getColumn(c, squareMat){
    return squareMat.map((row, r)=>{ return (r, c)})
}

function getRow(r, squareMat){
    return squareMat.map((row, c)=>{ return (r, c)})
}

function getFirstDiagonal(squareMat){
    let min = 0;
    let max = squareMat.length-1
    let firstDiagonal= [];
    while(min <= max){
        firstDiagonal.push(squareMat[min][min])
        min++
    }
    return firstDiagonal;
}

function getSecondDiagonal(squareMat){
    let min = 0;
    let max = squareMat.length-1
    let secondDiagonal= [];
    let hIndex = max;
    let lIndex =min;
    while((hIndex >= min) & (lIndex<=max)){
        secondDiagonal.push(squareMat[lIndex][hIndex])
        hIndex--;
        lIndex++;
    }
    return secondDiagonal;
}

function isC(board){
    //Todo: chenage the fx name to getCentered
    let centerAt = null; //rx, cx, d1x, d2x
    let transpose = [] // for columna checking
    for (let rowIndex=0; rowIndex<board.length; rowIndex++){
        let row = board[rowIndex];
        if (row.every(val => (val==row[0]) & !!val)){
            centerAt = "r"+rowIndex;
            return centerAt;
        }
        
        //forming columns by transposing
       transpose.push([]);
        for (let colIndex = 0; colIndex<row.length; colIndex++){
            transpose[rowIndex].push(board[colIndex][rowIndex]);
        }
    }
    
    //checking columns
    //a row of a transpose is a column
    transpose.forEach((row, i)=>{
        if (row.every(val => (val == row[0]) &!!val))
        centerAt = "c"+i
    })
    
    if (centerAt) return centerAt;
    
    //forming diagonals
    diagonals = [getFirstDiagonal(board), getSecondDiagonal(board)]
    diagonals.forEach((dia, i)=>{
        if (dia.every(val => (val == dia[0]) &!!val))
        centerAt = "d"+i;
    })
    
    
    return centerAt;
    
}

var remotePlay = (r, c)=>{}


class Model extends Array{
    constructor(base){
        super();
        this.players = [{seed: "x", score: 0, pm: 0}, {seed:"o", score: 0, pm: 0}];
        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.base = base;
        this.reset()
        
    }
    
    getEmptyNeighbors(r, c){
        let neigs = this.getNeighbors(r, c);
        return neigs.filter(neig => {
            [r, c] = neig;
            return !this[r][c]
        });
    }
    
    getNeighbors(r,c){
        r = Number(r);
        c = Number(c);
        let neig = [];
        if (r < this.base-1)
        neig.push([(r+1), c]);
        
        if (c < this.base-1)
        neig.push([r, c+1]);
        
        if (r > 0)
        neig.push([r-1, c]);
        
        if (c > 0)
        neig.push([r, c-1]);
        
        if (r == c){ // cell on a diag
            if (Math.floor(this.base/2) == r){ //cell at the center
                neig.push([r+1, c-1])
                neig.push([r-1, c+1])
                neig.push([r+1, c+1])
                neig.push([r-1, c-1])
                //neig.push([r+1, c])
                //neig.push([r, c+1])
                
                return neig;
            }
            
            //now cell is on a first diag but not at center
            if ( r < this.base-1)
            neig.push([r+1, c+1]);
            if (r > 0)
            neig.push([r-1, c-1])
            
            return neig;
        }
        
        if ((r+c) == this.base-1){ //cell on second diag
            if ( (r < this.base-1) & ((c-1) >= 0) )
            neig.push([r+1, c-1])
            if ( (r > 0) & (c < this.base-1) )
            neig.push([r-1, c+1])
            
        }
        
        return neig;
        
    }
    toRemote(){
       let rep = {};
        for (let key in this){
            if (this.hasOwnProperty(key)) {
                rep[key] = this[key];
            }
        }
        rep.data = Array.from(this);
        return rep;
    }
    fromRemote(rep){
        for (let key in rep){
            this[key] = rep[key]
            console.log(key, JSON.stringify(rep[key]))
        }
        this.assign(rep.data);
    }
    togglePlayer(){
       // let index = this.players.indexOf(this.currentPlayer);
        this.currentPlayerIndex = (this.currentPlayerIndex+1)%this.players.length;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        
    }
    
    
    assign(newArray) {
    if (!Array.isArray(newArray)) {
      throw new Error("Input must be an array.");
    }
    this.splice(0, this.length, ...newArray); // Replace elements
  }


    reset(){
        this.selectedIndex = null;
        if (this.length){
            this.forEach((row)=>{
                row.forEach((cell, i)=>{
                    row[i] = 0;
                })
            })
            return
        }
        
        let base = this.base;
        let r = base;
        while (r){
            let row = [];
            let c = base;
            r--;
            while(c){
                row.push(0);
                c--;
            }
            this.push(row);
        }
    }
}

function count(seed, board){
    let counter=0;
    board.forEach((row)=>{
        row.forEach((cell)=>{
            if (cell == seed)
            counter++
        })
    })
    return counter;
}


function countOccurrence(arr, element) {
    return arr.reduce((count, current) => current === element ? count + 1 : count, 0);
}

function getAlign(token){
}


function createBoard(board){
    let boardElm = document.createElement("div");
    boardElm.id = "board";
    board.forEach((row, r)=>{
        row.forEach((seed, c)=>{
            let cell = document.createElement("div");
            cell.setAttribute("data-r", r);
            cell.setAttribute("data-c", c);
            cell.classList.add("cell");
            if (seed) cell.innerHTML = `<div class='seed'>${seed}</div>`;
           // cell.style.left = 15 + (c) * ((300)/5) + "px";
           // cell.style.top = 15 + (r) * ((300)/5)  + "px";
            cell.onclick = (e)=>{
                //e.preventDefault(true);
                let row = cell.getAttribute("data-r");
                let col = cell.getAttribute("data-c");
                let neigs = board.getNeighbors(row, col);
                play(row, col, board)
                
                //remotePlay(board)
            }
            boardElm.appendChild(cell)
        });
    });
    
    let selectedIndex = board.selectedIndex;
    let centered = isC(board);
    if (centered){
        
    }
    if (selectedIndex){
        let [r, c] = selectedIndex;
        let cell = boardElm.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
        cell.classList.add("selected");
        let neigs = board.getNeighbors(r, c);
        neigs.forEach((neig)=>{
            let [r, c] = neig;
            let neigCell = boardElm.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
            if (!board[r][c]) {
                let neigCell = boardElm.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
                neigCell.classList.add("highlight");
            }
        })
        
    }
    return boardElm
}




function updateStatus(){
    let statusElm = document.createElement("div");
    statusElm.innerHTML = `${board.currentPlayer.seed} turn<br>`
    board.players.forEach((player, i)=>{statusElm.innerHTML +=`${player.seed} score: ${player.score} <br>`})
    return statusElm;
}

/*function sendToRemote(r, c, board)
.onchange */

function play(r, c, board){
    if  (isC(board)) return 
    
    //alert(board.getEmptyNeighbors(r,c))
    /*
    1. add a seed to a cell at r, c
    then switch player
    if the player seeds on the board are not enough
    and the cell at r, c is empty
    check if thete is a winner and report
    */
    let pSeed = board.currentPlayer.seed;
    let seedOnBoard = count(pSeed, board);
    let cell = board[r][c];
    if (seedOnBoard < board.length){//not enough player's seeds on the board
        if (!cell) { //  cell at r, c is not empty
            board[r][c] = pSeed;
            //neighbohood heuristic of putting
          /*  let liveNeigs = board.getEmptyNeighbors(r, c);
            let pm = liveNeigs.length/((board.base)**2 - 1) ;
            board.currentPlayer.pm +=pm;
            console.log(board.currentPlayer.seed + " : " + board.currentPlayer.pm)
            */
            let won = isC(board);
            if (won) {// there is a winner
                setTimeout(()=>{
                    alert(board.currentPlayer.seed + " Won!");
                    board.players[board.currentPlayerIndex].score +=1;
                    board.reset();
                    board.togglePlayer();
                }, 1000)
                return
            }
            board.togglePlayer();
            return
        }
    }
    
    
    /*
    
    2. select a cell 
    if it contains the player seed
    and the player seeds on the board are enough
    */
    if ((pSeed == board[r][c]) & (count(pSeed, board) == board.length)){
        board.selectedIndex = [r, c];
    }
    
    /*
    
    3. move a selected seed on the board to a cell at r, c
    then switch player
    if there is a selected seed and
    the player is the owner of the selected seed 
    and the cell at r, c is empty
    
    as an update: one of the neighbors of the
    selected rows must be r, c
    */
    let selectedIndex = board.selectedIndex;
    let neigs = board.getNeighbors()
  //  alert(Array.isArray(neigs))
    if (selectedIndex){
        [sRow, sCol] = selectedIndex;
        let neigs = board.getNeighbors(sRow, sCol);
       // alert(neigs)
        //alert([r, c])
        //alert(containsArray(neigs, [r, c]))
        if ((pSeed==board[sRow][sCol]) & (!board[r][c]) & containsArray(neigs, [r, c])){ /*
            seed belongs to this player, cell at r, c is not empty and the cell at r, c is one of the neighbors of cell at sR, sC
            */
            [board[r][c], board[sRow][sCol], board.selectedIndex] = [board[sRow][sCol], 0, null];
            let liveNeigs = board.getEmptyNeighbors(r, c);
            
            //neigborhood heuristic
           /* let pm = (liveNeigs.length-1)/((board.base)**2 - 1) ;
            board.currentPlayer.pm +=pm;
            console.log(board.currentPlayer.seed + " : " + board.currentPlayer.pm)
            */
            let won = isC(board);
            if (won) {
                setTimeout(()=>{
                    alert(board.currentPlayer.seed + " Won!");
                    board.currentPlayer.score++;
                    board.reset();
                    board.togglePlayer();
                }, 1000)
                return;
            }
            board.togglePlayer();
            return;
        }
    }
}

function containsArray(multidimensionalArray, targetArray) {
    return multidimensionalArray.some(
        (subArray) => 
            Array.isArray(subArray) &&
            subArray.length === targetArray.length &&
            subArray.every((value, index) => value == targetArray[index])
    );
}

// Example usage
const multidimensionalArray = [
    [1, 2],
    [4, 5],
    [7, 8],
];

const targetArray1 = [4, 5];
const targetArray2 = [10, 11, 12];

console.log(containsArray(multidimensionalArray, targetArray1)); // true
console.log(containsArray(multidimensionalArray, targetArray2)); // false


function animate() {
  // Update animation state here
    if (board){
        if (boardContainer){
           boardContainer.innerHTML = "";
            boardContainer.appendChild(createBoard(board))
        }
        if (status){
            status.innerHTML = "";
            status.appendChild(updateStatus(board))
        }
    }
  
  // Example: Log a message
// console.log(board[0][0]);

  // Call animate() again for the next frame
  requestAnimationFrame(animate);
}

// Start the animation
//animate();

