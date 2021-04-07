let numberClassifier;
let img = null;
clearCanvas = false;
let subimg;
let resultsDiv;
const numbers = [];
const newArr = [];
let x = 0;
let video;
let getImageButton;
let resetButton;
let calculateButton;
let mouselicks = [];

function preload(){
}

function setup() {

  canvas = createCanvas(windowWidth, windowHeight-100);
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
  getImageButton.position(windowWidth/2-25,windowHeight-75);
  getImageButton.size(50,50);
  getImageButton.mousePressed(getImage);
  resetButton = createButton('Neues Foto aufnehmen!');
  resetButton.position(windowWidth/2-80,windowHeight-150);
  resetButton.size(160,50);
  resetButton.mousePressed(resetVideo);
  resetButton.hide();
  calculateButton = createButton('Sudoku berechnen!');
  calculateButton.position(windowWidth/2-80,windowHeight-100);
  calculateButton.size(160,50);
  calculateButton.mousePressed(calculateSudoku);
  calculateButton.hide();
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

  clearCanvas = false;
  img = loadImage("Sudoku.jpg");

  if (img.width<img.height){
    img = img.get(0,mouselicks[1],img.width,mouselicks[1]-mouselicks[0]);
  } else if (img.width>img.height){
    img = img.get((img.width-img.height)/2,0,img.height,img.height);
  }

  video.stop();
  video.hide();
  getImageButton.hide();
  resetButton.show();
  calculateButton.show();
  console.log(img.width, img.height);
  mouselicks = [];
  console.log(mouselicks);
}

function mousePressed(){
  mouselicks.push(mouseY);
  console.log(mouselicks);
}

function calculateSudoku(){
  console.log(img.width, img.height);
  //clearCanvas = true;
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
    image(img,0,0);

  }
  if (clearCanvas){
    clear();
  }
  if(subimg != null){
  image(subimg, img.height,0);
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
