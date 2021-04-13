/**
 *
 * @param err
 * @param results
 */
function gotResultss(err, results) {
    if (err) {
        console.error(err);
        return;
    }
    let label = results[0].label;
    let confidence = nf(100 * results[0].confidence, 2, 0);
    if (confidence >= 50) {
        numbers.push(int(label));
    } else {
        numbers.push(0);
    }
}
