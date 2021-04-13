/*****************************************************************************
 ***  Methoden um das vorhandene und erkannte Sudoku vollständig zu lösen.  ***
 *****************************************************************************/

/**
 * Definition der globalen Variablen
 */
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

/**
 * Steuervariablen für das UI
 */
let _startScreen = true; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;
let _uploadScreen = false; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;
let _videoScreen = false; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;
let _imageScreen = false; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;
let _sudokuScreen = false; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;
let _calculatedScreen = false; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen;

/**
 * Definition der Arrays die zur Speicherung der verschiedenen Zustände des Sudokus gebraucht werden
 */
let mouselicksx = [];
let mouselicksy = [];
let numbers = [];
let newArr = [];

/**
 * Definition der benötigten Buttons zur Steuerung der App
 */
let uploadButton;
let videoButton;
let uploadImageButton;
let getImageButton;
let cropImgButton;
let resetButton;
let calculateButton;

/**
 * Definition des gemockten Sudokufeldes, da die Erkennung der Felder nicht 100% funktioniert
 */
const grid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [0, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];


/**
 *
 */
function preload() {
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
}

/**
 *
 */
function uploadScreen() {
    console.log("UploadScreen");
    _startScreen = false;
    _uploadScreen = true;
    _videoScreen = false;
    _imageScreen = false;
    _sudokuScreen = false;
    _calculatedScreen = false;
    /***********************/
    video.hide();
    uploadButton.hide();
    videoButton.hide();
    uploadImageButton.show();
    getImageButton.hide();
    cropImgButton.hide();
    calculateButton.hide();
    resetButton.show();
    /***********************/
    img = loadImage("Sudoku.jpg");
    img2 = img;
}

/**
 *
 */
function videoScreen() {
    console.log("VideoScreen");
    _startScreen = false;
    _uploadScreen = false;
    _videoScreen = true;
    _imageScreen = false;
    _sudokuScreen = false;
    _calculatedScreen = false;
    /***********************/
    video.show();
    uploadButton.hide();
    videoButton.hide();
    uploadImageButton.hide();
    getImageButton.show();
    cropImgButton.hide();
    calculateButton.hide();
    resetButton.show();
}

/**
 *
 */
function uploadImageScreen() {
    console.log("UploadImageScreen");
    _startScreen = false;
    _uploadScreen = true;
    _videoScreen = false;
    _imageScreen = false;
    _sudokuScreen = false;
    _calculatedScreen = false;
    /***********************/
    video.hide();
    uploadButton.hide();
    videoButton.hide();
    uploadImageButton.hide();
    getImageButton.hide();
    cropImgButton.hide();
    calculateButton.show();
    resetButton.show();
    /***********************/

}

/**
 *
 */
function imageScreen() {
    console.log("ImageScreen");
    _startScreen = false;
    _uploadScreen = false;
    _videoScreen = false;
    _imageScreen = true;
    _sudokuScreen = false;
    _calculatedScreen = false;
    /***********************/
    uploadButton.hide();
    videoButton.hide();
    uploadImageButton.hide();
    getImageButton.hide();
    cropImgButton.show();
    calculateButton.hide();
    resetButton.show();
    /***********************/
    clearCanvas = false;
    img = video.get(0, 0, video.width, video.height);
    video.stop();
    video.hide();
    mouselicksx = [];
    mouselicksy = [];
    showSquare = true;
}

/**
 *
 */
function sudokuScreen() {
    if (img != null) {
        if(mouselicksx.length>=3) {
            img2 = img.get(mouselicksx[1], mouselicksy[1], mouselicksx[2] - mouselicksx[1], mouselicksy[2] - mouselicksy[1]);
        } else {
            img2 = img;
        }
    }
    console.log("SudokuScreen");
    _startScreen = false;
    _uploadScreen = false;
    _videoScreen = false;
    _imageScreen = false;
    _sudokuScreen = true;
    _calculatedScreen = false;
    /***********************/
    uploadButton.hide();
    videoButton.hide();
    uploadImageButton.hide();
    getImageButton.hide();
    cropImgButton.hide();
    calculateButton.show();
    resetButton.show();
    /***********************/
}

/**
 *
 */
function calculatedScreen() {
    console.log("CalculatedScreen");
    _startScreen = false;
    _uploadScreen = false;
    _videoScreen = false;
    _imageScreen = false;
    _sudokuScreen = false;
    _calculatedScreen = true;
    /***********************/
    uploadButton.hide();
    videoButton.hide();
    uploadImageButton.hide();
    getImageButton.hide();
    cropImgButton.hide();
    calculateButton.hide();
    resetButton.show();
    /***********************/
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

    numbers = [...getGrid(grid)];
    while (numbers.length && newArr.length < 9) newArr.push(numbers.splice(0, 9));
}
function resetVideo() {
    window.location.reload();
}

/**
 *
 * */
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight - 100);
    background(255);
    /** Erstellen der Buttons zur Steuerung durch die App*/
    uploadButton = createButton('Sudoku hochladen');
    uploadButton.position(20, windowHeight - 150);
    uploadButton.size(160, 50);
    uploadButton.mousePressed(uploadScreen);
    videoButton = createButton('Sudoku aufnehmen');
    videoButton.position(windowWidth-180, windowHeight - 150);
    videoButton.size(160, 50);
    videoButton.mousePressed(videoScreen);
    uploadImageButton = createButton('Foto hochladen');
    uploadImageButton.position(windowWidth-180, windowHeight - 150);
    uploadImageButton.size(160,50);
    uploadImageButton.mousePressed(uploadImageScreen);
    uploadImageButton.hide();
    getImageButton = createButton('Foto aufnehmen');
    getImageButton.position(windowWidth-180, windowHeight - 150);
    getImageButton.size(160, 50);
    getImageButton.mousePressed(imageScreen);
    getImageButton.hide();
    cropImgButton = createButton('Sudoku zuschneiden');
    cropImgButton.position(windowWidth-180, windowHeight - 150);
    cropImgButton.size(160, 50);
    cropImgButton.mousePressed(sudokuScreen);
    cropImgButton.hide();
    resetButton = createButton('Reset');
    resetButton.position(20, windowHeight - 150);
    resetButton.size(160, 50);
    resetButton.mousePressed(resetVideo);
    resetButton.hide();
    calculateButton = createButton('Sudoku berechnen!');
    calculateButton.position(windowWidth-180, windowHeight - 150);
    calculateButton.size(160, 50);
    calculateButton.mousePressed(calculatedScreen);
    calculateButton.hide();
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
    video.hide();
}

/**
 *
 */
function mousePressed() {
    mouselicksx.push(mouseX);
    mouselicksy.push(mouseY);
}

/**
 *
 */
function draw() {
    if (_startScreen) {

    }

    if (_uploadScreen) {
        clear();
    }

    if (_videoScreen) {
        clear();
    }

    if (_imageScreen) {
        clear();
        textSize(5);
        strokeWeight(1);
        stroke(0, 0, 0);
        text('Bitte linke obere und rechte untere Ecke des Sudokufelds anklicken!', 10, 30);
        image(img, 0, 50);
        if (showSquare) {
            strokeWeight(1);
            noFill();
            stroke(255, 0, 0);
            rect(mouselicksx[1], mouselicksy[1], mouselicksx[2] - mouselicksx[1], mouselicksy[2] - mouselicksy[1]);
        }

    }

    if (_sudokuScreen) {
        clear();
        img = null;
        image(img2, 0, 0);
    }

    if (_calculatedScreen) {
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
    }
}



/**
 * Funktion zur Bestimmung des aktuellen Gerätes
 */
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
    if (confidence >= 50) {
        numbers[x] = int(label);
    } else {
        numbers[x] = 0;
    }
    x++;
}
