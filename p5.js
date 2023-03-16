const NUM_BOIDS = 100;
const SEPARATION_DISTANCE = 20;
const ALIGNMENT_DISTANCE = 50;
const COHESION_DISTANCE = 100;
const MAX_SEPARATION_SPEED = 5;
const MAX_ALIGNMENT_SPEED = 3;
const MAX_COHESION_SPEED = 2;
const SEPARATION_WEIGHT = 1;
const ALIGNMENT_WEIGHT = 1;
const COHESION_WEIGHT = 1;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const boids = [];

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
  }

  updatePosition() {
    this.position.add(this.velocity);

    if (this.position.x < 0) this.position.x = CANVAS_WIDTH;
    if (this.position.x > CANVAS_WIDTH) this.position.x = 0;
    if (this.position.y < 0) this.position.y = CANVAS_HEIGHT;
    if (this.position.y > CANVAS_HEIGHT) this.position.y = 0;
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    fill(200, 100, 50);
    stroke(255);
    triangle(0, -5, -5, 5, 5, 5);
    pop();
  }

  flock(boids) {
  
    let separation = this.separate(boids);
    let alignment = this.align(boids);
    let cohesion = this.cohere(boids);

    separation.mult(SEPARATION_WEIGHT);
    alignment.mult(ALIGNMENT_WEIGHT);
    cohesion.mult(COHESION_WEIGHT);

    this.velocity.add(separation);
    this.velocity.add(alignment);
    this.velocity.add(cohesion);
  }
  
  
  
    separate(boids) {
    let sum = createVector();
    let count = 0;

    for (let other of boids) {
      // distance between the current boid and the other boid
      let distance = p5.Vector.dist(this.position, other.position);

      if (distance < SEPARATION_DISTANCE && other != this) {
        // vector pointing away from the other boid
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(distance);
        sum.add(diff);
        count++;
      }
    }
  
  
  
    if (count > 0) {
      sum.div(count);
      sum.setMag(MAX_SEPARATION_SPEED);
      sum.sub(this.velocity);
      sum.limit(0.1);
    }

    return sum;
  }
  
  
  
   align(boids) {
    let sum = createVector();
    let count = 0;

    for (let other of boids) {
      // distance between the current boid and the other boid
      let distance = p5.Vector.dist(this.position, other.position);

      if (distance < ALIGNMENT_DISTANCE && other != this) {
        sum.add(other.velocity);
        count++;
      }
    }
  
     
      if (count > 0) {
      sum.div(count);
      sum.setMag(MAX_ALIGNMENT_SPEED);
      sum.sub(this.velocity);
      sum.limit(0.1);
    }

    return sum;
  }
     
     
      cohere(boids) {
    let sum = createVector();
    let count = 0;

   
    for (let other of boids) {
      // distance between the current boid and the other boid
      let distance = p5.Vector.dist(this.position, other.position);

      if (distance < COHESION_DISTANCE && other != this) {
        sum.add(other.position);
        count++;
      }
    }

  
    if (count > 0) {
      
      sum.div(count);

      // desired velocity to reach the center of mass
      let desired = p5.Vector.sub(sum, this.position);

      desired.setMag(MAX_COHESION_SPEED);
      desired.sub(this.velocity);
      desired.limit(0.1);

      return desired;
    } else {
      return createVector();
    }
  }
}


function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  for (let i = 0; i < NUM_BOIDS; i++) {
    boids.push(new Boid(random(CANVAS_WIDTH), random(CANVAS_HEIGHT)));
  }
}

function draw() {
  background(51);

  // update and draw each boid
  for (let boid of boids) {
    boid.flock(boids);
    boid.updatePosition();
    boid.draw();
  }
}
     
     
     
  
  
