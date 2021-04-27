/*****************************************************************************
 *** Methoden und Variablen die die allgemeine Steuerung der App übernehmen ***
 *****************************************************************************/

/**
 * Definition der globalen Variablen
 */
let numberClassifier; // Variable die das neuronale Netz aus ML5 zwischenspeichert
let img = null; // Variable die ein Bild zwischenspeichert
let img2 = null; // Variable die ein Bild zwischenspeichert
let logo; // Variable die das Logo zwischenspeichert
let video; // Variable die das Videosignal speichert
let showSquare = false; // Variable die check ob das rote Quadrat gezeichnet werden soll
const cell_size = 36; // Variable die die Breite und Höhe der gezeichneten Sudokufelder festlegt
let is_desktop; // Variable die prüft welcher Typ das Gerät ist
let got_solution=false; // Variable die prüft ob die erhaltene Ziffererkennung valide ist

/**
 * Steuervariablen für das UI
 */
let _startScreen = true; // Screen um die Auswahl ob Upload oder über Kamera aufnehmen anzuzeigen
let _uploadScreen = false; // Screen zum Upload eines Sudoku Bildes
let _videoScreen = false; // Screen der das Videosignal darstellt
let _uploadImageScreen = false; // Screen der das erkannte hochgeladene Bild darstellt
let _imageScreen = false; // Screen der das Bild aus dem Videosingal darstellt
let _sudokuScreen = false; // Screen der das zugeschnittene Bild darstellt
let _calculatedScreen = false; // Screen der das gelöste Sudoku darstellt

/**
 * Definition der Arrays die zur Speicherung der verschiedenen Zustände des Sudokus gebraucht werden
 */
let mouselicksx = []; // Variable die das neuronale Netz aus ML5 zwischenspeichert
let mouselicksy = []; // Variable die das neuronale Netz aus ML5 zwischenspeichert
let numbers2d = []; // Variable die das neuronale Netz aus ML5 zwischenspeichert
let final1d = []; // Variable die das neuronale Netz aus ML5 zwischenspeichert
let final2d = []; // Variable die das neuronale Netz aus ML5 zwischenspeichert

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
 * Lädt das vorher trainierte Modell zur Ziffernerkennung
 */
async function preload() {
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

    is_desktop = getDeviceType();
}

function modelLoaded() {
    console.log('Model loaded!');
}

function uploadScreen() {
    console.log("UploadScreen");
    _startScreen = false;
    _uploadScreen = true;
    _videoScreen = false;
    _uploadImageScreen = false;
    _imageScreen = false;
    _sudokuScreen = false;
    _calculatedScreen = false;
    /***********************/
    uploadButton.hide();
    videoButton.hide();
    uploadImageButton.show();
    getImageButton.hide();
    cropImgButton.hide();
    calculateButton.hide();
    resetButton.show();
    /***********************/
    img = loadImage("Images/Sudoku.jpg");
    img2 = img;
}

function videoScreen() {
    window.alert("Sudoku am oberen Kamerabild einpassen, das Sudoku wird automatisch zugeschnitten");
    console.log("VideoScreen");
    if (is_desktop) {
        video = createCapture(VIDEO);

    } else {
        video =
            createCapture({
                audio: false,
                video: {
                    facingMode: {
                        exact: "environment"
                    }
                }
            });
    }

    if (is_desktop) {
        video.position(windowWidth / 2 - video.width, 0);
    } else {
        video.position(0, 0);
        video.size(windowWidth, windowWidth + 100);
    }
    _startScreen = false;
    _uploadScreen = false;
    _videoScreen = true;
    _uploadImageScreen = false;
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

async function uploadImageScreen() {
    console.log("UploadImageScreen");
    _startScreen = false;
    _uploadScreen = false;
    _videoScreen = false;
    _uploadImageScreen = true;
    _imageScreen = false;
    _sudokuScreen = false;
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
    numbers2d = await getDigits(img2);
    console.log(numbers2d);
    got_solution = true;
}

function imageScreen() {
    console.log("ImageScreen");
    _startScreen = false;
    _uploadScreen = false;
    _videoScreen = false;
    _uploadImageScreen = false;
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
    img = video.get(0, 0, video.width, video.height);
    console.log(video.width, video.height);
    video.stop();
    video.hide();
    mouselicksx = [];
    mouselicksy = [];
    showSquare = true;
}
async function sudokuScreen() {
    if (img != null) {
        if (is_desktop){
            if (mouselicksx.length >= 3) {
                img2 = img.get(mouselicksx[1], mouselicksy[1], mouselicksx[2] - mouselicksx[1], mouselicksy[2] - mouselicksy[1]);
            } else {
                img2 = img;
            }
        }

        if (mouselicksx.length >= 3) {
            img2 = img.get(mouselicksx[1], mouselicksy[1], mouselicksx[2] - mouselicksx[1], mouselicksy[2] - mouselicksy[1]);
        } else {
            img2 = img.get(5, 5, windowWidth-10, windowWidth-10);
        }
    }
    console.log("SudokuScreen");
    _startScreen = false;
    _uploadScreen = false;
    _videoScreen = false;
    _uploadImageScreen = false;
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
    numbers2d = await getDigits(img2);
}

function calculatedScreen() {
    console.log("CalculatedScreen");
    const grid = [ // Fallback Feld, da die Erkennung nicht gut funktioniert
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
    _startScreen = false;
    _uploadScreen = false;
    _videoScreen = false;
    _uploadImageScreen = false;
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
    showSquare = false;
    console.log(numbers2d);
        if (!got_solution){
    final1d = getGrid(grid);
    while (final1d.length) final2d.push(final1d.splice(0, 9));
    } else {
        final1d = getGrid(numbers2d);
        while (final1d.length) final2d.push(final1d.splice(0, 9));
    }
}

/**
 *
 */
function resetVideo() {
    window.location.reload();
}

/**
 *
 */
function mousePressed() {
    mouselicksx.push(mouseX);
    mouselicksy.push(mouseY);
}

/**
 * Funktion zur Platzierung aller Buttons und zum Erstellen des Canvas
 * */
function setup() {
    createCanvas(windowWidth, windowHeight - 100);
    logo = loadImage("Images/Logo.jpg");
    background(255);
    let buttonwidth = 140;
    let buttonheight = 50;
    /** Erstellen der Buttons zur Steuerung durch die App*/
    uploadButton = createButton('Sudoku hochladen');
    uploadButton.position(windowWidth / 2 - 40 - buttonwidth, windowHeight - 120);
    uploadButton.size(buttonwidth, buttonheight);
    uploadButton.mousePressed(uploadScreen);
    videoButton = createButton('Sudoku aufnehmen');
    videoButton.position(windowWidth / 2 + 40, windowHeight - 120);
    videoButton.size(buttonwidth, buttonheight);
    videoButton.mousePressed(videoScreen);
    uploadImageButton = createButton('Foto hochladen');
    uploadImageButton.position(windowWidth / 2 + 40, windowHeight - 120);
    uploadImageButton.size(buttonwidth, buttonheight)
    uploadImageButton.mousePressed(uploadImageScreen)
    uploadImageButton.hide()
    getImageButton = createButton('Foto aufnehmen')
    getImageButton.position(windowWidth / 2 + 40, windowHeight - 120)
    getImageButton.size(buttonwidth, buttonheight)
    getImageButton.mousePressed(imageScreen)
    getImageButton.hide()
    cropImgButton = createButton('Sudoku zuschneiden')
    cropImgButton.position(windowWidth / 2 + 40, windowHeight - 120)
    cropImgButton.size(buttonwidth, buttonheight)
    cropImgButton.mousePressed(sudokuScreen)
    cropImgButton.hide()
    resetButton = createButton('Reset')
    resetButton.position(windowWidth / 2 - 40 - buttonwidth, windowHeight - 120)
    resetButton.size(buttonwidth, buttonheight)
    resetButton.mousePressed(resetVideo)
    resetButton.hide()
    calculateButton = createButton('Sudoku berechnen!')
    calculateButton.position(windowWidth / 2 + 40, windowHeight - 120)
    calculateButton.size(buttonwidth, buttonheight)
    calculateButton.mousePressed(calculatedScreen)
    calculateButton.hide();
}

/**
 *
 */
function draw() {
    if (_startScreen) {
        if (is_desktop) {
            image(logo, windowWidth / 2 - logo.width / 2, 0, logo.width, logo.height)
        } else {
            image(logo, 0, 0, windowWidth, windowWidth)
        }
    }

    if (_uploadScreen) {
        clear();
        if (is_desktop) {
            image(img2, windowWidth / 2 - logo.width / 2, 0, logo.width, logo.height);
        } else {
            image(img2, 0, 0, windowWidth, windowWidth);
        }
        noStroke();
        textSize(15);
        text("Hier sollte eigentlich ein BildUpload sein!", windowWidth / 2 - 150, windowHeight / 2 + 110);
        text("Zum Test wird ein gemocktes Bild bereitgestellt", windowWidth / 2 - 150, windowHeight / 2 + 140);
    }

    if (_videoScreen) {
        clear();
    }

    if (_uploadImageScreen) {
        clear();
        if (numbers2d.length === 9) {
            if (is_desktop) {
                stroke(245);
                strokeWeight(1);
                for (let i = 1; i < 9; i++) {
                    line(cell_size * (1 / 2 + i) + windowWidth / 2 - cell_size * 5, cell_size / 2, cell_size * (1 / 2 + i) + windowWidth / 2 - cell_size * 5, cell_size * (10 - 1 / 2));
                    line(cell_size / 2 + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i), cell_size * (10 - 1 / 2) + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i));
                }
                stroke(45);
                for (let i = 0; i <= 3; i++) {
                    line(cell_size * (1 / 2 + i * 3) + windowWidth / 2 - cell_size * 5, cell_size / 2, cell_size * (1 / 2 + i * 3) + windowWidth / 2 - cell_size * 5, cell_size * (10 - 1 / 2));
                    line(cell_size / 2 + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i * 3), cell_size * (10 - 1 / 2) + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i * 3));
                }
                noStroke();
                textSize(20);
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        if (numbers2d[i][j] !== 0) {
                            stroke("black");
                            fill("black");
                            text(numbers2d[i][j], cell_size * (j + 1) + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + 6);
                        } else if (numbers2d[i][j] > 0) {
                            stroke("green");
                            fill("green");
                            text(numbers2d[i][j], cell_size * (j + 1) + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + 6);
                        } else if (numbers2d[i][j] === 0) {
                            stroke("green");
                            fill("green");
                            text("", cell_size * (j + 1) + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + 6);
                        } else {
                            stroke("orange");
                            fill("orange");
                            text(numbers2d[i][j], cell_size * (j + 1) - 12 + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + (j % 3 - 1) * 12 + 6);
                        }
                    }
                }
            } else {
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
                        if (numbers2d[i][j] !== 0) {
                            stroke("black");
                            fill("black");
                            text(numbers2d[i][j], cell_size * (j + 1), cell_size * (i + 1) + 6);
                        } else if (numbers2d[i][j] > 0) {
                            stroke("green");
                            fill("green");
                            text(numbers2d[i][j], cell_size * (j + 1), cell_size * (i + 1) + 6);
                        } else if (numbers2d[i][j] === 0) {
                            stroke("green");
                            fill("green");
                            text("", cell_size * (j + 1), cell_size * (i + 1) + 6);
                        } else {
                            stroke("orange");
                            fill("orange");
                            text(numbers2d[i][j], cell_size * (j + 1) - 12, cell_size * (i + 1) + (j % 3 - 1) * 12 + 6);
                        }
                    }
                }
            }
        }
    }

    if (_imageScreen) {
        clear();
        image(img, 0, 0);
        if (showSquare) {
            strokeWeight(1);
            noFill();
            stroke(255, 0, 0);
            rect(mouselicksx[1], mouselicksy[1], mouselicksx[2] - mouselicksx[1], mouselicksy[2] - mouselicksy[1]);
        }

    }
    if (_sudokuScreen) {
        clear();
        if (numbers2d.length === 9) {
            if (is_desktop) {
                stroke(245);
                strokeWeight(1);
                for (let i = 1; i < 9; i++) {
                    line(cell_size * (1 / 2 + i) + windowWidth / 2 - cell_size * 5, cell_size / 2, cell_size * (1 / 2 + i) + windowWidth / 2 - cell_size * 5, cell_size * (10 - 1 / 2));
                    line(cell_size / 2 + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i), cell_size * (10 - 1 / 2) + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i));
                }
                stroke(45);
                for (let i = 0; i <= 3; i++) {
                    line(cell_size * (1 / 2 + i * 3) + windowWidth / 2 - cell_size * 5, cell_size / 2, cell_size * (1 / 2 + i * 3) + windowWidth / 2 - cell_size * 5, cell_size * (10 - 1 / 2));
                    line(cell_size / 2 + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i * 3), cell_size * (10 - 1 / 2) + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i * 3));
                }
                noStroke();
                textSize(20);
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        if (numbers2d[i][j] !== 0) {
                            stroke("black");
                            fill("black");
                            text(numbers2d[i][j], cell_size * (j + 1) + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + 6);
                        } else if (numbers2d[i][j] > 0) {
                            stroke("green");
                            fill("green");
                            text(numbers2d[i][j], cell_size * (j + 1) + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + 6);
                        } else if (numbers2d[i][j] === 0) {
                            stroke("green");
                            fill("green");
                            text("", cell_size * (j + 1) + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + 6);
                        } else {
                            stroke("orange");
                            fill("orange");
                            text(numbers2d[i][j], cell_size * (j + 1) - 12 + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + (j % 3 - 1) * 12 + 6);
                        }
                    }
                }
                image(img2, windowWidth / 2 - 75, 375, 150, 150);
            } else {
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
                        if (numbers2d[i][j] !== 0) {
                            stroke("black");
                            fill("black");
                            text(numbers2d[i][j], cell_size * (j + 1), cell_size * (i + 1) + 6);
                        } else if (numbers2d[i][j] > 0) {
                            stroke("green");
                            fill("green");
                            text(numbers2d[i][j], cell_size * (j + 1), cell_size * (i + 1) + 6);
                        } else if (numbers2d[i][j] === 0) {
                            stroke("green");
                            fill("green");
                            text("", cell_size * (j + 1), cell_size * (i + 1) + 6);
                        } else {
                            stroke("orange");
                            fill("orange");
                            text(numbers2d[i][j], cell_size * (j + 1) - 12, cell_size * (i + 1) + (j % 3 - 1) * 12 + 6);
                        }
                    }
                }
                image(img2, windowWidth / 2 - 75, 375, 150, 150);
            }
        }
    }

    if (_calculatedScreen) {
        clear();
        if (is_desktop) {
            stroke(245);
            strokeWeight(1);
            for (let i = 1; i < 9; i++) {
                line(cell_size * (1 / 2 + i) + windowWidth / 2 - cell_size * 5, cell_size / 2, cell_size * (1 / 2 + i) + windowWidth / 2 - cell_size * 5, cell_size * (10 - 1 / 2));
                line(cell_size / 2 + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i), cell_size * (10 - 1 / 2) + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i));
            }
            stroke(45);
            for (let i = 0; i <= 3; i++) {
                line(cell_size * (1 / 2 + i * 3) + windowWidth / 2 - cell_size * 5, cell_size / 2, cell_size * (1 / 2 + i * 3) + windowWidth / 2 - cell_size * 5, cell_size * (10 - 1 / 2));
                line(cell_size / 2 + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i * 3), cell_size * (10 - 1 / 2) + windowWidth / 2 - cell_size * 5, cell_size * (1 / 2 + i * 3));
            }
            noStroke();
            textSize(20);
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (final2d[i][j] !== 0) {
                        stroke("black");
                        fill("black");
                        text(final2d[i][j], cell_size * (j + 1) + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + 6);
                    } else if (final2d[i][j] > 0) {
                        stroke("green");
                        fill("green");
                        text(final2d[i][j], cell_size * (j + 1) + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + 6);
                    } else if (final2d[i][j] === 0) {
                        stroke("green");
                        fill("green");
                        text("", cell_size * (j + 1) + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + 6);
                    } else {
                        stroke("orange");
                        fill("orange");
                        text(final2d[i][j], cell_size * (j + 1) - 12 + windowWidth / 2 - cell_size * 5, cell_size * (i + 1) + (j % 3 - 1) * 12 + 6);
                    }
                }
            }
        } else {
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
                    if (final2d[i][j] !== 0) {
                        stroke("black");
                        fill("black");
                        text(final2d[i][j], cell_size * (j + 1), cell_size * (i + 1) + 6);
                    } else if (final2d[i][j] > 0) {
                        stroke("green");
                        fill("green");
                        text(final2d[i][j], cell_size * (j + 1), cell_size * (i + 1) + 6);
                    } else if (final2d[i][j] === 0) {
                        stroke("green");
                        fill("green");
                        text("", cell_size * (j + 1), cell_size * (i + 1) + 6);
                    } else {
                        stroke("orange");
                        fill("orange");
                        text(final2d[i][j], cell_size * (j + 1) - 12, cell_size * (i + 1) + (j % 3 - 1) * 12 + 6);
                    }
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
        return false;
    }
    return !/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
    );
};


