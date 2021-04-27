getGrid = (grid) => {
    let newArr = [];
    for (let i = 0; i < solve(grid).length; i++) {
        newArr = newArr.concat(solve(grid)[i]);
    }
    return newArr;
}

nextEmptySpot = (grid) => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0)
                return [i, j];
        }
    }
    return [-1, -1];
}


checkRow = (grid, row, value) => {
    for(let i = 0; i < grid[row].length; i++) {
        if(grid[row][i] === value) {
            return false;
        }
    }
    return true;
}


const checkColumn = (grid, column, value) => {
    for(let i = 0; i < grid.length; i++) {
        if(grid[i][column] === value) {
            return false;
        }
    }
    return true;
};
const checkSquare = (grid, row, column, value) => {
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++){
        for (let c = 0; c < 3; c++){
            if (grid[boxRow + r][boxCol + c] === value)
                return false;
        }
    }
    return true;
}
counting_method = (grid, row, column, value) => {
    return checkRow(grid, row, value) &&
        checkColumn(grid, column, value) &&
        checkSquare(grid, row, column, value);
}
function solve(grid) {
    let emptySpot = nextEmptySpot(grid);
    let row = emptySpot[0];
    let col = emptySpot[1];
    if (row === -1){
        return grid;
    }
    for(let num = 1; num<=9; num++){
        if (counting_method(grid, row, col, num)){
            grid[row][col] = num;
            solve(grid);
        }
    }
    if (nextEmptySpot(grid)[0] !== -1)
        grid[row][col] = 0;
    return grid;
}
