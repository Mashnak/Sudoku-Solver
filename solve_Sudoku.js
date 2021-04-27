function getGrid(grid) {
    let newArr = [];
    for (let i = 0; i < solve(grid).length; i++) {
        newArr = newArr.concat(solve(grid)[i]);
    }
    return newArr;
}

function nextEmptySpot(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] === 0)
                return [i, j];
        }
    }
    return [-1, -1];
}


function checkRow(board, row, value){
    for(var i = 0; i < board[row].length; i++) {
        if(board[row][i] === value) {
            return false;
        }
    }

    return true;
}


function checkColumn(board, column, value){
    for(var i = 0; i < board.length; i++) {
        if(board[i][column] === value) {
            return false;
        }
    }

    return true;
}
function checkSquare(board, row, column, value){
    boxRow = Math.floor(row / 3) * 3;
    boxCol = Math.floor(column / 3) * 3;

    for (var r = 0; r < 3; r++){
        for (var c = 0; c < 3; c++){
            if (board[boxRow + r][boxCol + c] === value)
                return false;
        }
    }

    return true;
}
function checkValue(board, row, column, value) {
    return checkRow(board, row, value) &&
        checkColumn(board, column, value) &&
        checkSquare(board, row, column, value);


}
function solve(board) {
    console.log(board)
    let emptySpot = nextEmptySpot(board);
    let row = emptySpot[0];
    let col = emptySpot[1];

    // there is no more empty spots
    if (row === -1){
        return board;
    }

    for(let num = 1; num<=9; num++){
        if (checkValue(board, row, col, num)){
            board[row][col] = num;
            solve(board);
        }
    }

    if (nextEmptySpot(board)[0] !== -1)
        board[row][col] = 0;

    return board;
}
