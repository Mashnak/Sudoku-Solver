getGrid = (grid) => {
    let newArr = [];
    for (let i = 0; i < solve(grid).length; i++) {
        newArr = newArr.concat(solve(grid)[i]);
    }
    return newArr;
}

nextEmptySpot = (board) => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0)
                return [i, j];
        }
    }
    return [-1, -1];
}


checkRow = (board, row, value) => {
    for(let i = 0; i < board[row].length; i++) {
        if(board[row][i] === value) {
            return false;
        }
    }
    return true;
}


const checkColumn = (board, column, value) => {
    for(let i = 0; i < board.length; i++) {
        if(board[i][column] === value) {
            return false;
        }
    }
    return true;
};
const checkSquare = (board, row, column, value) => {
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++){
        for (let c = 0; c < 3; c++){
            if (board[boxRow + r][boxCol + c] === value)
                return false;
        }
    }
    return true;
}
counting_method = (board, row, column, value) => {
    return checkRow(board, row, value) &&
        checkColumn(board, column, value) &&
        checkSquare(board, row, column, value);
}
function solve(board) {
    let emptySpot = nextEmptySpot(board);
    let row = emptySpot[0];
    let col = emptySpot[1];
    if (row === -1){
        return board;
    }
    for(let num = 1; num<=9; num++){
        if (counting_method(board, row, col, num)){
            board[row][col] = num;
            solve(board);
        }
    }
    if (nextEmptySpot(board)[0] !== -1)
        board[row][col] = 0;
    return board;
}
