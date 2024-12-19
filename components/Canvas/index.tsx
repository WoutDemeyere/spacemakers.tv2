'use client'

import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import p5 from 'p5';
import { FaExpand, FaTimes, FaEraser, FaTrash, FaSave } from 'react-icons/fa';
import { Button } from '@mantine/core';
import { ClipButton } from '@/pages/spacetree';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
  isEraser: boolean;
}

class CanvasManager {
  p: p5 | null = null;
  strokes: Stroke[] = [];
  currentStroke: Point[] = [];
  isDrawing: boolean = false;

  brushColor: string = '#F00FFF';
  brushSize: number = 30;
  isEraser: boolean = false;
  backgroundColor: number = 0;

  canvasParent: HTMLDivElement | null;
  socket: WebSocket | null = null;

  constructor(
    canvasParent: HTMLDivElement,
    brushColor: string,
    brushSize: number,
    isEraser: boolean,
    onSaveCallback: () => void
  ) {
    this.canvasParent = canvasParent;
    this.brushColor = brushColor;
    this.brushSize = brushSize;
    this.isEraser = isEraser;
    this.initSketch(onSaveCallback);
    this.initWebSocket();
  }

  initWebSocket () {
    // this.socket = new WebSocket(`ws://${window.location.hostname}:8088`);
    this.socket = new WebSocket('wss://spacetree-websocket-server-hidden-river-825.fly.dev');
    this.socket.onopen = () => {
      console.log('WebSocket connection for canvas established.');
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendCanvasAsBase64 () {
    if (this.p && this.socket && this.socket.readyState === WebSocket.OPEN) {
      const canvasElement = (this.p as any).canvas;
      const base64Image = canvasElement.toDataURL('image/png');
      const message = {
        type: 'canvas',
        data: base64Image,
        timestamp: Date.now()
      };
      this.socket.send(JSON.stringify(message));
    }
  }

  initSketch (onSaveCallback: () => void) {
    const sketch = (s: p5) => {
      // Base "logical" resolution
      const baseWidth = 1000;
      const baseHeight = 2000;

      // A function to resize the canvas keeping the aspect ratio
      const resizeCanvasToWindow = () => {
        // Compute scale factor to fit both width and height
        const scaleFactor = Math.min(
          window.innerWidth / baseWidth,
          (window.innerHeight - 60) / baseHeight
        );

        const newWidth = baseWidth * scaleFactor;
        const newHeight = baseHeight * scaleFactor;

        s.resizeCanvas(newWidth, newHeight);
        s.background(255);
      };

      s.setup = () => {
        s.createCanvas(baseWidth, baseHeight);
        s.pixelDensity(1); // Keep the pixel density consistent
        resizeCanvasToWindow();
        s.strokeCap(s.ROUND);
      };

      s.draw = () => {
        s.background(this.backgroundColor);
        s.noFill();
        
        for (const stroke of this.strokes) {
          s.stroke(stroke.isEraser ? s.color(0) : s.color(stroke.color));
          s.strokeWeight(stroke.size);
          if (stroke.points.length > 0) {
            s.beginShape();
            s.curveVertex(stroke.points[0].x, stroke.points[0].y);
            for (const point of stroke.points) {
              s.curveVertex(point.x, point.y);
            }
            const lastPoint = stroke.points[stroke.points.length - 1];
            s.curveVertex(lastPoint.x, lastPoint.y);
            s.endShape();
          }
        }
  
        if (this.currentStroke.length > 0) {
          s.stroke(this.isEraser ? s.color(0) : s.color(this.brushColor));
          s.strokeWeight(this.brushSize);
          s.beginShape();
          s.curveVertex(this.currentStroke[0].x, this.currentStroke[0].y);
          for (const point of this.currentStroke) {
            s.curveVertex(point.x, point.y);
          }
          const lastPoint = this.currentStroke[this.currentStroke.length - 1];
          s.curveVertex(lastPoint.x, lastPoint.y);
          s.endShape();
        }
      };

      // Mouse events
      s.mousePressed = () => {
        this.isDrawing = true;
        this.currentStroke = [];
        this.currentStroke.push({ x: s.mouseX, y: s.mouseY });
      };

      s.mouseDragged = () => {
        if (!this.isDrawing) return;
        this.currentStroke.push({ x: s.mouseX, y: s.mouseY });
        this.sendCanvasAsBase64();
      };

      s.mouseReleased = () => {
        if (this.isDrawing && this.currentStroke.length > 0) {
          this.strokes.push({
            points: [...this.currentStroke],
            color: this.brushColor,
            size: this.brushSize,
            isEraser: this.isEraser
          });
          this.currentStroke = [];
          this.sendCanvasAsBase64();
        }
        this.isDrawing = false;
      };

      // Touch events for mobile
      s.touchStarted = () => {
        this.isDrawing = true;
        this.currentStroke = [];
        this.currentStroke.push({ x: s.mouseX, y: s.mouseY });
        // no return false, allow normal event flow but we rely on touch-action CSS
      };

      s.touchMoved = () => {
        if (!this.isDrawing) return;
        this.currentStroke.push({ x: s.mouseX, y: s.mouseY });
        this.sendCanvasAsBase64();
      };

      s.touchEnded = () => {
        if (this.isDrawing && this.currentStroke.length > 0) {
          this.strokes.push({
            points: [...this.currentStroke],
            color: this.brushColor,
            size: this.brushSize,
            isEraser: this.isEraser
          });
          this.currentStroke = [];
          this.sendCanvasAsBase64();
        }
        this.isDrawing = false;
      };

      s.keyPressed = () => {
        if (s.key === 's' || s.key === 'S') {
          onSaveCallback();
        }
      };

      s.windowResized = () => {
        resizeCanvasToWindow();
      };

      // s.windowResized = () => {
      //   if (typeof window !== 'undefined') {
      //     canvasWidth = window.innerWidth;
      //     canvasHeight = window.innerHeight - 60;
      //     s.resizeCanvas(canvasWidth, canvasHeight);
      //     s.background(255);
      //   }
      // };
    };

    if (this.canvasParent) {
      this.p = new p5(sketch, this.canvasParent);
    }
  }

  updateBrush (brushColor: string, brushSize: number, isEraser: boolean) {
    this.brushColor = brushColor;
    this.brushSize = brushSize;
    this.isEraser = isEraser;
  }

  clearCanvas () {
    this.strokes = [];
    if (this.p) {
      this.p.background(255);
    }
  }

  saveDrawing () {
    const drawingData = JSON.stringify(this.strokes);
    const blob = new Blob([drawingData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'drawing.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  remove () {
    if (this.p) {
      this.p.remove();
    }
    if (this.socket) {
      this.socket.close();
    }
  }
}

const SpaceTreeCanvas: React.FC<{ executeRequest: (request: ClipButton) => void }> = (props) => {
  const sketchRef = useRef<HTMLDivElement | null>(null);
  const canvasManagerRef = useRef<CanvasManager | null>(null);

  const [brushColor, setBrushColor] = useState<string>('#0000FF');
  const [brushSize, setBrushSize] = useState<number>(50);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [forceClear, setForceClear] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const handleClearCanvas = () => {
    canvasManagerRef.current?.clearCanvas();
    setForceClear(!forceClear);
  };

  const handleSaveDrawing = () => {
    canvasManagerRef.current?.saveDrawing();
  };

  useEffect(() => {
    if (isFullScreen && sketchRef.current && !canvasManagerRef.current) {
      canvasManagerRef.current = new CanvasManager(
        sketchRef.current,
        brushColor,
        brushSize,
        isEraser,
        handleSaveDrawing
      );
    }
    return () => {
      if (!isFullScreen && canvasManagerRef.current) {
        canvasManagerRef.current.remove();
        canvasManagerRef.current = null;
      }
    };
  }, [isFullScreen]);

  useEffect(() => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.updateBrush(brushColor, brushSize, isEraser);
    }
  }, [brushColor, brushSize, isEraser]);

  useEffect(() => {
    if (forceClear && canvasManagerRef.current) {
      canvasManagerRef.current.clearCanvas();
    }
  }, [forceClear]);

  const buttonPressed = () => {
    window.scrollTo(0, 0);

    const button: ClipButton = {
      text: 'CANVAS',
      layerIndex: 3,
      clipIndex: 10
    }
    props.executeRequest(button);
    setIsFullScreen(true);
  }
  

  return (
    <div>
      {!isFullScreen ? (
        <Button
          onClick={() => buttonPressed()}
          style={{
            backgroundColor: 'white',
            color: 'black',
            width: '80px',
            height: '80px',
            borderRadius: '2px',
            padding: '0',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            margin: '20px'
          }}
        >
          <FaExpand />
        </Button>
      ) : (
        <div
          style={{
            height: '100vh',
            width: '100vw',
            margin: 0,
            padding: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            background: '#f0f0f0',
            overflow: 'hidden',
            zIndex: 10001
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              background: '#f0f0f0',
              borderBottom: '1px solid #ccc',
              position: 'relative',
              zIndex: 2000
            }}
          >
            <button
              onClick={() => setIsFullScreen(false)}
              style={{
                marginRight: '10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              <FaTimes />
            </button>
            <label style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '5px' }}>Color:</span>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => {
                  setIsEraser(false);
                  setBrushColor(e.target.value);
                }}
              />
            </label>
            <label style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '5px' }}>Size:</span>
              <input
                type="number"
                min={1}
                max={300}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                style={{ width: '50px' }}
              />
            </label>
            <button
              onClick={() => {
                setIsEraser(!isEraser);
              }}
              style={{
                marginRight: '10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
              }}
              title={isEraser ? 'Disable Eraser' : 'Use Eraser'}
            >
              <FaEraser style={{ color: isEraser ? 'red' : 'black' }} />
            </button>
            <button
              onClick={handleClearCanvas}
              style={{
                marginRight: '10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
              }}
              title="Clear Canvas"
            >
              <FaTrash />
            </button>
            <button
              onClick={handleSaveDrawing}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
              }}
              title="Save Drawing"
            >
              <FaSave />
            </button>
          </div>
          <div
            ref={sketchRef}
            style={{
              width: '100%',
              height: 'calc(100vh - 60px)',
              background: '#FFFFFF',
              zIndex: 1001,
              touchAction: 'none',
              bottom: 0
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SpaceTreeCanvas;