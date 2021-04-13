let numbers = [];
let x = 0;
const grid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function getDigits(img) {
    let imgwidth = img.width / 9;
    let imgheight = img.height / 9;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let subimg = img.get(j * imgwidth, i * imgheight, imgwidth, imgheight);
            subimg.resize(28, 28);
            numberClassifier.classify({image: subimg}, gotResults);
        }
    }
    if (numbers.length === 81) {
        console.log(numbers, "nbumbers");
        return numbers;
    }
    console.log(numbers, "numebrs");
    let newArr = [];
    for (let i = 0; i < grid.length; i++) {
        newArr = newArr.concat(grid[i]);
    }
    return newArr;
}


/**
 *
 * @param err
 * @param results
 */
function gotResults(err, results) {
    if (err) {
        console.error(err);
        return;
    }
    let label = results[0].label;
    let confidence = nf(100 * results[0].confidence, 2, 0);
    console.log(label, confidence);
    if (confidence >= 80) {
        numbers[x]=(int(label));
    } else {
        numbers[x]=0;
    }
    x++;
}
