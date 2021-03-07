/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

var WIDTH = 7;
var HEIGHT = 6;

var currPlayer = 1; // active player: 1 or 2
var board = []; // array of rows, each row is array of cells  (board[y][x])

var gameOver = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array

  board = new Array(WIDTH);

  for(let i = 0; i < board.length; i++){
    board[i] = new Array(HEIGHT);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");

  // create the top column element and gives it a click event listener
  var top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // creates a head cell for the top of each colum
  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // creates all the remaining cells under the top row
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  const thisCol = board[x];

  for(let i = 0; i < thisCol.length; i++){
    if(thisCol[i] !== undefined){
      return i - 1;
    }
  }

  return thisCol.length;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const newPiece = document.createElement("div");
  newPiece.className = `piecePlayer${currPlayer}`;
  const insertCell = document.getElementById(`${y - 1}-${x}`);

  insertCell.append(newPiece);

}

/** endGame: announce game end */

function endGame(msg) {
  const newMessage = document.createElement('div');
  newMessage.innerText = msg;
  document.querySelector('#game').prepend(newMessage);
  gameOver = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {

  if(!gameOver){
    // get x from ID of clicked cell
    var x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    var y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    // update in-memory board
    board[x][y] = currPlayer;

    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
      console.log(`Player ${currPlayer} won!`);
      return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame

    // switch players
    if(currPlayer === 1){
      currPlayer = 2;
    }
    else{
      currPlayer = 1;
    }
  }
  
  
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y <= HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // For each cell, checks the 4 horizonal vertical and diagnel cells around it for matches

  for (var y = 0; y <= HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {

      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
