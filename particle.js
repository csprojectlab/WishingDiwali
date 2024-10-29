class Particle {  
  // Constructor to initialize a particle with position, velocity, color, and other properties
  constructor(x, y, vel, color, isRocket) {
    this.pos = createVector(x, y); // The current position of the particle, initialized with x and y coordinates
    this.vel = vel; // The velocity vector that determines the direction and speed of the particle's movement
    this.acc = createVector(0, 0.1); // Acceleration vector applied to the particle, simulating gravity (downward force)
    this.color = color; // The color of the particle, which affects its appearance when drawn
    this.isRocket = isRocket; // A boolean flag indicating whether the particle is a rocket (true) or an explosion particle (false)
    this.lifespan = 255; // The lifespan of the particle, representing its visibility over time (max is 255 for full opacity)
  }

  // Method to apply a force to the particle, affecting its acceleration
  applyForce(force) {
    this.acc.add(force); // Adds the provided force vector to the particle's current acceleration
  }
  
  // Method to update the particle's position and other properties based on its velocity and acceleration
  update() {
    // if ((this.pos.y < height - 100 || this.vel.y > 0) && this.isRocket) {
    //   this.vel.add(this.acc); // Adds acceleration to velocity if the rocket is still within the canvas height
    // }
    // For non-rocket particles (explosion particles), the velocity is reduced and lifespan decreased
    if (!this.isRocket) {
      this.vel.mult(0.9); // Dampen the velocity to simulate slowing down over time
      this.lifespan -= 4; // Decrease lifespan to gradually make the particle fade out
    }
    this.vel.add(this.acc); // Update velocity by adding acceleration to it
    this.pos.add(this.vel); // Update position by adding velocity to it
    this.acc.mult(0); // Reset acceleration for the next frame (to prevent cumulative forces)
  }
  
  // Method to draw the particle on the canvas
  show() {
    fill(this.color); // Set the fill color for the particle based on its defined color
    if (this.isRocket) {
      // If the particle is a rocket, draw it as an ellipse to represent its shape
      ellipse(this.pos.x, this.pos.y, 10); // Draw the rocket particle at its current position
    }
    else {
      // For explosion particles, set stroke properties and draw points
      strokeWeight(2); // Set the stroke weight for points to make them more visible
      stroke(this.color, 255, 255, this.lifespan); // Set stroke color with alpha based on lifespan for fading effect
      point(this.pos.x, this.pos.y); // Draw a point at the current position of the explosion particle
    }
  }
  
  // Method to check if the particle is done (should be removed from the display)
  done() {
    // If the particle goes off the bottom of the canvas and launching is not active, it's done
    if (this.pos.y > height && !launching) {
      return true; // Indicates that the particle is done and should be removed
    }       
    else if (this.lifespan < 0) {
      return true; // If lifespan is less than zero, particle is done (faded out)
    }
    else {
      return false; // The particle is still active and should remain visible
    }
  }
}
