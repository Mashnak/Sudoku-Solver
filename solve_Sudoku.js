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
function number_possible(x, y, number){
    console.log(grid);
}
