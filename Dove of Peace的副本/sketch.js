// === Final Integrated Sketch with Music-Controlled Particle Motion, Size and Fade ===
let song, amp, fft, playButton;
let bird, bg;
let scaleFactor, offsetX, offsetY;
let blobs = [];
let isPlaying = false;
let isFading = false;

function preload() {
  song = loadSound("assets/music.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  amp = new p5.Amplitude();
  fft = new p5.FFT();
  playButton = createButton("Play/Stop Music");
  playButton.position(20, 20);
  playButton.mousePressed(toggleMusic);
  bg = new Background(300);
  updateTransforms();
}

function draw() {
  background(0, 0, 0, 20);
  let level = amp.getLevel();
  if (isPlaying) {
    bg.draw(level);
    autoGenerateBlobs(level); // 自动生成粒子（随节奏）
  }
  updateBlobs(level);
  bird.draw();
  drawOliveBranch(scaleFactor, offsetX, offsetY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateTransforms();
  bg.resize();
}

function updateTransforms() {
  scaleFactor = min(windowWidth, windowHeight) / 900;
  offsetX = windowWidth / 2 - (450 * scaleFactor);
  offsetY = windowHeight / 2 - (425 * scaleFactor);
  bird = new Bird(scaleFactor, offsetX, offsetY);
}

function toggleMusic() {
  if (song.isPlaying()) {
    song.stop();
    isPlaying = false;
    isFading = true;
  } else {
    song.play();
    isPlaying = true;
    isFading = false;
  }
}

function mousePressed() {
  if (!isPlaying) return;
  spawnBlobs(mouseX, mouseY);
}

function autoGenerateBlobs(level) {
  // 降低频率：frameCount % 10（每 10 帧最多生成一次）
  let threshold = 0.25;
  if (level > threshold && frameCount % 10 === 0) {
    let x = random(width);
    let y = random(height);
    spawnBlobs(x, y, level);
  }
}

function spawnBlobs(x, y, level = 0.2) {
  colorMode(HSB);
  // 减少每次生成数量范围（最多 15 个）
  let count = floor(map(level, 0, 0.5, 3, 15, true));
  let sizeBoost = map(level, 0, 0.5, 1, 2.5, true);

  for (let i = 0; i < count; i++) {
    let px = x + random(-50, 50);
    let py = y + random(-50, 50);
    let hue = random(360);
    let baseSize = random(2, 4) * sizeBoost;
    blobs.push({
      x: px,
      y: py,
      size: baseSize,
      baseSize: baseSize,
      color: color(hue, 80, 100),
      hue: hue,
      speed: p5.Vector.random2D().mult(random(0.5, 2)),
      trail: []
    });
  }
  colorMode(RGB);
}

function updateBlobs(level = 0) {
  colorMode(HSB);

  for (let i = blobs.length - 1; i >= 0; i--) {
    let b = blobs[i];

    if (isPlaying) {
      let speedScale = map(level, 0, 0.3, 0.5, 3, true);
      b.x += b.speed.x * speedScale;
      b.y += b.speed.y * speedScale;
      b.trail.push({ x: b.x, y: b.y, alpha: 255 });
      if (b.trail.length > 15) b.trail.shift();
    }

    let dynamicSize = b.baseSize * map(level, 0, 0.5, 1, 2.5, true);

    for (let t of b.trail) {
      stroke(hue(b.color), saturation(b.color), brightness(b.color), t.alpha);
      strokeWeight(dynamicSize);
      point(t.x, t.y);
      t.alpha *= isFading ? 0.90 : 0.85;
    }

    const stillVisible = b.trail.some(t => t.alpha > 5);
    if (!stillVisible) {
      blobs.splice(i, 1);
    }
  }

  colorMode(RGB);
}

class Bird {
  constructor(scaleFactor = 1, offsetX = 0, offsetY = 0) {
    this.scaleFactor = scaleFactor;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.colors = {
      pale: [233, 230, 226],
      black: [0, 0, 0],
      ghost: [220, 220, 220],
      white: [240, 234, 226],
      cream: [249, 249, 249],
      greylight: [234, 234, 234],
      grey: [221, 221, 221],
    };
  }

  applyTransform() {
    push();
    translate(this.offsetX, this.offsetY);
    scale(this.scaleFactor);
    noStroke();
  }

  draw() {
    this.applyTransform();
    this.drawHead();
    this.drawNape();
    this.drawNeck();
    this.drawBody();
    this.drawWing();
    this.drawTail();
    this.drawFeather();
    pop();
  }

  drawHead() {
    fill(this.colors.pale);
    beginShape();
    vertex(570,100);vertex(610,98);vertex(750,150);vertex(660,210);vertex(650,250);vertex(520,300);
    endShape(CLOSE);
    fill(this.colors.black);
    ellipse(605,140,35,35);
  }

  drawNape() {
    fill(this.colors.ghost);
    beginShape();
    vertex(450,200);vertex(520,300);vertex(570,100);
    endShape(CLOSE);
  }

  drawNeck() {
    fill(this.colors.ghost);
    beginShape();
    vertex(650,250);vertex(520,300);vertex(680,400);
    endShape(CLOSE);
  }

  drawBody() {
    fill(this.colors.greylight);
    beginShape();
    vertex(450,200);vertex(520,300);vertex(340,330);
    endShape(CLOSE);

    fill(this.colors.grey);
    beginShape();
    vertex(340,330);vertex(220,455);vertex(432,530);
    endShape(CLOSE);

    fill(this.colors.cream);
    beginShape();
    vertex(220,455);vertex(340,330);vertex(100,300);
    endShape(CLOSE);

    fill(this.colors.greylight);
    beginShape();
    vertex(680,400);vertex(650,500);vertex(520,300);
    endShape(CLOSE);

    fill(this.colors.white);
    beginShape();
    vertex(340,330);vertex(520,300);vertex(650,500);vertex(445,560);
    endShape(CLOSE);
  }

  drawWing() {
    fill(this.colors.pale);
    beginShape();
    vertex(340,330);vertex(230,200);vertex(433,220);
    endShape(CLOSE);

    fill(this.colors.cream);
    beginShape();
    vertex(230,200);vertex(100,50);vertex(340,80);
    endShape(CLOSE);

    fill(this.colors.grey);
    beginShape();
    vertex(340,80);vertex(450,200);vertex(433,220);vertex(230,200);
    endShape(CLOSE);
  }

  drawTail() {
    fill(this.colors.white);
    beginShape();
    vertex(220,455);vertex(100,630);vertex(80,550);vertex(0,520);vertex(181,405);
    endShape(CLOSE);
  }

  drawFeather() {
    fill(this.colors.ghost);
    beginShape();
    vertex(445,560);vertex(500,800);vertex(150,800);vertex(170,760);vertex(350,700);
    endShape(CLOSE);

    fill(this.colors.white);
    beginShape();
    vertex(170,760);vertex(350,700);vertex(350,501);vertex(300,483);
    endShape(CLOSE);

    fill(this.colors.greylight);
    beginShape();
    vertex(350,700);vertex(350,501);vertex(432,530);vertex(445,560);
    endShape(CLOSE);
  }
}

class Background {
  constructor(numDots = 300) {
    this.numDots = numDots;
    this.dots = [];
    this.initializeDots();
  }

  initializeDots() {
    this.dots = [];
    for (let i = 0; i < this.numDots; i++) {
      this.dots.push({
        x: random(width),
        y: random(height),
        size: random(2, 6),
        speed: p5.Vector.random2D().mult(random(0.3, 1))
      });
    }
  }

  draw(level = 0) {
    let scale = map(level, 0, 0.5, 1, 2);
    let spectrum = fft.analyze();
    let bass = fft.getEnergy("bass");
    let mid = fft.getEnergy("mid");
    let treble = fft.getEnergy("treble");

    for (let d of this.dots) {
      fill(bass, mid, treble, 80);
      circle(d.x, d.y, d.size * scale);
      d.x += d.speed.x;
      d.y += d.speed.y;
      if (d.x < -50 || d.x > width + 50 || d.y < -50 || d.y > height + 50) {
        d.x = random(width);
        d.y = random(height);
        d.speed = p5.Vector.random2D().mult(random(0.3, 1));
      }
    }
  }

  resize() {
    this.initializeDots();
  }
}

function drawOliveBranch(scaleFactor, offsetX, offsetY) {
  push();
  translate(offsetX, offsetY);
  scale(scaleFactor);
  stroke(34, 139, 34);
  strokeWeight(8);
  noFill();
  let centerX = 752;
  let centerY = 180;
  bezier(centerX, centerY + 80, centerX + 30, centerY - 25, centerX - 50, centerY - 120, centerX, centerY - 155);
  noStroke();
  fill(34, 139, 34);
  push(); translate(centerX - 3, centerY - 150); rotate(radians(-35)); drawLeaf(80); pop();
  push(); translate(centerX + 5, centerY - 20); rotate(radians(-20)); drawLeaf(80); pop();
  push(); translate(centerX - 81, centerY - 105); rotate(radians(30)); drawLeaf(80); pop();
  pop();
}

function drawLeaf(length) {
  beginShape();
  vertex(0, 0);
  bezierVertex(length * 0.25, -length * 0.5, length * 0.50, -length * 0.5, length, 0);
  bezierVertex(length * 0.75, length * 0.5, length * 0., length * 0.5, 0, 0);
  endShape(CLOSE);
}
