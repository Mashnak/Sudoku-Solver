/*****************************************************************************
 ***  Methoden um das vorhandene und erkannte Sudoku vollständig zu lösen.  ***
 *****************************************************************************/

let one = [];
let two = [];
let three = [];
let four = [];
let five = [];
let six = [];
let seven = [];
let eight = [];
let nine = [];

let numberClassifier;



function preload() {
	for (let i = 0; i < 1500; i++){
		let index = nf(i+1);
		one[i] = loadImage('newtrainingSet/1/Img'+index+'.jpg');
		two[i] = loadImage('newtrainingSet/2/Img'+index+'.jpg');
		three[i] = loadImage('newtrainingSet/3/Img'+index+'.jpg');
		four[i] = loadImage('newtrainingSet/4/Img'+index+'.jpg');
		five[i] = loadImage('newtrainingSet/5/Img'+index+'.jpg');
		six[i] = loadImage('newtrainingSet/6/Img'+index+'.jpg');
		seven[i] = loadImage('newtrainingSet/7/Img'+index+'.jpg');
		eight[i] = loadImage('newtrainingSet/8/Img'+index+'.jpg');
		nine[i] = loadImage('newtrainingSet/9/Img'+index+'.jpg');
		if (i%100===0) {
			console.log((i/100+1)*100+' images loaded!');
		}
	}
}

function setup() {

	let options = {
		inputs: [28,28,4],
		task: 'imageClassification',
		debug: true
	}
	console.log(one.length);
	numberClassifier = ml5.neuralNetwork(options);
	for (let j = 0; j < one.length; j++) {
		numberClassifier.addData({image:one[j]},{label:'1'});
		numberClassifier.addData({image:two[j]},{label:'2'});
		numberClassifier.addData({image:three[j]},{label:'3'});
		numberClassifier.addData({image:four[j]},{label:'4'});
		numberClassifier.addData({image:five[j]},{label:'5'});
		numberClassifier.addData({image:six[j]},{label:'6'});
		numberClassifier.addData({image:seven[j]},{label:'7'});
		numberClassifier.addData({image:eight[j]},{label:'8'});
		numberClassifier.addData({image:nine[j]},{label:'9'});
	}
	numberClassifier.normalizeData();
	numberClassifier.train({epochs: 50}, finishedTraining);
}

function finishedTraining() {
	numberClassifier.save();
	console.log("Training finished!");

}

function draw() {
}
