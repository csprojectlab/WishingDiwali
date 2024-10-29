const fireworks = [];
const textInSky = ["HAPPY", "DIWALI", "SHIVANI"];
let textInSkyCounter = 0;
let fontSize = 50;
let animationSpeed = 0.05; // Controls the speed of the animation
let gravity;

// launch pad variables.
let initPos;
let launchPos;
let vel;
let col;
let launching = false;
let l1,e1,e2;
let prompt = 'Drag & Launch';
let font;

function preload() {
  l1 = loadSound("Audio/Launch.mp3");
  e1 = loadSound("Audio/Explosion1.mp3");
  e2 = loadSound("Audio/Explosion2.mp3");
  font = loadFont('RubikWetPaint-Regular.ttf');
}

function setup() {
  createCanvas(800, 400);
  textFont('Georgia');
  textSize(14);
  initPos = createVector(width/2, height-100);
  col = color(255);
  gravity = createVector(0, 0.1);
}

function draw() {
  background(0, 0, 0, 40);
  
  l1.setVolume(0.01);
  e1.setVolume(0.15);
  e2.setVolume(0.15);
  
  stroke(255);

  push();
  colorMode(HSB);
  let hueValue = (frameCount % 180);
  stroke(hueValue, 255, 255);
  strokeWeight(4);
  line(width/2-20, height-100, width/2-20, height);
  line(width/2+20, height-100, width/2+20, height);
  
  // check the launch status to show different launchpad shape
  if (mouseIsPressed) {
    constrainedY = constrain(mouseY, 100, height*2);
    line(width/2-20, height-100, mouseX, constrainedY);
    line(width/2+20, height-100, mouseX, constrainedY);
    ellipse(mouseX, constrainedY, 10);
  }
  else if (!launching) {
    line(width/2-20, height-100, width/2+20, height-100);
    ellipse(width/2, height-100, 10);
  }

  pop();
  
  noStroke();
  
  // update and show the status of the fireworks
  for (let i=0; i < fireworks.length; i++) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) 
        fireworks.splice(i, 1);   
  }

  // allow next launch if
  if (launching && !mouseIsPressed) 
    launching = false;
  
  // show the prompt
  fill(255);
  text(prompt, width/2+40, height-20);
}

// initiate the launch while pressed
function mousePressed() {
  if (!launching) launching = true;
}

// start the launch processes and initiate the particle
function mouseReleased() {
  constrainedY = constrain(mouseY, 100, height*2);
  launchPos = createVector(mouseX, constrainedY);
  vel = p5.Vector.sub(initPos, launchPos);
  vel.mult(0.13);
  l1.play();
  col = color(random(255), random(255), random(200, 255));
  fireworks.push(new Firework(mouseX, constrainedY, vel, col));  
}
