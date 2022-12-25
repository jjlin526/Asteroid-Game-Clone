var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];
// player score: number of asteroids destroyed
var playerScore;
// difficulty level corresponds to asteroid spawn rate
var difficultyLevel;

//////////////////////////////////////////////////
function setup() {
  createCanvas(1200, 800);
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  // initialize player score and difficulty level
  playerScore = 0;
  difficultyLevel = 1;

  // periodically increment the difficulty level to reflect the increased asteroid spawn rate
  setInterval(incrementDifficultyLevel, 8000);

  // location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width / 2, height * 2.9);
  atmosphereSize = new createVector(width * 3, width * 3);
  earthLoc = new createVector(width / 2, height * 3.1);
  earthSize = new createVector(width * 3, width * 3);
}

//////////////////////////////////////////////////
function draw() {
  background(0);
  sky();

  spaceship.run();
  asteroids.run();

  // display player score in top-left corner
  displayPlayerScore();

  // display current difficulty level below player score
  displayDifficultyLevel();

  drawEarth();

  checkCollisions(spaceship, asteroids); // function that checks collision between various elements
}

//////////////////////////////////////////////////
// draws earth and atmosphere
function drawEarth() {
  noStroke();
  // draw semi-transparent blue atmosphere
  let atmosphereColor = color(70, 90, 200);
  atmosphereColor.setAlpha(120);
  fill(atmosphereColor);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x, atmosphereSize.y);
  // draw green-colored earth
  fill(100, 200, 110);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids) {
  //spaceship-2-asteroid collisions
  // determine collisions between spaceship and each on-screen asteroid
  for (var i = 0; i < asteroids.locations.length; ++i) {
    if (
      isInside(
        spaceship.location,
        spaceship.size,
        asteroids.locations[i],
        asteroids.diams[i]
      )
    )
      // collision detected: terminate game
      gameOver();
  }

  // asteroid-2-earth collisions
  // determine collisions between earth and each on-screen asteroid
  for (var i = 0; i < asteroids.locations.length; ++i) {
    if (
      isInside(
        asteroids.locations[i],
        asteroids.diams[i],
        earthLoc,
        earthSize.x
      )
    )
      // collision detected: terminate game
      gameOver();
  }

  // spaceship-2-earth
  if (isInside(spaceship.location, spaceship.size, earthLoc, earthSize.x))
    // collision detected: terminate game
    gameOver();

  // spaceship-2-atmosphere
  if (
    isInside(
      spaceship.location,
      spaceship.size,
      atmosphereLoc,
      atmosphereSize.x
    )
  )
    // apply friction and gravity to spaceship when spaceship enters earth's atmosphere
    spaceship.setNearEarth();

  // bullet collisions
  // evaluate each bullet to asteroid interaction
  for (var i = 0; i < spaceship.bulletSys.bullets.length; ++i) {
    for (var j = 0; j < asteroids.locations.length; ++j) {
      if (
        // determine if a bullet-to-asteroid collision exists
        isInside(
          spaceship.bulletSys.bullets[i],
          spaceship.bulletSys.diam,
          asteroids.locations[j],
          asteroids.diams[j]
        )
      ) {
        // destroy asteroid
        asteroids.destroy(j);
        // increment player score
        incrementScore();
      }
    }
  }
}

//////////////////////////////////////////////////
// helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB) {
  // determine total distance from center of object A to center of object B
  var distance = dist(locA.x, locA.y, locB.x, locB.y);
  // determine if object A and object B are colliding based on sum of radii and distance between centers
  return distance < sizeA / 2 + sizeB / 2;
}

//////////////////////////////////////////////////
function keyPressed() {
  if (keyIsPressed && keyCode === 32) {
    // if spacebar is pressed, fire
    spaceship.fire();
  }
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver() {
  fill(255);
  textSize(80);
  textAlign(CENTER);
  // display text in center of screen upon collision
  text("GAME OVER", width / 2, height / 2);
  noLoop();
}

// function that displays the number of asteroids hit
function displayPlayerScore() {
  fill(color(0, 255, 50));
  textSize(50);
  textAlign(CENTER, TOP);
  // indicate player score in top-left corner
  text("SCORE:" + " " + this.playerScore, 150, 50);
}

// function that increments the player's score counter when an asteroid is hit by a bullet
function incrementScore() {
  this.playerScore += 1;
}

// function that displays the current difficulty level of the game
function displayDifficultyLevel() {
  fill(color(40, 190, 130));
  textSize(30);
  textAlign(CENTER, TOP);
  // indicate difficulty level in top-left corner below player score
  text("LEVEL:" + " " + this.difficultyLevel, 195, 110);
}

// function that increments the difficulty level of the game
function incrementDifficultyLevel() {
  difficultyLevel += 1;
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky() {
  push();
  while (starLocs.length < 300) {
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (var i = 0; i < starLocs.length; i++) {
    rect(starLocs[i].x, starLocs[i].y, 2, 2);
  }

  if (random(1) < 0.3) starLocs.splice(int(random(starLocs.length)), 1);
  pop();
}
