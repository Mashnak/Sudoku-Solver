var square_coordinates = [
    [1, 1, 1, 2, 2, 2, 3, 3, 3],
    [1, 1, 1, 2, 2, 2, 3, 3, 3],
    [1, 1, 1, 2, 2, 2, 3, 3, 3],
    [4, 4, 4, 5, 5, 5, 6, 6, 6],
    [4, 4, 4, 5, 5, 5, 6, 6, 6],
    [4, 4, 4, 5, 5, 5, 6, 6, 6],
    [7, 7, 7, 8, 8, 8, 9, 9, 9],
    [7, 7, 7, 8, 8, 8, 9, 9, 9],
    [7, 7, 7, 8, 8, 8, 9, 9, 9]
]


function getGrid(grid) {
    let newArr = [];
    for (let i = 0; i < solve_sudoku(grid).length; i++) {
        newArr = newArr.concat(solve_sudoku(grid)[i]);
    }
    return newArr;
}

function get_row(grid, row) {
    return grid[row]
}

function get_column(grid, column) {
    var col = []
    for (let row = 0; row < 9; row++) {
        col.push(grid[row][column]);
    }
    return col
}

function get_square(grid, square) {
    let cells = []
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (square === square_coordinates[r][c]) {
                cells.push(grid[r][c])
            }
        }
    }
    return cells
}

function counting_method(grid, r, c) {
    let used = [...get_row(grid, r), ...get_column(grid, c), ...get_square(grid, square_coordinates[r][c])]
    let possibilities = []
    for (let p = 1; p <= 9; p++) {
        if (!used.includes(p)) {
            possibilities.push(p)
        }
    }
    if (possibilities.length === 1) {
        grid[r][c] = possibilities[0]
        return true
    } else {
        grid[r][c] = possibilities
        return false
    }
}

function cross_hatching(grid, possibilities, segment, r, c) {
    let updated = false
    for (i = 0; i < possibilities.length; i++) {
        let possibility = possibilities[i]
        let counter = 0
        segment.forEach(cell => {
            if (Array.isArray(cell)) {
                if (cell.includes(possibility)) {
                    counter++
                }
            } else {
                if (cell === possibility) {
                    counter++
                }
            }
        })
        if (counter === 1) {
            grid[r][c] = possibility
            updated = true
            break
        }
    }
    return updated
}

function compare(expected, actual) {
    let array1 = expected.slice()
    let array2 = actual.slice()
    return array1.length === array2.length && array1.sort().every(function (value, index) {
        return value === array2.sort()[index]
    });
}

function is_solved(grid) {
    let expected = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let valid = true
    for (r = 0; r < 9 && valid === true; r++) {
        if (!compare(expected, get_row(grid, r))) {
            valid = false
        }
    }
    for (c = 0; c < 9 && valid === true; c++) {
        if (!compare(expected, get_column(grid, c))) {
            valid = false
        }
    }
    for (q = 1; q < 9 && valid === true; q++) {
        if (!compare(expected, get_square(grid, q))) {
            valid = false
        }
    }
    return valid
}

function solve_backtracking(orig_grid) {
    let grid = JSON.parse(JSON.stringify(orig_grid));
    let completed_grid;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] === 0) {
                counting_method(grid, r, c)
                if (is_solved(grid)) return grid;
                let cell = grid[r][c]
                if (Array.isArray(cell)) {
                    for (let i = 0; i < cell.length; i++) {
                        let grid_2 = JSON.parse(JSON.stringify(grid));
                        grid_2[r][c] = cell[i]
                        if (completed_grid = solve_backtracking(grid_2)) {
                            return completed_grid;
                        }
                    }
                    return false // dead end
                }
            }
        }
    }

    return false;

}

function naked_single(grid) {
    updated = false
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] === 0) {
                updated = counting_method(grid, r, c) || updated
            }
        }
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (Array.isArray(grid[r][c])) {
                let possibilities = grid[r][c]
                updated = cross_hatching(grid, possibilities, get_row(grid, r), r, c) ||
                    cross_hatching(grid, possibilities, get_column(grid, c), r, c) ||
                    cross_hatching(grid, possibilities, get_square(grid, square_coordinates[r][c]), r, c) || updated
            }
        }
    }
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (Array.isArray(grid[r][c])) {
                grid[r][c] = 0
            }
        }
    }
    return updated
}

function solve_sudoku(grid) {
    let updated = true, solved = false
    while (updated && !solved) {
        updated = naked_single(grid)
        solved = is_solved(grid)
    }
    if (!solved) {
        grid = solve_backtracking(grid)
        solved = is_solved(grid)
    }

    return grid
}





