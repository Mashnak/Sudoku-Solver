/*****************************************************************************
 ***  Methoden um das vorhandene und erkannte Sudoku vollständig zu lösen.  ***
 *****************************************************************************/

/** Definition der globalen Variablen */
let numberClassifier; // Variable die das neuronale Netz aus ML5 zwischenspeichert
let img = null;
let img2 = null;
let clearCanvas = false;
let subimg;

let x = 0;
let y = 0;
let video;


let showSquare = false;
let cell_size = 40;

/** Steuervariablen für das UI */
let _startScreen = true; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;
let _uploadScreen = false; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;
let _videoScreen = false; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;
let _imageScreen = false; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;
let _sudokuScreen = false; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;
let _calculatedScreen = false; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;

/** Definition der Arrays die zur Speicherung der verschiedenen Zustände des Sudokus gebraucht werden */
let mouselicksx = [];
let mouselicksy = [];
let numbers = [];
let newArr = [];

/** Definition der benötigten Buttons zur Steuerung der App */
let uploadButton;
let videoButton;
let getImageButton;
let resetButton;
let calculateButton;

/** Definition des gemockten Sudokufeldes, da die Erkennung der Felder nicht 100% funktioniert */
const grid = [
    [5,3,0,0,7,0,0,0,0],
    [0,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
];


/**  */
function preload() {

}


/** */
function setup() {
    if(_startScreen) {
        uploadButton = createButton('Sudoku hochladen');
        uploadButton.position(windowWidth / 2 - 125, windowHeight - 75);
        uploadButton.size(100, 50);
        uploadButton.mousePressed(_uploadScreen=true, _startScreen = false);

        videoButton = createButton('Sudoku aufnehmen');
        videoButton.position(windowWidth / 2 + 125, windowHeight - 75);
        videoButton.size(100, 50);
        videoButton.mousePressed(_videoScreen=true, _startScreen = false);
    }

    if(_uploadScreen) {

    }

    if(_videoScreen) {

    }

    if(_imageScreen) {

    }

    if(_sudokuScreen) {

    }

    if(_calculatedScreen) {

    }
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
    let imgwidth = img2.width / 9;
    let imgheight = img2.height / 9;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            subimg = get(j * imgwidth, i * imgheight, imgwidth, imgheight);
            subimg.resize(28, 28);
            numberClassifier.classify({image: subimg}, gotResults);
        }
    }

    console.log(newArr);
    console.log(getGrid(grid), "Returned Grid");
    numbers = [...getGrid(grid)];
    console.log(numbers, "numbers");
    while (numbers.length && newArr.length<9) newArr.push(numbers.splice(0, 9));
    console.log(newArr, "newArr");
}


function resetVideo() {
    window.location.reload();
}

function draw() {
    if(_startScreen) {

    }

    if(_uploadScreen) {

    }

    if(_videoScreen) {

    }

    if(_imageScreen) {

    }

    if(_sudokuScreen) {

    }

    if(_calculatedScreen) {

    }
}

/*
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
        for (let i = 1; i < 9; i++) {
            line(cell_size * (1 / 2 + i), cell_size / 2, cell_size * (1 / 2 + i), cell_size * (10 - 1 / 2));
            line(cell_size / 2, cell_size * (1 / 2 + i), cell_size * (10 - 1 / 2), cell_size * (1 / 2 + i));
        }
        stroke(45);
        for (let i = 0; i <= 3; i++) {
            line(cell_size * (1 / 2 + i * 3), cell_size / 2, cell_size * (1 / 2 + i * 3), cell_size * (10 - 1 / 2));
            line(cell_size / 2, cell_size * (1 / 2 + i * 3), cell_size * (10 - 1 / 2), cell_size * (1 / 2 + i * 3));
        }
        noStroke();
        textSize(20);

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
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
        img2.resize(400,400);
        image(img2, 20, 400);
    }
}
*/

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
