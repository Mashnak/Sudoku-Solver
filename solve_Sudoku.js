const gameSet = [
    new Uint8Array([0, 0, 1, 5, 0, 0, 0, 7, 0]),
    new Uint8Array([0, 0, 4, 0, 6, 0, 0, 0, 9]),
    new Uint8Array([0, 3, 0, 0, 0, 4, 0, 0, 0]),
    new Uint8Array([6, 2, 0, 0, 0, 5, 1, 0, 0]),
    new Uint8Array([0, 4, 0, 0, 0, 0, 5, 2, 0]),
    new Uint8Array([0, 0, 0, 0, 4, 8, 0, 0, 3]),
    new Uint8Array([4, 1, 0, 0, 7, 0, 0, 0, 0]),
    new Uint8Array([0, 0, 6, 8, 0, 0, 0, 0, 1]),
    new Uint8Array([8, 0, 0, 0, 0, 9, 0, 3, 0])
]

process.nextTick(() => {
    const sudoku = new Sudoku({ squareRegion: 3 })
    sudoku.play(gameSet)
    console.log(sudoku.printable())
})

function Sudoku (opts = {}) {
    // TODO improve to support different sudoku types
    this.region = opts.squareRegion || 3 // default classic
}

Sudoku.prototype.play = function (gameSet) {
    const allCells = buildCellStructure(gameSet, this.region)

    this.valueSet = Array(gameSet[0].length).fill(0).map((_, i) => (i + 1))

    // to reduce the calculation, we can just ignore the default game cells
    const cells = allCells.filter(c => c.init === 0)
    let iter = 0
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        iter++
        if (!solveCell.call(this, cell)) {
            cell.history.clear() // out tries are invalid

            let backTrack = i - 1
            for (; backTrack >= 0; backTrack--) {
                if (assignValue.call(this, cells[backTrack], 0)) {
                    break
                }
            }
            i = backTrack - 1
        }
    }

    this.lastGame = gameSet
    this.lastResult = allCells.map(_ => _.value)

    console.log(iter)
    return this.lastResult
}

function solveCell (cell) {
    const chooseNewValue = chooseValue.call(this, cell)
    if (chooseNewValue === 0) {
        return false
    }
    assignValue.call(this, cell, chooseNewValue)
    return true
}

function assignValue (cell, value) {
    cell.rows[cell.x] = value
    cell.columns[cell.y] = value
    cell.square[(cell.x % this.region) + ((cell.y % this.region) * this.region)] = value
    cell.value = value

    if (value > 0) {
        cell.history.add(value)
    }
    return true
}

Sudoku.prototype.printable = function (result) {
    const print = result || this.lastResult
    if (!print) {
        // nothing to print
        return
    }

    return print.flatMap((val, i) => {
        if ((i + 1) % this.region === 0) {
            if ((i + 1) % (this.region ** 2) === 0) {
                if ((i + 1) % (this.region ** 3) === 0) {
                    return [val, '|', '\n', '-'.repeat(this.region ** 2), '--|\n']
                } else {
                    return [val, '|', '\n']
                }
            } else {
                return [val, '|']
            }
        }
        return val
    }).join('')
}

function chooseValue (cell) {
    const values = this.valueSet
        .filter(_ => !cell.rows.includes(_))
        .filter(_ => !cell.columns.includes(_))
        .filter(_ => !cell.square.includes(_))
        .filter(_ => !cell.history.has(_))
    if (values.length === 0) {
        return 0
    }
    // stochastic hope
    return values[Math.floor(Math.random() * values.length)]
}

// this structure point always to the same arrays
function buildCellStructure (gameSet, squareLength) {
    const cells = []

    const columnMap = new Map()
    const squareMap = new Map()

    gameSet.forEach((row, y) => {
        row.forEach((cellValue, x) => {
            if (!columnMap.has(x)) {
                columnMap.set(x, [])
            }
            columnMap.get(x).push(cellValue)

            const squareId = `${Math.floor(x / squareLength)}-${Math.floor(y / squareLength)}`
            if (!squareMap.has(squareId)) {
                squareMap.set(squareId, [])
            }
            squareMap.get(squareId).push(cellValue)

            cells.push({
                x,
                y,
                value: cellValue,
                init: cellValue,
                rows: row,
                columns: columnMap.get(x),
                squareId,
                square: squareMap.get(squareId),
                history: new Set(),
                iter: 0
            })
        })
    })

    return cells
}
