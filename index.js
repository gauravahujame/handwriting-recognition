const brain = require("brain.js");
var fs = require("fs");
// const sharp = require('sharp');
var mnist = require('mnist');
var PNG = require('png-js');

fs.readFile("training.model", function(err, buf) {
  const net = new brain.NeuralNetwork();
  const data = generateInputData();
  const inputData = data.training;
  // const testData = data.test[0];
  // console.log(JSON.stringify(testData.input));
  if (!buf) {
    net.train(inputData, {
      log: details => console.log(details),
    });
    const trainingModel = net.toJSON();
    fs.writeFile("training.model", JSON.stringify(trainingModel), (err) => {
      if(err) {
        console.log(`Error in writing model, ${err}`);
      }
    });
  } else {
    net.fromJSON(JSON.parse(buf));
  }

  getImageArr(pixArr => {
    // console.log(JSON.stringify(pixArr));
    const result = net.run(pixArr);
    // console.log(`Expected ${testData.output} Got ${result}`);
    console.log(`Your number is ${result.indexOf(Math.max(...result))}`);
    // console.log(`Your number is ${result}`);
  });
});

function generateInputData() {
  var set = mnist.set(8000, 2000);
  return {
    training: set.training,
    test: set.test,
  };
}

function getImageArr(cb) {
  PNG.decode('test.png', function(pixels) {
    const result = [];
    pixels.forEach((pix, i) => {
      if ((i % 4) == 0) {
        result.push(Math.round((pix/255) * 1000) / 1000);
      }
    });
    console.log(result.length)
    cb(result)
    // pixels is a 1d array (in rgba order) of decoded pixel data
  });
}