'use client'
import { useEffect } from 'react';

const CursiveTest = () => {
  const drawText = (ctx, canvas) => {
    // Set the font size dynamically based on canvas size
    const fontSize = Math.min(canvas.width, canvas.height) / 2; // Adjust size relative to canvas
    ctx.font = `${fontSize}px "Cedarville Cursive"`;

    // Measure the text size
    const text = 'H';
    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize; // The height is approximately equal to the font size

    // Calculate the position to center the text
    const x = (canvas.width - textWidth) / 2;
    const y = (canvas.height + textHeight) / 2;

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render the word "Hello" centered on the canvas
    ctx.fillStyle = '#b0b0ae';
    ctx.fillText(text, x, y);

    // Store the text image data
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = document.getElementById('cursiveCanvas');
    const ctx = canvas.getContext('2d');
    let painting = false;
    let textImageData;

    // Load the font and then proceed
    const font = new FontFace('Cedarville Cursive', 'url(/fonts/CedarvilleCursive-Regular.ttf)');
    font.load().then(() => {
      document.fonts.add(font);

      const resizeCanvas = () => {
        // Set the canvas dimensions relative to the viewport size
        canvas.width = window.innerWidth * 0.9; // 90% of viewport width
        canvas.height = window.innerHeight * 0.7; // 70% of viewport height

        // Redraw the text when the canvas size changes
        textImageData = drawText(ctx, canvas);
      };

      // Initial canvas setup
      resizeCanvas();

      // Redraw on window resize
      window.addEventListener('resize', resizeCanvas);

      // Set the stroke style for the user's drawing
      ctx.strokeStyle = '#0c0c0b'; // Color for the user's tracing input
      ctx.lineWidth = 5; // Thickness of the tracing brush
      ctx.lineCap = 'round'; // Smooth edges for the brush

      const startPosition = (e) => {
        painting = true;
        draw(e);
      };

      const endPosition = () => {
        painting = false;
        ctx.beginPath();
      };

      function draw(e) {
        if (!painting) return;

        // Get the mouse position relative to the canvas
        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;

        // Get the pixel data at the cursor position
        const pixelIndex = (y * canvas.width + x) * 4;
        const alpha = textImageData.data[pixelIndex + 3]; // Alpha value of the pixel

        // Only draw if the pixel is part of the text (alpha > 0)
        if (alpha > 0) {
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          // Break the path if the cursor leaves the text area
          ctx.beginPath();
        }
      }

      canvas.addEventListener('mousedown', startPosition);
      canvas.addEventListener('mouseup', endPosition);
      canvas.addEventListener('mousemove', draw);

      return () => {
        canvas.removeEventListener('mousedown', startPosition);
        canvas.removeEventListener('mouseup', endPosition);
        canvas.removeEventListener('mousemove', draw);
        window.removeEventListener('resize', resizeCanvas);
      };
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-blue-50">
      <canvas id="cursiveCanvas" className="bg-white shadow-lg"></canvas>
    </div>
  );
};

export default CursiveTest;
