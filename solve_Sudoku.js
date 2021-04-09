/*****************************************************************************
***  Methoden um das vorhandene und erkannte Sudoku vollständig zu lösen.  ***
 *****************************************************************************/
solve_Sudoku_BF();
console.log("test");
/** Hilfsarray um die Funktionen zu testen, solange die Erkennung nicht gut funktioniert*/
var grid = [
    [1,0,0,9,0,0,6,5,0],
    [0,9,0,2,0,0,3,0,0],
    [0,0,7,1,3,0,0,4,0],
    [0,0,0,0,0,6,0,0,0],
    [9,0,8,0,7,0,0,0,0],
    [7,0,0,0,0,0,8,0,0],
    [3,0,0,0,0,0,0,0,0],
    [0,8,1,5,0,0,0,0,9],
    [0,5,0,0,0,2,0,0,0]
];


/** Hilfsfunktion die kontrolliert, ob an der gegebenen Position im Array die gegebene Zahl möglich ist*/
function number_possible(y, x, number) {
    for (let i = 0; i < 9; i++) {
        if (grid[y][i] === number) {
            return false;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (grid[i][x] === number) {
            return false;
        }
    }
    let x0 = Math.floor(x)*3;
    let y0 = Math.floor(y)*3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; i++) {
            if (grid[y0+i][x0+j] === number) {
                return false;
            }
        }
    }
    return true;
}


/** Funktion die das Sudoku Brute force löst */
function solve_Sudoku_BF() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++)  {
            if (grid[j][i] === 0) {
                for (let n = 1; n < 10; n++) {
                    if (number_possible(j,i,n)) {
                        grid[j][i] = n
                        solve_Sudoku_BF();
                        grid[j][i] = 0;
                    }
                }
                return;
            }
        }
    }
    console.log(grid);
}
