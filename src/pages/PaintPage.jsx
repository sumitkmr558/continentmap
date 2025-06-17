import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Slider,
  Tooltip,
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  styled,
} from "@mui/material";
import BrushIcon from "@mui/icons-material/Brush";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import LensIcon from "@mui/icons-material/Lens";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

const TOOLS = {
  BRUSH: "brush",
  ERASER: "eraser",
  LINE: "line",
  RECTANGLE: "rectangle",
  RECTANGLE_FILL: "rectangle_fill",
  CIRCLE: "circle",
  CIRCLE_FILL: "circle_fill",
  FILL: "fill",
};

const ToolButton = styled(IconButton)(({ theme, selected }) => ({
  color: selected ? theme.palette.success.main : theme.palette.text.primary,
  border: selected
    ? `2px solid ${theme.palette.success.main}`
    : "2px solid transparent",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  marginRight: theme.spacing(1),
}));

function PaintPage() {
  const theme = useTheme();

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });

  const [tool, setTool] = useState(TOOLS.BRUSH);
  const [strokeColor, setStrokeColor] = useState("#10b981");
  const [fillColor, setFillColor] = useState("#10b981");
  const [brushSize, setBrushSize] = useState(8);
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  // Save current canvas to undo stack
  const saveState = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const canvas = canvasRef.current;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.current.push(imgData);
    // Limit undo stack length
    if (undoStack.current.length > 50) undoStack.current.shift();
    // Clear redo on new action
    redoStack.current = [];
  };

  // Undo function
  const undo = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || undoStack.current.length === 0) return;

    // Move current state to redo before undo
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    redoStack.current.push(currentData);

    // Apply last undo state
    const imgData = undoStack.current.pop();
    ctx.putImageData(imgData, 0, 0);
  };

  // Redo function
  const redo = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || redoStack.current.length === 0) return;

    // Move current state to undo before redo
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.current.push(currentData);

    // Apply last redo state
    const imgData = redoStack.current.pop();
    ctx.putImageData(imgData, 0, 0);
  };

  // Resize canvas to fill available space
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;

    const width = parent.clientWidth;
    const height =
      window.innerHeight -
      // AppBar height (64px default) spacing safe margin
      64 -
      16;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    // If context changed (initial load or resize), reapply styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctxRef.current = ctx;

    // Optionally fill white background on start or resize:
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // After resize, save state so it's undoable
    saveState();
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Update strokeStyle and lineWidth according to selected tool and color
  useEffect(() => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    if (tool === TOOLS.ERASER) {
      ctx.strokeStyle = "white";
    } else {
      ctx.strokeStyle = strokeColor;
    }
    ctx.lineWidth = brushSize;
  }, [strokeColor, brushSize, tool]);

  // Drawing helpers:

  const drawLine = (ctx, from, to, color, size) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const drawRect = (ctx, start, end, strokeColor, fillColor, size, fill) => {
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const w = Math.abs(start.x - end.x);
    const h = Math.abs(start.y - end.y);
    ctx.lineWidth = size;
    if (fill) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, w, h);
    }
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(x, y, w, h);
  };

  const drawCircle = (ctx, start, end, strokeColor, fillColor, size, fill) => {
    const centerX = (start.x + end.x) / 2;
    const centerY = (start.y + end.y) / 2;
    const radiusX = Math.abs(start.x - end.x) / 2;
    const radiusY = Math.abs(start.y - end.y) / 2;
    const radius = Math.min(radiusX, radiusY);
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius, 0, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  };

  // Flood fill algorithm (simplified)
  const floodFill = (
    ctx,
    canvasWidth,
    canvasHeight,
    startX,
    startY,
    fillColor
  ) => {
    const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imgData.data;
    const pixelPos = (y, x) => (y * canvasWidth + x) * 4;

    const hexToRgba = (hex) => {
      let r = 0,
        g = 0,
        b = 0,
        a = 255;
      if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
      } else if (hex.length === 9) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
        a = parseInt(hex.slice(7, 9), 16);
      }
      return [r, g, b, a];
    };

    const targetPos = pixelPos(startY, startX);
    const targetColor = [
      data[targetPos],
      data[targetPos + 1],
      data[targetPos + 2],
      data[targetPos + 3],
    ];
    const fillRGBA = hexToRgba(fillColor);

    if (targetColor.every((v, i) => v === fillRGBA[i])) return;

    const stack = [[startX, startY]];
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) continue;
      const currentPos = pixelPos(y, x);
      const currentColor = [
        data[currentPos],
        data[currentPos + 1],
        data[currentPos + 2],
        data[currentPos + 3],
      ];
      if (!currentColor.every((v, i) => v === targetColor[i])) continue;

      data[currentPos] = fillRGBA[0];
      data[currentPos + 1] = fillRGBA[1];
      data[currentPos + 2] = fillRGBA[2];
      data[currentPos + 3] = fillRGBA[3];

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    ctx.putImageData(imgData, 0, 0);
  };

  // For pointer coordinates
  const pointerPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches.length) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // Preview canvas to show shapes while drawing
  const previewCanvasRef = useRef(null);
  const previewCtxRef = useRef(null);

  // Setup preview canvas overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const previewCanvas = document.createElement("canvas");
    previewCanvas.style.position = "absolute";
    previewCanvas.style.top = canvas.offsetTop + "px";
    previewCanvas.style.left = canvas.offsetLeft + "px";
    previewCanvas.style.pointerEvents = "none";
    previewCanvas.style.zIndex = 10;

    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;
    previewCanvas.style.width = canvas.style.width;
    previewCanvas.style.height = canvas.style.height;

    canvas.parentElement.style.position = "relative";
    canvas.parentElement.appendChild(previewCanvas);

    const ctx = previewCanvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    previewCanvasRef.current = previewCanvas;
    previewCtxRef.current = ctx;

    return () => {
      previewCanvas.remove();
    };
  }, []);

  const clearPreview = () => {
    if (!previewCtxRef.current) return;
    const ctx = previewCtxRef.current;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const drawPreviewShape = (start, current) => {
    if (!previewCtxRef.current) return;
    const ctx = previewCtxRef.current;
    clearPreview();

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;

    switch (tool) {
      case TOOLS.LINE:
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(current.x, current.y);
        ctx.stroke();
        break;
      case TOOLS.RECTANGLE:
        drawRect(ctx, start, current, strokeColor, fillColor, brushSize, false);
        break;
      case TOOLS.RECTANGLE_FILL:
        drawRect(ctx, start, current, strokeColor, fillColor, brushSize, true);
        break;
      case TOOLS.CIRCLE:
        drawCircle(
          ctx,
          start,
          current,
          strokeColor,
          fillColor,
          brushSize,
          false
        );
        break;
      case TOOLS.CIRCLE_FILL:
        drawCircle(
          ctx,
          start,
          current,
          strokeColor,
          fillColor,
          brushSize,
          true
        );
        break;
      default:
        break;
    }
  };

  // Pointer event handlers
  const pointerDown = (e) => {
    e.preventDefault();
    if (!ctxRef.current) return;

    drawing.current = true;
    const pos = pointerPosition(e);
    startPoint.current = pos;

    if (tool === TOOLS.BRUSH || tool === TOOLS.ERASER) {
      saveState();
      const ctx = ctxRef.current;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = tool === TOOLS.ERASER ? "white" : strokeColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === TOOLS.FILL) {
      saveState();
      floodFill(
        ctxRef.current,
        canvasRef.current.width,
        canvasRef.current.height,
        Math.floor(pos.x),
        Math.floor(pos.y),
        strokeColor
      );
      drawing.current = false; // no drag after fill
    } else if (
      tool === TOOLS.LINE ||
      tool === TOOLS.RECTANGLE ||
      tool === TOOLS.RECTANGLE_FILL ||
      tool === TOOLS.CIRCLE ||
      tool === TOOLS.CIRCLE_FILL
    ) {
      saveState();
      drawPreviewShape(pos, pos);
    }
  };

  const pointerMove = (e) => {
    e.preventDefault();
    if (!drawing.current || !ctxRef.current) return;
    const pos = pointerPosition(e);

    if (tool === TOOLS.BRUSH || tool === TOOLS.ERASER) {
      const ctx = ctxRef.current;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (
      tool === TOOLS.LINE ||
      tool === TOOLS.RECTANGLE ||
      tool === TOOLS.RECTANGLE_FILL ||
      tool === TOOLS.CIRCLE ||
      tool === TOOLS.CIRCLE_FILL
    ) {
      drawPreviewShape(startPoint.current, pos);
    }
  };

  const pointerUp = (e) => {
    e.preventDefault();
    if (!drawing.current || !ctxRef.current) return;
    drawing.current = false;
    const pos = pointerPosition(e);
    const ctx = ctxRef.current;
    clearPreview();

    if (tool === TOOLS.LINE) {
      drawLine(ctx, startPoint.current, pos, strokeColor, brushSize);
    } else if (tool === TOOLS.RECTANGLE) {
      drawRect(
        ctx,
        startPoint.current,
        pos,
        strokeColor,
        fillColor,
        brushSize,
        false
      );
    } else if (tool === TOOLS.RECTANGLE_FILL) {
      drawRect(
        ctx,
        startPoint.current,
        pos,
        strokeColor,
        fillColor,
        brushSize,
        true
      );
    } else if (tool === TOOLS.CIRCLE) {
      drawCircle(
        ctx,
        startPoint.current,
        pos,
        strokeColor,
        fillColor,
        brushSize,
        false
      );
    } else if (tool === TOOLS.CIRCLE_FILL) {
      drawCircle(
        ctx,
        startPoint.current,
        pos,
        strokeColor,
        fillColor,
        brushSize,
        true
      );
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!ctx) return;
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(
      0,
      0,
      canvas.width / (window.devicePixelRatio || 1),
      canvas.height / (window.devicePixelRatio || 1)
    );
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const imgURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgURL;
    link.download = "react-ms-paint.png";
    link.click();
  };

  // Tool icon mapping for better labels and accessibility
  const TOOL_ICONS = {
    [TOOLS.BRUSH]: <BrushIcon />,
    [TOOLS.ERASER]: <CleaningServicesIcon />,
    [TOOLS.LINE]: <ShowChartIcon />,
    [TOOLS.RECTANGLE]: <CropSquareIcon />,
    [TOOLS.RECTANGLE_FILL]: <CheckBoxIcon />,
    [TOOLS.CIRCLE]: <CircleOutlinedIcon />,
    [TOOLS.CIRCLE_FILL]: <LensIcon />,
    [TOOLS.FILL]: <FormatColorFillIcon />,
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static">
        <Toolbar variant="dense" sx={{ gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            React MS Paint
          </Typography>
          {Object.entries(TOOLS).map(([key, val]) => (
            <Tooltip
              key={val}
              title={
                val.charAt(0).toUpperCase() + val.slice(1).replace("_", " ")
              }
            >
              <ToolButton
                selected={tool === val}
                onClick={() => setTool(val)}
                aria-pressed={tool === val}
                color="inherit"
                size="large"
              >
                {TOOL_ICONS[val]}
              </ToolButton>
            </Tooltip>
          ))}

          <Tooltip title="Stroke Color">
            <input
              type="color"
              aria-label="Select stroke color"
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                padding: 0,
                marginLeft: 8,
              }}
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
            />
          </Tooltip>
          <Tooltip title="Fill Color (for shapes)">
            <input
              type="color"
              aria-label="Select fill color"
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                border: "none",
                cursor:
                  tool === TOOLS.RECTANGLE_FILL || tool === TOOLS.CIRCLE_FILL
                    ? "pointer"
                    : "not-allowed",
                opacity:
                  tool === TOOLS.RECTANGLE_FILL || tool === TOOLS.CIRCLE_FILL
                    ? 1
                    : 0.5,
                marginLeft: 8,
              }}
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              disabled={
                !(tool === TOOLS.RECTANGLE_FILL || tool === TOOLS.CIRCLE_FILL)
              }
            />
          </Tooltip>
          <Tooltip title="Brush Size">
            <Box sx={{ width: 120, px: 2 }}>
              <Slider
                aria-label="Brush size"
                value={brushSize}
                min={1}
                max={50}
                onChange={(e, val) => setBrushSize(val)}
                size="small"
                sx={{ color: theme.palette.success.main }}
              />
            </Box>
          </Tooltip>
          <Tooltip title="Undo">
            <IconButton
              onClick={undo}
              color="inherit"
              aria-label="Undo"
              size="large"
            >
              <UndoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton
              onClick={redo}
              color="inherit"
              aria-label="Redo"
              size="large"
            >
              <RedoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear">
            <IconButton
              onClick={clearCanvas}
              color="inherit"
              aria-label="Clear canvas"
              size="large"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save as PNG">
            <IconButton
              onClick={saveImage}
              color="inherit"
              aria-label="Save image"
              size="large"
            >
              <SaveAltIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, position: "relative" }}>
        <canvas
          ref={canvasRef}
          onMouseDown={pointerDown}
          onMouseMove={pointerMove}
          onMouseUp={pointerUp}
          onMouseLeave={pointerUp}
          onTouchStart={pointerDown}
          onTouchMove={pointerMove}
          onTouchEnd={pointerUp}
          aria-label="Drawing canvas"
          tabIndex={0}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderRadius: 2,
            touchAction: "none",
            display: "block",
          }}
        />
      </Box>
    </Box>
  );
}

export default PaintPage;
