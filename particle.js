class Particle {  
    constructor(x, y, vel, color, isRocket) {
      this.pos = createVector(x, y);
      this.vel = vel
      this.acc = createVector(0, 0.1);
      this.color = color;
      this.isRocket = isRocket;
      this.lifespan = 255;
    }

    applyForce(force) {
      this.acc.add(force);
    }
    
    update() {
      // if ((this.pos.y<height-100 || this.vel.y>0) && this.isRocket) {
      //   this.vel.add(this.acc);
      // }
      if (!this.isRocket) {
        this.vel.mult(0.9);
        this.lifespan -= 4;
      }
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
    
    show() {
      fill(this.color);
      if (this.isRocket) {
        ellipse(this.pos.x, this.pos.y, 10);
      }
      else {
        //fill(this.color);
        strokeWeight(2);
        stroke(this.color, 255, 255, this.lifespan);
        point(this.pos.x, this.pos.y);
        //fill(255);
      }
      //fill(255);
    }
    
    done() {
      if (this.pos.y > height && !launching) {
        return true;
      }       
      else if (this.lifespan < 0) {
        return true;
      }
      else {
        return false;
      }
    }
  }
