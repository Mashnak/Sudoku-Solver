PFont f;   
void setup() {
  size(28,28);
  f = createFont("Arial",16,true); 
}

void draw() {
  for (int i = 1; i < 1501; i++) {
    for (int j = 0; j < 10; j++) {
      float backg = random(250,255);
      float fontsize = random(20,25);
      float textx = random(width/2-8,width/2-3);
      float texty = random(height/2+8,height/2+11);
      background(backg);
      textFont(f,fontsize);
      fill(0);
      if(j == 0){
        text("", textx, texty);
      } else {
        text(j, textx, texty);
      }
      saveFrame("data/"+ j +"/Img"+ i + ".jpg");
    }
  }
}
