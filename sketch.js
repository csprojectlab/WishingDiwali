// Array to hold firework objects
const fireworks = [];
// Array of texts to display in the sky
const textInSky = ["ARI", "LOVES", "SHIVANI", "SHIVANI", "LOVES", "ARI?", "YES!!"];
let textInSkyCounter = 0; // Counter for cycling through text
let fontSize = 50; // Base font size for displaying text
let animationSpeed = 0.05; // Controls the speed of the animation
let gravity; // Gravity vector for firework movement

// Launch pad variables
let initPos; // Initial position of the launch pad
let launchPos; // Launch position where the firework is launched from
let vel; // Velocity of the firework
let col; // Color of the firework
let launching = false; // Flag to check if the firework is launching
let l1, e1, e2; // Sound variables for launch and explosion sounds
let prompt = 'Drag & Launch'; // Instruction text displayed on the canvas
let font; // Variable for the custom font

// Preload function to load sounds and fonts before the setup
function preload() {
  l1 = loadSound("Audio/Launch.mp3"); // Load launch sound
  e1 = loadSound("Audio/Explosion1.mp3"); // Load first explosion sound
  e2 = loadSound("Audio/Explosion2.mp3"); // Load second explosion sound
  font = loadFont('RubikWetPaint-Regular.ttf'); // Load custom font
}

// Setup function to initialize the canvas and variables
function setup() {
  createCanvas(800, 400); // Create canvas with specified dimensions
  textFont('Georgia'); // Set default font for text
  textSize(14); // Set default text size
  initPos = createVector(width/2, height-100); // Initialize launch pad position
  col = color(255); // Set initial color to white
  gravity = createVector(0, 0.1); // Define gravity vector
}

// Draw function to continuously render the canvas
async function draw() {
  background(0, 0, 0, 20); // Set background with slight transparency
  
  // Set volume for sound effects
  l1.setVolume(0.01);
  e1.setVolume(0.15);
  e2.setVolume(0.15);
  
  stroke(255); // Set stroke color to white

  push(); // Save current drawing settings
  colorMode(HSB); // Switch to HSB color mode
  let hueValue = (frameCount % 180); // Change hue based on frame count
  stroke(hueValue, 255, 255); // Set stroke color with changing hue
  strokeWeight(4); // Set stroke weight for lines
  // Draw launch pad lines
  line(width/2-20, height-100, width/2-20, height);
  line(width/2+20, height-100, width/2+20, height);
  
  // Check the launch status to show different launchpad shape
  if (mouseIsPressed) {
    // Constrain the launch position to the canvas height
    constrainedY = constrain(mouseY, 100, height*2);
    line(width/2-20, height-100, mouseX, constrainedY); // Draw line from launch pad to cursor
    line(width/2+20, height-100, mouseX, constrainedY);
    ellipse(mouseX, constrainedY, 10); // Draw small ellipse at launch position
  } else if (!launching) {
    // Draw default launch pad shape if not launching
    line(width/2-20, height-100, width/2+20, height-100);
    ellipse(width/2, height-100, 10); // Draw launch pad indicator
  }

  pop(); // Restore previous drawing settings
  
  noStroke(); // Disable stroke for the following shapes
  
  // Update and show the status of the fireworks
  // for (let i=0; i < fireworks.length; i++) {
  //   fireworks[i].update(); // Update firework's position and state
  //   fireworks[i].show(); // Display the firework on the canvas
  //   // Remove firework if it's done
  //   if (fireworks[i].done()) 
  //       fireworks.splice(i, 1);   
  // }
  let updates = fireworks.map(async (firework, index) => {
    firework.update();
    firework.show();
    return firework.done() ? index : null;
  });
  // Wait for all updates to finish
  let results = await Promise.all(updates);
  results
    .filter(index => index !== null)
    .reverse() // Reverse to avoid issues with splicing while iterating
    .forEach(index => fireworks.splice(index, 1));

  // Allow next launch if mouse is released
  if (launching && !mouseIsPressed) 
    launching = false;
  
  // Show the prompt instruction on the canvas
  fill(255); // Set text color to white
  noStroke();
  text(prompt, width/2+40, height-20); // Draw prompt text
  push()
  textSize(10)
  fill(255, 255,0)
  text("Ari", width - 17, height - 3);
  pop()
  push()
  textSize(50)
  text("🌕", width - 100, 70);
  pop()
}

// Initiate the launch while the mouse is pressed
function mousePressed() {
  if (!launching) launching = true; // Set launching to true if not already launching
}

// Start the launch processes and initiate the firework particle
function mouseReleased() {
  // Constrain the launch position
  constrainedY = constrain(mouseY, 100, height*2);
  launchPos = createVector(mouseX, constrainedY); // Create launch position vector
  vel = p5.Vector.sub(initPos, launchPos); // Calculate velocity based on positions
  vel.mult(0.13); // Scale the velocity
  l1.play(); // Play launch sound
  col = color(random(255), random(255), random(200, 255)); // Randomize firework color
  
  fireworks.push(new Firework(mouseX, constrainedY, vel, col)); // Add new firework to the array
  
}
