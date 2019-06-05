let x;
let y;

let xspeed;
let yspeed;

let dvd;
var song;

let r, g, b;

let sheight = window.screen.height;
let swidth = window.screen.width;

function preload() {
  dvd = loadImage("../xo/fataDeProst.png");
  song = loadSound("sound/music.ogg");
}

// varianta classica de button pentru ca cacatul ala de p5 button nu merge

var un_mute = document.getElementById("un-mute");

un_mute.onclick = function() {
  if (song.isPlaying() == true) {
    song.pause();
  } else {
    song.play();
  }
};

function setup() {
  background("#15181f");
  createCanvas(windowWidth, windowHeight);
  x = random(width);
  y = random(height);
  xspeed = 8;
  yspeed = 8;
  pickColor();
}

function pickColor() {
  r = random(50, 256);
  g = random(0, 256);
  b = random(0, 256);
}

function draw() {
  background("#15181f");
  tint(r, g, b);
  x = x + xspeed;
  y = y + yspeed;
  if (swidth < 800) {
    image(dvd, x, y, dvd.width / 2, dvd.height / 2);
    if (x + dvd.width / 2 >= width) {
      xspeed = -xspeed;
      x = width - dvd.width / 2;
      pickColor();
    } else if (x <= 0) {
      xspeed = -xspeed;
      x = 0;
      pickColor();
    }

    if (y + dvd.height / 2 >= height) {
      yspeed = -yspeed;
      y = height - dvd.height / 2;
      pickColor();
    } else if (y <= 0) {
      yspeed = -yspeed;
      y = 0;
      pickColor();
    }
  } else {
    image(dvd, x, y);
    if (x + dvd.width >= width) {
      xspeed = -xspeed;
      x = width - dvd.width;
      pickColor();
    } else if (x <= 0) {
      xspeed = -xspeed;
      x = 0;
      pickColor();
    }

    if (y + dvd.height >= height) {
      yspeed = -yspeed;
      y = height - dvd.height;
      pickColor();
    } else if (y <= 0) {
      yspeed = -yspeed;
      y = 0;
      pickColor();
    }
  }
}
