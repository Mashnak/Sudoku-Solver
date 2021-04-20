PFont f;   
void setup() {
  size(28,28);
  f = createFont("Arial",16,true); 
}

void draw() {
  for (int i = 1; i < 1501; i++) {
    for (int j = 1; j < 10; j++) {
      float backg = random(200,255);
      float fontsize = random(10,25);
      float textx = random(2,18);
      float texty = random(2+fontsize,height-2);
      background(backg);
      textFont(f,fontsize);
      fill(0);
      text(j, textx, texty);
      saveFrame("data/"+i+"/Img"+j+".jpg");
    }
  }
}
