let canvas;
let ctx;
let brush = {
  color: "#000",
  size: 10,
  isDown: false,
  lastX: 0,
  lastY: 0
};
let lines = [];
let guidesOn = false;

const draw = (e) => {
  if (brush.isDown) {
    // Reset last point
    brush.lastX = e.offsetX;
    brush.lastY = e.offsetY;

    // Save new point's coordinates for line
    lines[lines.length - 1].points.push({ x: e.offsetX, y: e.offsetY });

    // Redraw
    drawSavedLines();
    // drawMirror();
  }
};

const drawSavedLines = () => {
  ctx.clearRect(0, 0, canvas.width(), canvas.height()); // Clear canvas

  // Redraw lines
  lines.forEach((line) => {
    // Set line color and size
    ctx.lineWidth = line.size;
    ctx.strokeStyle = line.color;

    // Start line
    ctx.beginPath();
    ctx.moveTo(line.points[0].x, line.points[0].y);

    // Draw all points
    line.points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });

    // Finish stroke
    ctx.stroke();

    // ------ 1ST MIRROR LINE ------
    ctx.beginPath();
    ctx.moveTo(line.points[0].y, line.points[0].x);
    line.points.forEach((point) => {
      ctx.lineTo(point.y, point.x);
    });
    ctx.stroke();

    // ------ 2ND MIRROR LINE ------
    ctx.beginPath();
    ctx.moveTo(canvas.width() - line.points[0].x, line.points[0].y);
    line.points.forEach((point) => {
      ctx.lineTo(canvas.width() - point.x, point.y);
    });
    ctx.stroke();

    // ------ 3RD MIRROR LINE ------
    ctx.beginPath();
    ctx.moveTo(line.points[0].x, canvas.height() - line.points[0].y);
    line.points.forEach((point) => {
      ctx.lineTo(point.x, canvas.height() - point.y);
    });
    ctx.stroke();

    // ------ 4TH MIRROR LINE ------
    ctx.beginPath();
    ctx.moveTo(
      canvas.width() - line.points[0].x,
      canvas.height() - line.points[0].y
    );
    line.points.forEach((point) => {
      ctx.lineTo(canvas.width() - point.x, canvas.height() - point.y);
    });
    ctx.stroke();

    // ------ 5TH MIRROR LINE ------
    ctx.beginPath();
    ctx.moveTo(
      canvas.height() - line.points[0].y,
      canvas.width() - line.points[0].x
    );
    line.points.forEach((point) => {
      ctx.lineTo(canvas.height() - point.y, canvas.width() - point.x);
    });
    ctx.stroke();

    // ------ 6TH MIRROR LINE ------
    ctx.beginPath();
    ctx.moveTo(canvas.height() - line.points[0].y, line.points[0].x);
    line.points.forEach((point) => {
      ctx.lineTo(canvas.height() - point.y, point.x);
    });
    ctx.stroke();

    // ------ 7TH MIRROR LINE ------
    ctx.beginPath();
    ctx.moveTo(line.points[0].y, canvas.width() - line.points[0].x);
    line.points.forEach((point) => {
      ctx.lineTo(point.y, canvas.width() - point.x);
    });
    ctx.stroke();
  });

  if (guidesOn) {
    drawAxis();
  }
  // drawAxis();
};

const drawMirror = () => {};

const exportCanvas = () => {
  let win = window.open();
  let base64URL = canvas[0].toDataURL();
  // Full width and height version:
  // win.document.write(
  //   '<iframe src="' +
  //     base64URL +
  //     '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
  // );
  win.document.write(
    '<iframe src="' +
      base64URL +
      '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:' +
      canvas.width() +
      "px; height:" +
      canvas.height() +
      'px;" allowfullscreen></iframe>'
  );
};

const drawAxis = () => {
  // More info: https://stackoverflow.com/questions/67205161/how-to-translate-mouse-x-y-coordinates-to-move-html-element-inside-a-container-w

  let radius = canvas.width() / 2;

  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;

  let angleNum = 4;
  let angleDelta = (Math.PI * 2) / angleNum;

  for (let i = 0; i < angleNum; i++) {
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.lineTo(
      radius + Math.cos(angleDelta * i) * radius,
      radius + Math.sin(angleDelta * i) * radius
    );
    ctx.stroke();
  }
};

const init = () => {
  // Setup canvas
  canvas = $("#canvas");
  let containerW = $("#canvas-container").width();
  let containerH = $("#canvas-container").height();

  canvas.attr({
    width: containerW,
    height: containerH
  });

  // Create square canvas using smallest side (width or height)
  if (containerW < containerH) {
    canvas.attr({
      width: containerW,
      height: containerW
    });
  } else {
    canvas.attr({
      width: containerH,
      height: containerH
    });
  }

  ctx = canvas[0].getContext("2d");

  // Center origin
  // From: https://stackoverflow.com/questions/29742350/write-0-0-in-center-of-the-canvas-html5
  // ctx.translate(containerW / 2, containerH / 2);

  // drawAxis();

  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Set if axis are on
  guidesOn = $("#guides-btn").is(":checked");
  if (guidesOn) {
    drawAxis();
  }

  // Set initial color
  brush.color = $("#color-picker").val();

  // Setup event handlers
  canvas.mousemove((e) => {
    draw(e);
  });

  canvas.mousedown((e) => {
    // Save brush settings
    brush = {
      color: $("#color-picker").val(),
      size: $("#brush-size").val(),
      isDown: true,
      lastX: e.offsetX,
      lastY: e.offsetY
    };

    // Use brush settings for line
    ctx.lineWidth = brush.size;
    ctx.strokeStyle = brush.color;

    // Start new line
    ctx.beginPath();
    ctx.moveTo(brush.lastX, brush.lastY);

    // Save start of new line
    lines.push({
      color: brush.color,
      size: brush.size,
      points: [{ x: e.offsetX, y: e.offsetY }]
    });

    drawSavedLines();
    drawMirror();
  });

  $(document).mouseup(() => {
    brush.isDown = false;
  });

  $("#save-btn").click(exportCanvas);

  $("#undo-btn").click(() => {
    lines.pop(); // Remove last stroke
    drawSavedLines();
    drawMirror();
  });

  $("#clear-btn").click(() => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      lines = [];
      ctx.clearRect(0, 0, canvas.width(), canvas.height()); // Clear canvas

      if (guidesOn) {
        drawAxis();
      }
    }
  });

  $("#color-picker").on("input", () => {
    brush.color = $("#color-picker").val();
  });

  $("#brush-size").on("input", () => {
    brush.size = $("#brush-size").val();
    $("#brush-size-label").text(brush.size);
  });

  $("#guides-btn").on("input", () => {
    guidesOn = $("#guides-btn").is(":checked");
    drawSavedLines();
  });
};

$(init); // same as $(document).ready(init)
