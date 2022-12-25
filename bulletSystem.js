class BulletSystem {
  constructor() {
    this.bullets = [];
    this.velocity = new createVector(0, -5);
    this.diam = 10;
    this.radius = this.diam / 2;
  }

  run() {
    this.move();
    this.draw();
    this.edges();
  }

  fire(x, y) {
    this.bullets.push(createVector(x, y));
  }

  // draws all bullets
  draw() {
    fill(color(255, 40, 80));
    for (var i = 0; i < this.bullets.length; i++) {
      ellipse(this.bullets[i].x, this.bullets[i].y, this.diam, this.diam);
    }
  }

  // updates the location of all bullets
  move() {
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].y += this.velocity.y;
    }
  }

  // check if bullets leave the screen and remove them from the array
  edges() {
    for (var i = 0; i < this.bullets.length; ++i) {
      /* determine if bullet has exited screen in vertical or horizontal direction
      robust bounds-checking ensures game does not slow down due to number of bullets maintained */
      if (
        this.bullets[i].y < 0 ||
        this.bullets[i].y > height ||
        this.bullets[i].x < 0 ||
        this.bullets[i].x > width
      ) {
        // delete bullet
        this.bullets.splice(i, 1);
      }
    }
  }
}
