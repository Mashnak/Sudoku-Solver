let numbers = [];
let numberClassifier; // Variable die das neuronale Netz aus ML5 zwischenspeichert
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

    let options = {
        inputs: [28, 28, 4],
        task: 'imageClassification',
    }
    numberClassifier = ml5.neuralNetwork(options);
    const modelDetails = {
        model: 'model/model.json',
        metadata: 'model/model_meta.json',
        weights: 'model/model.weights.bin'
    }
    numberClassifier.load(modelDetails, modelLoaded);
    let imgwidth = img.width / 9;
    let imgheight = img.height / 9;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let subimg = img.get(j * imgwidth, i * imgheight, imgwidth, imgheight);
            subimg.resize(28, 28);
            console.log(numberClassifier);
            numberClassifier.classify({image: subimg}, gotResults);
        }
    }
    if (numbers.length===81) {
        console.log(numbers,"nbumbers");
        return numbers;
    }
    console.log(numbers, "numebrs");
    let newArr = [];
    for(let i = 0; i < grid.length; i++)
    {
        newArr = newArr.concat(grid[i]);
    }
    return newArr;
}


/**
 * Callback Funktionen für die Rückmeldungen der verschiedenen Funktionen
 */
function modelLoaded() {
    console.log('Model loaded!');
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
    if (confidence >= 50) {
        numbers.push(int(label));
    } else {
        numbers.push(0);
    }
}
