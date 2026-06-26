"use client";
import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: Node[] = [];
    let W = 0, H = 0;
    const mouse = { x: -1000, y: -1000 };

    function resize() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function makeNodes(n: number) {
      nodes = [];
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 1,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const accent = "59,130,246";
      const maxDist = 140;

      // Draw subtle glow at mouse position
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx!.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 60);
        gradient.addColorStop(0, `rgba(${accent}, 0.12)`);
        gradient.addColorStop(1, `rgba(${accent}, 0)`);
        ctx!.beginPath();
        ctx!.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();
      }

      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${accent},0.55)`;
        ctx!.fill();
      });

      // Draw connections between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.strokeStyle = `rgba(${accent},${(1 - dist / maxDist) * 0.2})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }

      // Draw connections to mouse
      if (mouse.x > 0 && mouse.y > 0) {
        nodes.forEach((n) => {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseMaxDist = 180;
          if (dist < mouseMaxDist) {
            ctx!.beginPath();
            ctx!.moveTo(n.x, n.y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.strokeStyle = `rgba(${accent},${(1 - dist / mouseMaxDist) * 0.35})`;
            ctx!.lineWidth = 1.2;
            ctx!.stroke();
          }
        });
      }

      animId = requestAnimationFrame(draw);
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function handleMouseLeave() {
      mouse.x = -1000;
      mouse.y = -1000;
    }

    function init() {
      resize();
      makeNodes(55);
      cancelAnimationFrame(animId);
      draw();
    }

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    init();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
