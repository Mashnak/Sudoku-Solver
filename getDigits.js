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

/**
 * Funktion zur Erkennung der Ziffern
 * @param img Aufgenommenes Foto eines Sudokus auf dem die Ziffern erkannt werden sollen
 * @returns {*[]} Eindimensionales Feld mit den erkannten Ziffern
 */
async function getDigits(img) {
    let numbers = []; // Feld in dem die Ziffern gespeichert werden
    let imgwidth = img.width / 9;
    let imgheight = img.height / 9;
    const promises = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let subimg = img.get(j * imgwidth, i * imgheight, imgwidth, imgheight);
            subimg.resize(28, 28);
            promises.push(new Promise(function (resolve,reject){
                numberClassifier.classify({image: subimg}, function (err, results) {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }
                    let label = int(results[0].label);
                    let confidence = nf(100 * results[0].confidence, 2, 0);
                    if(!numbers[i]) {
                        numbers[i] = [];
                    }
                    if (confidence >= 80) {
                        numbers[i][j] = label;
                        resolve(label);
                    } else {
                        numbers[i][j] = 0;
                        resolve(0);
                    }
                });
            }));
        }
    }
    await Promise.all(promises);
    return numbers;
}

