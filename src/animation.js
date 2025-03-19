document.addEventListener("DOMContentLoaded", function () {
  // Get the canvas
  const canvas = document.getElementById("canvas");
  if (!canvas) {
    console.error("Canvas element not found, creating one");
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.appendChild(canvas);
  }
  const ctx = canvas.getContext("2d");

  // Animation settings
  const settings = {
    width: 720,
    height: 1080,
    xspeed: 1.5,
    yspeed: 1.5,
    radius: 66,
    bgColor: "#fffefd",
  };

  // Set canvas dimensions
  canvas.width = settings.width;
  canvas.height = settings.height;

  // Logo position and color
  let x =
    settings.radius + Math.random() * (settings.width - 2 * settings.radius);
  let y =
    settings.radius + Math.random() * (settings.height - 2 * settings.radius);
  let xspeed = settings.xspeed;
  let yspeed = settings.yspeed;
  let currentColor = "#000000";

  // Load the SVG content
  fetch("public/logo.svg")
    .then((response) => response.text())
    .then((svgText) => {
      // Start animation once SVG is loaded
      startAnimation(svgText);
    })
    .catch((error) => {
      console.error("Error loading SVG:", error);
      // Fall back to a simple circle animation
      startFallbackAnimation();
    });

  function startAnimation(svgText) {
    // Function to create a colored version of the SVG
    function getColoredSVG(color) {
      // Create a version of the SVG with the fill color replaced
      // This is a simple approach that works for basic SVGs
      // For more complex SVGs, you might need more sophisticated parsing
      let coloredSVG = svgText.replace(/fill="[^"]*"/g, `fill="${color}"`);

      // Also handle SVGs that use the style attribute for fill
      coloredSVG = coloredSVG.replace(
        /style="[^"]*fill:[^;]*;/g,
        `style="fill:${color};`
      );

      // For SVGs without explicit fill attributes, add the fill to the root element
      if (!coloredSVG.includes("fill=") && !coloredSVG.includes("style=")) {
        coloredSVG = coloredSVG.replace("<svg", `<svg fill="${color}"`);
      }

      return coloredSVG;
    }

    function animate() {
      // Clear canvas
      ctx.fillStyle = settings.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create colored SVG
      const coloredSVG = getColoredSVG(currentColor);

      // Convert SVG to image
      const img = new Image();
      const svgBlob = new Blob([coloredSVG], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;

      img.onload = function () {
        // Draw the SVG centered at the current position
        ctx.save();
        ctx.translate(x, y);
        ctx.drawImage(
          img,
          -settings.radius,
          -settings.radius,
          settings.radius * 2,
          settings.radius * 2
        );
        ctx.restore();

        // Clean up
        URL.revokeObjectURL(url);

        // Check for collisions with edges
        if (x < settings.radius || x > settings.width - settings.radius) {
          xspeed *= -1;
          currentColor = `rgb(${random255()}, ${random255()}, ${random255()})`;
        }

        if (y < settings.radius || y > settings.height - settings.radius) {
          yspeed *= -1;
          currentColor = `rgb(${random255()}, ${random255()}, ${random255()})`;
        }

        // Update position
        x += xspeed;
        y += yspeed;

        // Continue animation
        requestAnimationFrame(animate);
      };
    }

    // Start the animation
    animate();
  }

  function startFallbackAnimation() {
    function animate() {
      ctx.fillStyle = settings.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(x, y, settings.radius, 0, Math.PI * 2);
      ctx.fillStyle = currentColor;
      ctx.fill();

      // Check for collisions with edges
      if (x < settings.radius || x > settings.width - settings.radius) {
        xspeed *= -1;
        currentColor = `rgb(${random255()}, ${random255()}, ${random255()})`;
      }

      if (y < settings.radius || y > settings.height - settings.radius) {
        yspeed *= -1;
        currentColor = `rgb(${random255()}, ${random255()}, ${random255()})`;
      }

      // Update position
      x += xspeed;
      y += yspeed;

      // Continue animation
      requestAnimationFrame(animate);
    }

    // Start fallback animation
    animate();
  }

  // Helper function for random color values
  function random255() {
    return Math.floor(Math.random() * 256);
  }
});
