let numberClassifier;
let img = null;
let img2 = null;
let clearCanvas = false;
let subimg = [];
let resultsDiv;
const numbers = [];
const newArr = [];
let x = 0;
let y = 0;
let video;
let getImageButton;
let resetButton;
let calculateButton;
let mouselicksx = [];
let mouselicksy = [];
let showSquare = true;

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
  img = video.get(0,0,video.width, video.height);
  video.stop();
  video.hide();
  getImageButton.hide();
  resetButton.show();
  calculateButton.show();
  //console.log(img.width, img.height);
  mouselicksx = [];
  mouselicksy = [];
  //calculateSudoku();
  //console.log(mouselicksx, mouselicksy);
}

function mousePressed(){
  mouselicksx.push(mouseX);
  mouselicksy.push(mouseY);
  //console.log(mouselicksx,mouselicksy);
}
function calculateSudoku(){
  if(img != null){
    img2 = img.get(mouselicksx[1],mouselicksy[1],mouselicksx[2]-mouselicksx[1],mouselicksy[2]-mouselicksy[1]);
  }
  y++;
  showSquare = false;
    //img2 = img.get(mouselicksx[1],mouselicksy[1],mouselicksx[2]-mouselicksx[1],mouselicksy[2]-mouselicksy[1]);
  //console.log(img.width, img.height);
  img2.resize(252, 252);
  console.log(img2.width, img2.height);
  //clearCanvas = true;
  imgwidth = img2.width/9;
  imgheight = img2.height/9;
  if(subimg.length<81){
  for (let i = 0; i < 9; i++){
    for (let j = 0; j < 9; j++){
      subimg.push(img2.get(j*imgwidth,i*imgheight,imgwidth,imgheight));
      console.log(subimg[0].width);
    }
  }}
  console.log(subimg.length);
  while(numbers.length) newArr.push(numbers.splice(0,9));
  resultsDiv.html(newArr.splice(0,9));
  classifySubImages();
  console.log(newArr);
}
function classifySubImages(){
  for(let z = 0; z < subimg.length; z++){
    numberClassifier.classify({image: subimg[z]}, gotResults);
  }

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
  if(y>0&&y<=1){
    calculateSudoku();
  }
  if(img != null){
    image(img,0,0);
  }
  if(img2 != null){
    clear();
    img = null;
    image(img2,0,0);
  }
  if (clearCanvas){
    clear();
  }
  if (showSquare){
    rect(mouselicksx[1], mouselicksy[1], mouselicksx[2]-mouselicksx[1],mouselicksy[2]-mouselicksy[1]);
  stroke(255,0,0);
  strokeWeight(5);
  noFill();
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
