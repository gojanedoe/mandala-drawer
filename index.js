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
// let fraction = 4;

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

    // MIRROR LINE
    // Start line
    ctx.beginPath();
    ctx.moveTo(line.points[0].y, line.points[0].x);

    // Draw all points
    line.points.forEach((point) => {
      ctx.lineTo(point.y, point.x);
    });

    // Finish stroke
    ctx.stroke();
  });
};

const drawMirror = () => {
  // lines.forEach((line) => {
  //   ctx.lineWidth = line.size;
  //   ctx.strokeStyle = line.color;
  //   // Start line
  //   ctx.beginPath();
  //   ctx.moveTo(
  //     // canvas.height() / 2 + line.points[0].y,
  //     // canvas.width() / 2 + line.points[0].x
  //     line.points[0].y,
  //     line.points[0].x
  //   );
  //   console.log("copy height: ", "copy width: ");
  //   // Draw all points
  //   line.points.forEach((point) => {
  //     // ctx.lineTo(canvas.height() / 2 + point.y, canvas.width() / 2 + point.x);
  //     ctx.lineTo(point.y, point.x);
  //   });
  //   // Finish stroke
  //   ctx.stroke();
  // });
  // width
  //   lines.forEach((line) => {
  //     ctx.lineWidth = line.size;
  //     ctx.strokeStyle = line.color;
  //     // Start line
  //     ctx.beginPath();
  //     ctx.moveTo(canvas.width() - line.points[0].x, line.points[0].y);
  //     // Draw all points
  //     line.points.forEach((point) => {
  //       ctx.lineTo(canvas.width() - point.x, point.y);
  //     });
  //     // Finish stroke
  //     ctx.stroke();
  //   });
  //   lines.forEach((line) => {
  //     ctx.lineWidth = line.size;
  //     ctx.strokeStyle = line.color;
  //     // Start line
  //     ctx.beginPath();
  //     ctx.moveTo(line.points[0].x, canvas.height() - line.points[0].y);
  //     // Draw all points
  //     line.points.forEach((point) => {
  //       ctx.lineTo(point.x, canvas.height() - point.y);
  //     });
  //     // Finish stroke
  //     ctx.stroke();
  //   });
  //   lines.forEach((line) => {
  //     ctx.lineWidth = line.size;
  //     ctx.strokeStyle = line.color;
  //     // Start line
  //     ctx.beginPath();
  //     ctx.moveTo(
  //       canvas.width() - line.points[0].x,
  //       canvas.height() - line.points[0].y
  //     );
  //     // Draw all points
  //     line.points.forEach((point) => {
  //       ctx.lineTo(canvas.width() - point.x, canvas.height() - point.y);
  //     });
  //     // Finish stroke
  //     ctx.stroke();
  //   });
  //   lines.forEach((line) => {
  //     ctx.lineWidth = line.size;
  //     ctx.strokeStyle = line.color;
  //     // Start line
  //     ctx.beginPath();
  //     ctx.moveTo(line.points[0].y, line.points[0].x);
  //     // Draw all points
  //     line.points.forEach((point) => {
  //       ctx.lineTo(point.y, point.x);
  //     });
  //     // Finish stroke
  //     ctx.stroke();
  //   });
  //   lines.forEach((line) => {
  //     ctx.lineWidth = line.size;
  //     ctx.strokeStyle = line.color;
  //     // Start line
  //     ctx.beginPath();
  //     // ctx.moveTo(line.points[0].y, canvas.height() - line.points[0].x);
  //     ctx.moveTo(
  //       line.points[0].y,
  //       canvas.width() - (line.points[0].x / canvas.width()) * canvas.height()
  //     );
  //     // Draw all points
  //     line.points.forEach((point) => {
  //       // ctx.lineTo(point.y, canvas.height() - point.x);
  //       ctx.lineTo(
  //         line.points[0].y,
  //         canvas.width() - (line.points[0].x / canvas.width()) * canvas.height()
  //       );
  //     });
  //     // Finish stroke
  //     ctx.stroke();
  //   });
};

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

const init = () => {
  // Setup canvas
  canvas = $("#canvas");
  let containerW = $("#canvas-container").width();
  let containerH = $("#canvas-container").height();

  canvas.attr({
    width: containerW,
    height: containerH
  });

  // If width is smaller, square to that
  // if (containerW < containerH) {
  //   canvas.attr({
  //     width: containerW,
  //     height: containerW
  //   });
  // } else {
  //   canvas.attr({
  //     width: containerH,
  //     height: containerH
  //   });
  // }

  ctx = canvas[0].getContext("2d");
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

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
    }
  });

  $("#color-picker").on("input", () => {
    brush.color = $("#color-picker").val();
  });

  $("#brush-size").on("input", () => {
    brush.size = $("#brush-size").val();
    $("#brush-size-label").text(brush.size);
  });
};

$(init); // same as $(document).ready(init)
