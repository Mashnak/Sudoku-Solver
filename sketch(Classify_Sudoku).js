let numberClassifier;
let img = null;
let subimg;
let resultsDiv;
const numbers = [];
const newArr = [];
let x = 0;
let video;
let getImageButton;
let resetButton;
let calculateButton;

function preload(){
}

function setup() {

  canvas = createCanvas(windowWidth, windowHeight-50);
  background(255);
  console.log(getDeviceType());
  if (getDeviceType() == 'mobile'|| getDeviceType() =='tablet'){
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
  video.position(0,0);
  video.size(windowWidth, windowHeight);
  getImageButton = createButton('Foto');
  getImageButton.position(160,windowHeight-100);
  getImageButton.size(50,50);
  getImageButton.mousePressed(getImage);
  resetButton = createButton('Neues Foto aufnehmen!');
  resetButton.position(80,10);
  resetButton.size(160,50);
  resetButton.mousePressed(resetVideo);
  resetButton.hide();
  calculateButton = createButton('Sudoku berechnen!');
  calculateButton.position(400,10);
  calculateButton.size(160,50);
  calculateButton.mousePressed(calculateSudoku);
  calculateButton.hide();
  console.log(video.width, video.height);
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
  resultsDiv = createDiv("Model loaded!");
}

function modelLoaded(){
  console.log('Model loaded!');
}

//
function getImage(){
  img = video;
  video.stop();
  getImageButton.hide();
  resetButton.show();
  calculateButton.show();
}

function calculateSudoku(){
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
  resultsDiv.html(newArr.splice(0,9));
  console.log(newArr);
}

function resetVideo(){
  window.location.reload();
}

function gotResults(err, results){
  if (err){
    console.error(err);
    return;
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
  if(img != null){
    sq = square(0,0,img.width);
    stroke(255, 0, 0);
    strokeWeight(4);
    image(img,0,0);
    sq = square(0,0,img.width);
    stroke(255, 0, 0);
    strokeWeight(4);
  }
  resultsDiv.html(newArr);
}


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
