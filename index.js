let canvas;
let ctx;
let brush = {
  x: 0,
  y: 0,
  color: "#000",
  size: 10,
  down: false
};
let strokes = [];
let currentStroke = null;

const redraw = () => {
  ctx.clearRect(0, 0, canvas.width(), canvas.height());

  $(strokes).each((index, stroke) => {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    $(stroke.points).each((index, point) => {
      ctx.lineTo(point.x, point.y);
    });

    ctx.stroke();
  });
};

const init = () => {
  canvas = $("#drawing-board");
  canvas.attr({ width: window.innerWidth, height: window.innerHeight });
  ctx = canvas[0].getContext("2d");

  // Set initial color
  // works: brush.color = $("#color-picker")[0].value;
  brush.color = $("#color-picker").val();

  const setBrushCoord = (e) => {
    brush.x = e.offsetX;
    brush.y = e.offsetY;

    currentStroke.points.push({
      x: brush.x,
      y: brush.y
    });

    redraw();
  };

  $(canvas)
    .mousedown((e) => {
      brush.down = true;
      currentStroke = { color: brush.color, size: brush.size, points: [] };
      strokes.push(currentStroke);
      setBrushCoord(e);
    })
    .mouseup((e) => {
      brush.down = false;
      currentStroke = null;
      setBrushCoord(e);
    })
    .mousemove((e) => {
      if (brush.down) setBrushCoord(e);
    });

  $("#save-btn").click(() => {
    // window.open(canvas[0].toDataURL()); -> Does not work on Chrome

    // Work around for Chrome:
    let win = window.open();
    let base64URL = canvas[0].toDataURL();
    win.document.write(
      '<iframe src="' +
        base64URL +
        '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
    );
  });

  $("#undo-btn").click(() => {
    strokes.pop(); // remove last stroke
    redraw();
  });

  $("#clear-btn").click(() => {
    strokes = [];
    redraw();
  });

  $("#color-picker").on("input", () => {
    brush.color = $("#color-picker").val();
  });

  // Also works:
  // $("#color-picker").change(() => {
  //   //.on("change", (e) => {
  //   brush.color = $("#color-picker").val();
  // });
};

$(init); // same as $(document).ready(init)
