let numberClassifier;
let img;
let subimg;
let resultsDiv;
const numbers = [];
const newArr = [];
let x = 0;

function preload(){
  img = loadImage('sudoku.jpg');
  subimg = loadImage('sudoku.jpg');
}

function setup() {
  createCanvas(img.width, img.height);
  let options = {
	inputs: [28,28,4],
	task: 'imageClassification',
  }
  numberClassifier = ml5.neuralNetwork(options);
  const modelDetails = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin'
  }
  numberClassifier.load(modelDetails, modelLoaded);
  image(img, 0, 0);
  resultsDiv = createDiv('');
}

function modelLoaded(){
  console.log('Model loaded!');
}

function mousePressed(){
  imgwidth = img.width/9;
  imgheight = img.height/9;
  for (let i = 0; i < 9; i++){
    for (let j = 0; j < 9; j++){
      subimg = get(j*imgwidth+imgwidth*0.1,i*imgheight+imgheight*0.1,imgwidth*0.8,imgheight*0.8);
      subimg.resize(28,28);
      numberClassifier.classify({image: subimg}, gotResults);
    }
  }
  while(numbers.length) newArr.push(numbers.splice(0,9));
  //resultsDiv.html(newArr.splice(0,9));
  console.log(newArr);
}

function gotResults(err, results){
  if (err){
    console.error(err);
    return
  }
  let label = results[0].label;
  let confidence = nf(100*results[0].confidence,2,0);
  if (confidence >= 50){
    numbers[x] = int(label);
  }
  else {
    numbers[x] = 0;
  }
  x++;
}

function draw() {
  image(subimg,0,0);
}
