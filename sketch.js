/*****************************************************************************
 ***  Methoden um das vorhandene und erkannte Sudoku vollständig zu lösen.  ***
 *****************************************************************************/

/** Definition der globalen Variablen */
let numberClassifier; // Variable die das neuronale Netz aus ML5 zwischenspeichert
let img = null;
let img2 = null;
let clearCanvas = false;
let subimg;
let resultsDiv;
const numbers = [];
let newArr;
let x = 0;
let y = 0;
let video;
let getImageButton;
let resetButton;
let calculateButton;
let mouselicksx = [];
let mouselicksy = [];
let showSquare = false;
let cell_size = 40;


/**  */
function preload() {

}


/** */
function setup() {
    canvas = createCanvas(windowWidth, windowHeight - 100);
    background(255);
    if (getDeviceType() === 'mobile' || getDeviceType() === 'tablet') {
        video =
            createCapture({
                audio: false,
                video: {
                    facingMode: {
                        exact: "environment"
                    }
                }
            });
    } else {
        video = createCapture(VIDEO);
    }
    video.position(0, 0);
    getImageButton = createButton('Foto');
    getImageButton.position(windowWidth / 2 - 25, windowHeight - 75);
    getImageButton.size(50, 50);
    getImageButton.mousePressed(getImage);
    resetButton = createButton('Neues Foto aufnehmen!');
    resetButton.position(windowWidth / 2 - 80, windowHeight - 150);
    resetButton.size(160, 50);
    resetButton.mousePressed(resetVideo);
    resetButton.hide();
    calculateButton = createButton('Sudoku berechnen!');
    calculateButton.position(windowWidth / 2 - 80, windowHeight - 100);
    calculateButton.size(160, 50);
    calculateButton.mousePressed(calculateSudoku);
    calculateButton.hide();
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
    resultsDiv = createDiv("Model loaded!");
}


function getImage() {
    clearCanvas = false;
    img = video.get(0, 0, video.width, video.height);
    video.stop();
    video.hide();
    getImageButton.hide();
    resetButton.show();
    calculateButton.show();
    mouselicksx = [];
    mouselicksy = [];
    showSquare = true;
}

function mousePressed() {
    mouselicksx.push(mouseX);
    mouselicksy.push(mouseY);
    //console.log(mouselicksx,mouselicksy);
}

function calculateSudoku() {
    if (img != null) {
        //img2 = img.get(mouselicksx[1], mouselicksy[1], mouselicksx[2] - mouselicksx[1], mouselicksy[2] - mouselicksy[1]);
        img2 = loadImage("Sudoku.jpg");

    }
    y++;
    showSquare = false;
    //img2 = img.get(mouselicksx[1],mouselicksy[1],mouselicksx[2]-mouselicksx[1],mouselicksy[2]-mouselicksy[1]);
    //console.log(img.width, img.height);
    img2.resize(252, 252);
    console.log(img2.width, img2.height);
    //clearCanvas = true;
    imgwidth = img2.width / 9;
    imgheight = img2.height / 9;
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            subimg = get(j * imgwidth, i * imgheight, imgwidth, imgheight);
            subimg.resize(28, 28);
            numberClassifier.classify({image: subimg}, gotResults);
        }
    }
    newArr = getGrid();
    // while (numbers.length) newArr.push(numbers.splice(0, 9));
    resultsDiv.html(newArr.splice(0, 9));
    console.log(newArr);
}


function resetVideo() {
    window.location.reload();
}

function draw() {
    if (y > 0 && y <= 1) {
        calculateSudoku();
    }
    if (img != null) {
        textSize(5);
        strokeWeight(1);
        stroke(0, 0, 0);
        text('Bitte linke obere und rechte untere Ecke des Sudokufelds anklicken!', 10, 30);
        image(img, 0, 50);
    }
    if (img2 != null) {
        clear();
        img = null;
        image(img2, 0, 0);
    }
    if (clearCanvas) {
        clear();
    }
    if (showSquare) {
        strokeWeight(1);
        noFill();
        stroke(255, 0, 0);
        rect(mouselicksx[1], mouselicksy[1], mouselicksx[2] - mouselicksx[1], mouselicksy[2] - mouselicksy[1]);
    }
    if (newArr.length === 9) {
        clear();
        stroke(245);
        strokeWeight(1);
        for (i = 1; i < 9; i++) {
            line(cell_size * (1 / 2 + i), cell_size / 2, cell_size * (1 / 2 + i), cell_size * (10 - 1 / 2));
            line(cell_size / 2, cell_size * (1 / 2 + i), cell_size * (10 - 1 / 2), cell_size * (1 / 2 + i));
        }
        stroke(45);
        for (i = 0; i <= 3; i++) {
            line(cell_size * (1 / 2 + i * 3), cell_size / 2, cell_size * (1 / 2 + i * 3), cell_size * (10 - 1 / 2));
            line(cell_size / 2, cell_size * (1 / 2 + i * 3), cell_size * (10 - 1 / 2), cell_size * (1 / 2 + i * 3));
        }
        noStroke();
        textSize(20);

        for (i = 0; i < 9; i++) {
            for (j = 0; j < 9; j++) {
                if (newArr[i][j] !== 0) {
                    stroke("black");
                    fill("black");
                    text(newArr[i][j], cell_size * (j + 1), cell_size * (i + 1) + 6);
                } else if (newArr[i][j] > 0) {
                    stroke("green");
                    fill("green");
                    text(newArr[i][j], cell_size * (j + 1), cell_size * (i + 1) + 6);
                } else if (newArr[i][j] === 0) {
                    stroke("green");
                    fill("green");
                    text(newArr[i][j], cell_size * (j + 1), cell_size * (i + 1) + 6);
                } else {
                    stroke("orange");
                    fill("orange");
                    text(newArr[i][j], cell_size * (j + 1) - 12, cell_size * (i + 1) + (j % 3 - 1) * 12 + 6);
                }
            }
        }
        image(img2, 400, 20);
    }
}

/** Funktion zur Bestimmung des aktuellen Gerätes */
const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        return "mobile";
    }
    return "desktop";
};


/** Callback Funktionen für die Rückmeldungen der verschiedenen Funktionen */
function modelLoaded() {
    console.log('Model loaded!');
}

function gotResults(err, results) {
    if (err) {
        console.error(err);
        return;
    }
    let label = results[0].label;
    let confidence = nf(100 * results[0].confidence, 2, 0);
    if (confidence >= 50) {
        numbers[x] = int(label);
    } else {
        numbers[x] = 0;
    }
    x++;
}
