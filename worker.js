

let context;
let testData;

function setDrawingContext(d) {

  for (const command of d.commands) {
    const destX = command.x;
    const destY = command.y;
    if (command.type === 2) {
      context.moveTo(destX, destY);
    } else if (command.type === 16) {
      context.lineTo(destX, destY);
    } else if (command.type === 1) {
      context.closePath();
    } else {
      console.error('Command not implemented');
    }
  }
}

function drawSameStyle() {
  context.fillStyle = 'darkblue';
  context.strokeStyle = 'blue';
  context.beginPath();
  for (const data of testData) {
    setDrawingContext(data);
  }
  context.fill();
  context.stroke();
}

function drawSameStyleFragmented() {
  context.fillStyle = 'darkblue';
  context.strokeStyle = 'blue';
  context.beginPath();
  for (let i = 0; i < testData.length; i++) {
    setDrawingContext(testData[i]);
    if (i % 100 == 0) {
      context.fill();
      context.stroke();
      context.beginPath();
    }
  }
  context.closePath();
  context.fill();
  context.stroke();
}

function drawPaths() {
  context.fillStyle = 'darkblue';
  context.strokeStyle = 'blue';
  for (const data of testData) {
    context.fill(data.path2d);
    context.stroke(data.path2d);
  }
}

function drawPathsAppended() {
  context.fillStyle = 'darkblue';
  context.strokeStyle = 'blue';
  const allPath = new Path2D();
  for (const data of testData) {
    allPath.addPath(data.path2d);
  }
  context.fill(allPath);
  context.stroke(allPath);
}

onmessage = (evt) => {
  const canvas = evt.data.canvas;
  testData = evt.data.testData;
  testData.forEach(x => {
    x.path2d = new Path2D(x.pathString);
  });
  console.log('worker received', testData[0])
  context = canvas.getContext("2d");

  let t0 = performance.now();
  for (let i = 0; i < 100; i++) {
    drawSameStyle();
  }
  let t1 = performance.now();
  console.log(`Call to 100x drawSameStyle took ${t1 - t0} milliseconds.`);
  t0 = performance.now();
  for (let i = 0; i < 100; i++) {
    drawPaths();
  }
  t1 = performance.now();
  console.log(`Call to 100x drawPaths took ${t1 - t0} milliseconds.`);
  t0 = performance.now();
  for (let i = 0; i < 100; i++) {
    drawPathsAppended();
  }
  t1 = performance.now();
  console.log(`Call to 100x drawPathsAppended took ${t1 - t0} milliseconds.`);
  t0 = performance.now();
  for (let i = 0; i < 100; i++) {
    drawSameStyleFragmented();
  }
  t1 = performance.now();
  console.log(`Call to 100x drawSameStyleFragmented took ${t1 - t0} milliseconds.`);
};
