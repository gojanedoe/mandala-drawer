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

const draw = (e) => {
  if (brush.isDown) {
    // Reset last point
    brush.lastX = e.offsetX;
    brush.lastY = e.offsetY;

    // Save new point's coordinates for line
    lines[lines.length - 1].points.push({ x: e.offsetX, y: e.offsetY });

    // Redraw
    drawSavedLines();
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
  });
};

const exportCanvas = () => {
  let win = window.open();
  let base64URL = canvas[0].toDataURL();
  win.document.write(
    '<iframe src="' +
      base64URL +
      '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
  );
};

const init = () => {
  // Setup canvas
  canvas = $("#canvas");
  canvas.attr({ width: window.innerWidth, height: window.innerHeight });
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
  });

  $(document).mouseup(() => {
    brush.isDown = false;
  });

  $("#save-btn").click(exportCanvas);

  $("#undo-btn").click(() => {
    lines.pop(); // Remove last stroke
    drawSavedLines();
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
