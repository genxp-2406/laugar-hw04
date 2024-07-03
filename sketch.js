let data;
let ImgCrop;
let colors = [];
let song;
let fft;

function preload() {
  //load JSON data, Image and sound

  data = loadJSON(
    "https://genxp-2406.github.io/assets/datasets/Motor-Vehicle-Crashes/Motor-Vehicle-Crashes.json"
  );

  ImgCrop = loadImage("image.jpg");
  song = loadSound("song.mp3");
}

function setup() {
  let mw = min(windowWidth, 800);
  createCanvas(mw, windowHeight);

  // I only want to use the first 500 objects in order to simplify
  data = Object.values(data).slice(0, 500);

  ImgCrop.resize(width, 0);
  ImgCrop = ImgCrop.get(0, ImgCrop.height - height, width, height);

  generateColors();

  //analyze the sound
  fft = new p5.FFT();

  //initialize the song
  userStartAudio();
  song.play();
}

function draw() {
  background(220);

  // Show the image
  image(ImgCrop, 0, 0);

  //Obtain the song spectrum
  let spectrum = fft.analyze();

  for (let i = 0; i < data.length; i++) {
    //Obtain the latitude and longitude of the current object
    let latitude = data[i].LATITUDE;
    let longitude = data[i].LONGITUDE;

    // Convert latitude and longitude to screen coordinates
    let x = map(longitude, -74, -73.7, 0, width);
    let y = map(latitude, 40.55, 40.9, 0, height);

    //Define an amplitude based in the song spectrum
    let amplitude = map(spectrum[i % spectrum.length], 0, 255, 10, 100);
    //Obtain the corresponding color
    let col = colors[i];
    //draw the wave
    drawWave(y, amplitude, col);
  }
}

function generateColors() {
  ImgCrop.loadPixels();

  // Get colors from the image and store in the array 'colors'.
  for (let i = 0; i < 500; i++) {
    // Consider only the first 500 objects of JSON
    let x = map(i, 0, 500, 0, ImgCrop.width - 1);
    // Use floor to secure an integer
    let y = floor(random(ImgCrop.height));
    let col = ImgCrop.get(x, y);
    colors.push(col);
  }
}

function drawWave(y, amplitude, col) {
  stroke(col);
  noFill();
  beginShape();

  for (let x = 0; x < width+16; x+=16) {
    let angle = map(x, 0, width, 0, TWO_PI);
    let yOffset = sin(angle) * amplitude;
    vertex(x, y + yOffset);
  }
  endShape();
}
