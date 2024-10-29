class Firework {
    constructor(x, y, velocity, col) {
      this.color = col;
      this.firework = new Particle(x, y, velocity, this.color, true);
      this.exploded = false;
      this.particles = [];   // after explosion particles.
      this.displayInSky;
      this.textAsPoints = [];
      this.doneParticles = [];
      this.state = "explosion"  // > formation
      this.scatteredPoints = [];
      this.tolerance = 1;
      this.explosionPoint = random(50,200);
    }

    done() {
      if (this.state == "explosion") {
        if (this.exploded && this.particles.length === 0) {
          for(let i = 0; i < this.textAsPoints.length; i++){
            this.scatteredPoints.push({
              x: this.doneParticles[i].pos.x,
              y: this.doneParticles[i].pos.y,
              targetx: this.textAsPoints[i].x,
              targety: this.textAsPoints[i].y
            })
          }

          // Update the state.
          this.state = "formation";
          return false;
        } else if (this.firework.pos.y > height || this.firework.pos.x < 0 || this.firework.pos.x > width){
          return true;
        } else {
          return false;
        }
      } else if (this.state == "formation") { 
        return this.scatteredPoints.every(pt => {
          let distX = abs(pt.x - pt.targetx);
          let distY = abs(pt.y - pt.targety);
          return distX < this.tolerance && distY < this.tolerance;
        });        
      }
      
    }

    show() {
      if (this.state == "explosion") {
        if (!this.exploded) {
          this.firework.show();
        }
    
        for (var i = 0; i < this.particles.length; i++) {
          this.particles[i].show();
        }
      }
      else if (this.state == "formation") {
        // Draw each point, moving it towards its target
        push()
        stroke(this.color)
        fill(this.color)
        this.scatteredPoints.forEach((pt) => {
          ellipse(pt.x, pt.y, 5, 5);
        });
        pop();
      }
    }

    update() {
      if (this.state == "explosion") {
        if (!this.exploded) {        
          this.firework.update();
    
          if (this.firework.pos.y <= this.explosionPoint) {
            this.exploded = true;
            this.explode();
          }
        }
    
        for (let i = this.particles.length - 1; i >= 0; i--) {        
          this.particles[i].update();  
          if (this.particles[i].done()) {
            // At this point the particles is done after complete explosion.
            // Before deleting particle save it in scattered particles for text display.
            this.doneParticles.push(this.particles[i]);
            this.particles.splice(i, 1);
          }
        }
      } else if (this.state == "formation") {
        this.scatteredPoints.forEach((pt) => {
          // Move each point closer to its target using lerp
          pt.x = lerp(pt.x, pt.targetx, animationSpeed);
          pt.y = lerp(pt.y, pt.targety, animationSpeed);
        });
      }
      
    }

    explode() {
      // particle exploded. Choose text to display.
      this.displayInSky = textInSky[textInSkyCounter];
      textInSkyCounter = (textInSkyCounter + 1) % textInSky.length;

      // Get points from the text
      this.textAsPoints = font.textToPoints(this.displayInSky, this.firework.pos.x - 100, this.firework.pos.y, fontSize, {
        sampleFactor: 0.2, // Density of points
      });


      if (random(2)<1) e1.play();
        else e2.play();
      for (let i = 0; i < this.textAsPoints.length; i++) {
        let valFirework = p5.Vector.random2D();
        valFirework.mult(random(2,10));
        const p = new Particle(this.firework.pos.x, this.firework.pos.y, valFirework, this.color, false);
        this.particles.push(p);
      }
    }    
  }