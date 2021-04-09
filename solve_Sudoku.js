/*****************************************************************************
***  Methoden um das vorhandene und erkannte Sudoku vollständig zu lösen.  ***
 *****************************************************************************/

/** Hilfsarray um die Funktionen zu testen, solange die Erkennung nicht gut funktioniert*/
let grid = [
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


/** Funktion die kontrolliert, ob an der gegebenen Position im Array die gegebene Zahl möglich ist*/
function number_possible(x, y, number) {
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

