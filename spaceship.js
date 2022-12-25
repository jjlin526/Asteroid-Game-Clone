class Spaceship {
  constructor() {
    this.velocity = new createVector(0, 0);
    this.location = new createVector(width / 2, height / 2);
    this.acceleration = new createVector(0, 0);
    // maximum velocity of the spaceship
    this.maxVelocity = 5;
    this.bulletSys = new BulletSystem();
    this.size = 50;
    // track current direction of spaceship movement to determine jet thruster direction
    this.movingRight = false;
    this.movingLeft = false;
    this.movingUp = false;
    this.movingDown = false;
  }

  run() {
    this.bulletSys.run();
    this.draw();
    this.move();
    this.edges();
    this.interaction();
  }

  draw() {
    // store adjustments to thruster X and Y position based on spaceship direction
    let thrusterXPosition = 0;
    let thrusterYPosition = 0;

    // modify thruster positions based on left, right, up, and down spaceship movement
    if (this.movingLeft) {
      // default X position of thrusters is sufficient when moving left
    }
    if (this.movingRight) {
      thrusterXPosition = -50;
    }
    if (this.movingUp) {
      // default Y position of thrusters is sufficient when moving up
    }
    if (this.movingDown) {
      thrusterYPosition = -40;
    }

    // jet thrusters appear as horizontal bars when spaceship is moving in a left or right direction
    if (this.movingLeft || this.movingRight) {
      this.drawHorizontalThrusters(thrusterXPosition, thrusterYPosition);
    }

    // jet thrusters appear as vertical bars when spaceship is moving in an up or down direction
    if (this.movingUp || this.movingDown) {
      this.drawVerticalThrusters(thrusterXPosition, thrusterYPosition);
    }

    // body of spaceship
    fill(180, 144, 255);
    triangle(
      this.location.x - this.size / 2,
      this.location.y + this.size / 2,
      this.location.x + this.size / 2,
      this.location.y + this.size / 2,
      this.location.x,
      this.location.y - this.size / 2
    );
  }

  // function that draws horizontal thrusters when spaceship is moving in a left or right direction
  drawHorizontalThrusters(thrusterXPosition, thrusterYPosition) {
    // LEFT JET THRUSTER

    noStroke();
    fill(255, 185, 0);
    // outer orange flame of left jet thruster
    ellipse(
      this.location.x + thrusterXPosition + random(20, 30),
      this.location.y - 20 + thrusterYPosition,
      50,
      20
    );
    fill(255, 255, 0);
    // inner yellow flame of left jet thruster
    ellipse(
      this.location.x + thrusterXPosition + random(15, 20),
      this.location.y - 20 + thrusterYPosition,
      40,
      15
    );

    // RIGHT JET THRUSTER

    noStroke();
    fill(255, 185, 0);
    // outer orange flame of right jet thruster
    ellipse(
      this.location.x + thrusterXPosition + random(20, 30),
      this.location.y + 20 + thrusterYPosition,
      50,
      20
    );
    fill(255, 255, 0);
    // inner yellow flame of right jet thruster
    ellipse(
      this.location.x + thrusterXPosition + random(15, 20),
      this.location.y + 20 + thrusterYPosition,
      40,
      15
    );
  }

  // function that draws vertical thrusters when spaceship is moving in an up or down direction
  drawVerticalThrusters(thrusterXPosition, thrusterYPosition) {
    // TOP JET THRUSTER

    noStroke();
    fill(255, 185, 0);
    // outer orange flame of top jet thruster
    ellipse(
      this.location.x - 20 + thrusterXPosition,
      this.location.y + thrusterYPosition + random(20, 30),
      20,
      50
    );
    fill(255, 255, 0);
    // inner yellow flame of top jet thruster
    ellipse(
      this.location.x - 20 + thrusterXPosition,
      this.location.y + thrusterYPosition + random(15, 20),
      15,
      40
    );

    // BOTTOM JET THRUSTER

    noStroke();
    fill(255, 185, 0);
    // outer orange flame of bottom jet thruster
    ellipse(
      this.location.x + 20 + thrusterXPosition,
      this.location.y + thrusterYPosition + random(20, 30),
      20,
      50
    );
    fill(255, 255, 0);
    // inner yellow flame of bottom jet thruster
    ellipse(
      this.location.x + 20 + thrusterXPosition,
      this.location.y + thrusterYPosition + random(15, 20),
      15,
      40
    );
  }

  // move all bullets
  move() {
    // velocity changes according to acceleration
    this.velocity.add(this.acceleration);
    // limit the maximum velocity of the spaceship
    this.velocity.limit(this.maxVelocity);
    // position changes according to velocity
    this.location.add(this.velocity);
    // clear acceleration each frame
    this.acceleration.mult(0);
  }

  applyForce(f) {
    this.acceleration.add(f);
  }

  // reset the direction of spaceship movement to its default state
  resetSpaceshipDirection() {
    this.movingRight = false;
    this.movingLeft = false;
    this.movingUp = false;
    this.movingDown = false;
  }

  // enable player-controlled movement of spaceship with arrow keys
  interaction() {
    // left arrow moves spaceship left
    if (keyIsDown(LEFT_ARROW)) {
      this.applyForce(createVector(-0.1, 0));
      // reset the current spaceship direction
      this.resetSpaceshipDirection();
      // set the new current spaceship direction
      this.movingLeft = true;
    }
    // right arrow moves spaceship right
    if (keyIsDown(RIGHT_ARROW)) {
      this.applyForce(createVector(0.1, 0));
      // reset the current spaceship direction
      this.resetSpaceshipDirection();
      // set the new current spaceship direction
      this.movingRight = true;
    }
    // up arrow moves spaceship up
    if (keyIsDown(UP_ARROW)) {
      this.applyForce(createVector(0, -0.1));
      // reset the current spaceship direction
      this.resetSpaceshipDirection();
      // set the new current spaceship direction
      this.movingUp = true;
    }
    // down arrow moves spaceship down
    if (keyIsDown(DOWN_ARROW)) {
      this.applyForce(createVector(0, 0.1));
      // reset the current spaceship direction
      this.resetSpaceshipDirection();
      // set the new current spaceship direction
      this.movingDown = true;
    }
  }

  fire() {
    this.bulletSys.fire(this.location.x, this.location.y);
  }

  // control edge behaviour so that spaceship moves in a continuous manner
  edges() {
    if (this.location.x < 0) this.location.x = width;
    else if (this.location.x > width) this.location.x = 0;
    else if (this.location.y < 0) this.location.y = height;
    else if (this.location.y > height) this.location.y = 0;
  }

  // apply gravitational pull and friction to spaceship when it enters earth's atmosphere
  setNearEarth() {
    // earth's gravity
    var gravity = createVector(0, 0.05);
    // apply downward-pointing force on spaceship to pull it towards earth
    this.applyForce(gravity);

    // create fiction force
    var friction = this.velocity.copy();
    // friction force acts in opposite direction to spaceship with a smaller magnitude
    friction.mult(-1 / 30);
    // apply friction force to decelerate spaceship
    this.applyForce(friction);
  }
}
