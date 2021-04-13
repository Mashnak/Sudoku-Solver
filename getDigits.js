function getDigits(subimg) {
    subimg.resize(28, 28);
    return numberClassifier.classify({image: subimg}, gotResults);
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
        return label;
    } else {
        return 0;
    }
}
