/*****************************************************************************
***  Methoden um das vorhandene und erkannte Sudoku vollständig zu lösen.  ***
 *****************************************************************************/
//solve_Sudoku_BF();

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


/** Hilfsfunktion die kontrolliert, ob an der gegebenen Position im Array die gegebene Zahl möglich ist
 *
 * @param {number} y
 * @param {number} x
 * @param {number} number
 * */
const number_possible = (y, x, number) => {
    console.log(y,x,number);
    for (let i = 0; i < 9; i++) {
        if (grid[y][i] === number) {
            console.log("False1");
            return false;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (grid[i][x] === number) {
            console.log("False2");
            return false;
        }
    }
    let xx = Math.floor(x)*3;
    let yy = Math.floor(y)*3;
    console.log(xx,yy);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[yy+i][xx+j] === number) {
                console.log("False3");
                return false;
            }
        }
    }
    console.log("True");
    return true;
};


/** Funktion die das Sudoku Brute force löst
 *
 * */
const solve_Sudoku_BF = () => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++)  {
            if (grid[i][j] === 0) {
                for (let n = 1; n < 10; n++) {
                    if (number_possible(i,j,n)) {
                        grid[i][j] = n
                        solve_Sudoku_BF();
                        grid[i][j] = 0;
                    }
                }
                return;
            }
        }
    }
    console.log(grid);
};
solve_Sudoku_BF();


function modelLoaded() {
    console.log('Model loaded!');
}
