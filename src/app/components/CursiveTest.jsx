'use client';
import { useEffect, useState } from 'react';
import words from '/public/words.json'; // Adjust the path as needed

const CursiveTest = () => {
  const [word, setWord] = useState('');

  // Function to draw the text on the canvas
  const drawText = (ctx, canvas) => {
    let fontSize = Math.min(canvas.width, canvas.height) / 3; // Initial font size
    ctx.font = `${fontSize}px "Cedarville Cursive"`;
  
    let text = word;
    let textWidth = ctx.measureText(text).width;
  
    // Adjust font size if text width is greater than canvas width
    while (textWidth > canvas.width * 0.9) { // Leave some padding
      fontSize -= 1;
      ctx.font = `${fontSize}px "Cedarville Cursive"`;
      textWidth = ctx.measureText(text).width;
    }
  
    const textHeight = fontSize;
    const x = (canvas.width - textWidth) / 2;
    const y = (canvas.height + textHeight) / 2;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
    ctx.fillStyle = '#b0b0ae';
    ctx.fillText(text, x, y);
  };

  // Randomly select a word from the array on component mount
  useEffect(() => {
    const randomWord = words.last_words[Math.floor(Math.random() * words.last_words.length)];
    setWord(randomWord);
  }, []);

  // Handle drawing the word when the word or canvas size changes
  useEffect(() => {
    const canvas = document.getElementById('cursiveCanvas');
    const ctx = canvas.getContext('2d');

    const font = new FontFace('Cedarville Cursive', 'url(/fonts/CedarvilleCursive-Regular.ttf)');
    font.load().then(() => {
      document.fonts.add(font);
      if (word) {
        drawText(ctx, canvas);
      }
    });

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.7;
      canvas.height = window.innerHeight * 0.8;
      drawText(ctx, canvas);

      // Reapply brush settings after resizing
      ctx.strokeStyle = '#0c0c0b';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [word]);

  // Handle user drawing with a smoothed quadratic Bézier curve
  useEffect(() => {
    const canvas = document.getElementById('cursiveCanvas');
    const ctx = canvas.getContext('2d');
    let painting = false;

    let lastX = 0;
    let lastY = 0;
    let points = [];

    const startPosition = (e) => {
      painting = true;
      lastX = e.clientX - canvas.offsetLeft;
      lastY = e.clientY - canvas.offsetTop;
      points.push({ x: lastX, y: lastY });
      draw(e);
    };

    const endPosition = () => {
      painting = false;
      points = []; // Clear the points array when drawing stops
      ctx.beginPath();
    };

    // Set brush settings here, in case they're reset elsewhere
    ctx.strokeStyle = '#0c0c0b'; 
    ctx.lineWidth = 8; 
    ctx.lineCap = 'round'; 

    const draw = (e) => {
      if (!painting) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      points.push({ x, y });

      if (points.length < 3) {
        // We need at least 3 points to draw a curve
        return;
      }

      // Averaging the points to smooth the curve
      const p1 = points[points.length - 3];
      const p2 = points[points.length - 2];
      const p3 = points[points.length - 1];

      const cp1x = (p1.x + p2.x) / 2;
      const cp1y = (p1.y + p2.y) / 2;
      const cp2x = (p2.x + p3.x) / 2;
      const cp2y = (p2.y + p3.y) / 2;

      ctx.quadraticCurveTo(cp1x, cp1y, cp2x, cp2y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cp2x, cp2y);
    };

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    return () => {
      canvas.removeEventListener('mousedown', startPosition);
      canvas.removeEventListener('mouseup', endPosition);
      canvas.removeEventListener('mousemove', draw);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-blue-50 mt-2">
      <canvas id="cursiveCanvas" className="bg-white shadow-lg"></canvas>
    </div>
  );
};

export default CursiveTest;
