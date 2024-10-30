class Firework {
  // Constructor to initialize firework properties
  constructor(x, y, velocity, col) {
    this.color = col; // Color of the firework
    this.firework = new Particle(x, y, velocity, this.color, true); // Create a firework particle
    this.exploded = false; // Flag to check if the firework has exploded
    this.particles = [];   // Array to hold particles after explosion
    this.displayInSky; // Variable to hold text displayed in the sky
    this.textAsPoints = []; // Points that represent the text to be displayed
    this.doneParticles = []; // Array to hold completed particles
    this.state = "explosion";  // Current state of the firework (explosion or formation)
    this.scatteredPoints = []; // Points that scatter after explosion
    this.tolerance = 0.05; // Tolerance for point position matching
    this.explosionPoint = random(50, 220); // Height at which the firework explodes
  }

  // Method to check if the firework is done
  done() {
    if (this.state == "explosion") {
      // Check if the firework has exploded and all particles are done
      if (this.exploded && this.particles.length === 0) {
        // Store scattered points for text display
        this.scatteredPoints = this.textAsPoints.map((point, i) => ({
          x: this.doneParticles[i].pos.x, // Current x position of done particle
          y: this.doneParticles[i].pos.y, // Current y position of done particle
          targetx: point.x, // Target x position for the text point
          targety: point.y  // Target y position for the text point
        }));        

        // Update the state to formation
        this.state = "formation";
        return false; // Not done yet
      } else if (this.firework.pos.y > height || this.firework.pos.x < 0 || this.firework.pos.x > width){
        return true; // Firework is out of bounds, done
      } else {
        return false; // Firework is still in flight
      }
    } else if (this.state == "formation") { 
      // Check if all scattered points are within the defined tolerance of their targets
      return this.scatteredPoints.every(pt => {
        let distX = abs(pt.x - pt.targetx); // Calculate distance in x
        let distY = abs(pt.y - pt.targety); // Calculate distance in y
        return distX < this.tolerance && distY < this.tolerance; // Check if within tolerance
      });        
    }
  }

  // Method to display the firework on the canvas
  async show() {
    if (this.state == "explosion") {
      if (!this.exploded) {
        this.firework.show(); // Show the initial firework particle
      }
  
      // Show all explosion particles
      this.particles.forEach(particle => {
        particle.show(); // Display each particle
      });    
    }
    else if (this.state == "formation") {
      // Draw each point, moving it towards its target
      push() // Save current drawing settings
      stroke(this.color) // Set stroke color for points
      strokeWeight(2) // Set stroke weight
      // Draw scattered points
      this.scatteredPoints.forEach((pt) => {
        point(pt.x, pt.y); // Draw point at current position
      });
      pop(); // Restore previous drawing settings
    }
  }

  // Method to update the firework's position and state
  async update() {
    if (this.state == "explosion") {
      if (!this.exploded) {      
        this.firework.applyForce(createVector(0, 0.1)); // Apply gravity to the firework
        this.firework.update(); // Update firework position
  
        // Check if firework has reached the explosion point
        if (this.firework.pos.y <= this.explosionPoint) {
          this.exploded = true; // Set exploded flag
          this.explode(); // Trigger explosion
        }
      }
  
      // Update each explosion particle
      for (let i = this.particles.length - 1; i >= 0; i--) {     
        this.particles[i].applyForce(gravity); // Apply gravity to particles
        this.particles[i].update(); // Update particle position  
        if (this.particles[i].done()) {
          // If particle is done, save it for text display and remove from the array
          this.doneParticles.push(this.particles[i]);
          this.particles.splice(i, 1); // Remove the particle from the explosion array
        }
      }
    } else if (this.state == "formation") {
      // Move each scattered point closer to its target using lerp
      this.scatteredPoints.forEach((pt) => {
        pt.x = lerp(pt.x, pt.targetx, animationSpeed); // Lerp x position towards target
        pt.y = lerp(pt.y, pt.targety, animationSpeed); // Lerp y position towards target
      });
    }
  }

  // Method to handle the explosion of the firework
  explode() {
    // Choose text to display in the sky after explosion
    this.displayInSky = textInSky[textInSkyCounter];
    textInSkyCounter = (textInSkyCounter + 1) % textInSky.length; // Cycle through text array

    // Get points from the text to create
    fontSize = random(30, 50); // Randomize font size for text
    this.textAsPoints = font.textToPoints(this.displayInSky, this.firework.pos.x - 100, this.firework.pos.y, fontSize, {
      sampleFactor: random(0.1, 0.6), // Density of points for the text
    });

    // Play explosion sound randomly
    if (random(2) < 1) e1.play(); // Play first explosion sound
    else e2.play(); // Play second explosion sound
    
    // Create particles for the explosion effect
    for (let i = 0; i < this.textAsPoints.length; i++) {
      let valFirework = p5.Vector.random2D(); // Generate random direction for particles
      valFirework.mult(random(2, 10)); // Randomize particle speed
      const p = new Particle(this.firework.pos.x, this.firework.pos.y, valFirework, this.color, false); // Create new particle
      this.particles.push(p); // Add particle to the explosion array
    }
  }    
}
