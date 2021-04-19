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
            let subimg = img.get(j * imgwidth+imgwidth*0.1, i * imgheight+imgwidth*0.1, imgwidth*0.8, imgheight*0.8);
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

