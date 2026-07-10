"use client";
import { useEffect, useRef } from "react";

/* ─── Node Types ─────────────────────────────────────────── */
type NodeType = "router" | "switch" | "server";

interface NetNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  type: NodeType;
}

interface Packet {
  from: number;
  to: number;
  t: number;          // progress 0 → 1
  speed: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
}

/* ─── Colour palette ─────────────────────────────────────── */
const COLORS = {
  router: { fill: "59,130,246",  glow: "59,130,246",  glowR: 18 },  // blue
  switch: { fill: "6,182,212",   glow: "6,182,212",   glowR: 10 },  // cyan
  server: { fill: "148,163,184", glow: null,           glowR: 0  },  // slate
};

const PACKET_COLORS: Record<NodeType, string> = {
  router: "rgba(99,179,255,0.95)",
  switch: "rgba(103,232,249,0.9)",
  server: "rgba(200,215,230,0.7)",
};

/* ─── Hex grid helper ────────────────────────────────────── */
function hexPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    const px = cx + r * Math.cos(a);
    const py = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/* ─── Rounded rect helper ────────────────────────────────── */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, rad: number
) {
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.arcTo(x + w, y, x + w, y + rad, rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.arcTo(x + w, y + h, x + w - rad, y + h, rad);
  ctx.lineTo(x + rad, y + h);
  ctx.arcTo(x, y + h, x, y + h - rad, rad);
  ctx.lineTo(x, y + rad);
  ctx.arcTo(x, y, x + rad, y, rad);
  ctx.closePath();
}

/* ─── Main component ─────────────────────────────────────── */
export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: NetNode[] = [];
    let packets: Packet[] = [];
    let W = 0, H = 0;
    const mouse = { x: -1000, y: -1000 };
    let paused = false;
    let frame = 0;

    /* ── node count by screen ── */
    const nodeCount = () => (window.innerWidth < 768 ? 28 : 52);
    const maxPackets = () => (window.innerWidth < 768 ? 6 : 15);

    function resize() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function pickType(): NodeType {
      const r = Math.random();
      if (r < 0.15) return "router";
      if (r < 0.40) return "switch";
      return "server";
    }

    function makeNodes(n: number) {
      nodes = [];
      for (let i = 0; i < n; i++) {
        const type = pickType();
        const r = type === "router" ? 6 + Math.random() * 3
                : type === "switch" ? 3.5 + Math.random() * 2.5
                : 1.5 + Math.random() * 2;
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * (type === "router" ? 0.18 : 0.35),
          vy: (Math.random() - 0.5) * (type === "router" ? 0.18 : 0.35),
          r, type,
        });
      }
      packets = [];
    }

    /* ── spawn a packet along an active edge ── */
    function spawnPacket() {
      const maxDist = 150;
      const candidates: [number, number][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < maxDist * maxDist) {
            candidates.push([i, j]);
          }
        }
      }
      if (candidates.length === 0) return;
      const [a, b] = candidates[Math.floor(Math.random() * candidates.length)];
      const src = nodes[a];
      packets.push({
        from: a, to: b,
        t: 0,
        speed: 0.003 + Math.random() * 0.006,
        color: PACKET_COLORS[src.type],
        size: src.type === "router" ? 3 : src.type === "switch" ? 2.2 : 1.8,
        trail: [],
      });
    }

    /* ── draw the background grid ── */
    function drawGrid() {
      const spacing = 48;
      ctx!.save();
      ctx!.strokeStyle = "rgba(59,130,246,0.035)";
      ctx!.lineWidth = 1;
      for (let x = 0; x < W; x += spacing) {
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, H); ctx!.stroke();
      }
      for (let y = 0; y < H; y += spacing) {
        ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(W, y); ctx!.stroke();
      }
      ctx!.restore();
    }

    /* ── draw hex corner decorations ── */
    function drawHexCorners() {
      ctx!.save();
      ctx!.strokeStyle = "rgba(59,130,246,0.045)";
      ctx!.lineWidth = 1;
      const hexR = 32;
      const gap  = hexR * 1.8;
      // top-left cluster
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const cx = col * gap * 0.9 - hexR;
          const cy = row * gap * 0.9 - hexR + (col % 2 === 0 ? 0 : gap * 0.45);
          hexPath(ctx!, cx, cy, hexR);
          ctx!.stroke();
        }
      }
      // bottom-right cluster
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const cx = W - col * gap * 0.9 + hexR;
          const cy = H - row * gap * 0.9 + hexR - (col % 2 === 0 ? 0 : gap * 0.45);
          hexPath(ctx!, cx, cy, hexR);
          ctx!.stroke();
        }
      }
      ctx!.restore();
    }

    /* ── central radial glow ── */
    function drawCenterGlow() {
      const cx = W / 2, cy = H / 2;
      const r  = Math.min(W, H) * 0.55;
      const g  = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   "rgba(15,30,70,0.55)");
      g.addColorStop(0.5, "rgba(10,20,50,0.25)");
      g.addColorStop(1,   "rgba(2,8,23,0)");
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);
    }

    /* ── draw a single node by type ── */
    function drawNode(n: NetNode) {
      const c = COLORS[n.type];
      const fillRgb = c.fill;

      // glow
      if (c.glow && c.glowR > 0) {
        const g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, c.glowR * 2.5);
        g.addColorStop(0, `rgba(${c.glow},0.30)`);
        g.addColorStop(1, `rgba(${c.glow},0)`);
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, c.glowR * 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = g;
        ctx!.fill();
      }

      if (n.type === "router") {
        // outer ring
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${fillRgb},0.9)`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        // inner dot
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r * 0.35, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${fillRgb},1)`;
        ctx!.fill();
        // cross lines
        ctx!.beginPath();
        ctx!.moveTo(n.x - n.r, n.y); ctx!.lineTo(n.x + n.r, n.y);
        ctx!.moveTo(n.x, n.y - n.r); ctx!.lineTo(n.x, n.y + n.r);
        ctx!.strokeStyle = `rgba(${fillRgb},0.45)`;
        ctx!.lineWidth = 0.8;
        ctx!.stroke();
      } else if (n.type === "switch") {
        const hw = n.r * 1.6, hh = n.r * 0.9;
        roundRect(ctx!, n.x - hw, n.y - hh, hw * 2, hh * 2, 2);
        ctx!.fillStyle = `rgba(${fillRgb},0.15)`;
        ctx!.fill();
        ctx!.strokeStyle = `rgba(${fillRgb},0.8)`;
        ctx!.lineWidth = 1.2;
        ctx!.stroke();
        // port dots
        for (let p = -1; p <= 1; p++) {
          ctx!.beginPath();
          ctx!.arc(n.x + p * n.r * 0.9, n.y, n.r * 0.22, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${fillRgb},0.9)`;
          ctx!.fill();
        }
      } else {
        // server / host — simple circle
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${fillRgb},0.55)`;
        ctx!.fill();
      }
    }

    /* ── draw edges ── */
    function drawEdges() {
      const maxDist = 150;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            const bothRouter = nodes[i].type !== "server" || nodes[j].type !== "server";
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.strokeStyle = bothRouter
              ? `rgba(59,130,246,${alpha * 1.6})`
              : `rgba(148,163,184,${alpha})`;
            ctx!.lineWidth = bothRouter ? 0.9 : 0.5;
            ctx!.stroke();
          }
        }
      }
    }

    /* ── draw mouse connections ── */
    function drawMouseEdges() {
      if (mouse.x < 0) return;
      const mouseMaxDist = 180;
      nodes.forEach((n) => {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseMaxDist) {
          ctx!.beginPath();
          ctx!.moveTo(n.x, n.y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.strokeStyle = `rgba(59,130,246,${(1 - dist / mouseMaxDist) * 0.4})`;
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
      });

      // mouse glow
      const g = ctx!.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 70);
      g.addColorStop(0, "rgba(59,130,246,0.10)");
      g.addColorStop(1, "rgba(59,130,246,0)");
      ctx!.beginPath();
      ctx!.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
      ctx!.fillStyle = g;
      ctx!.fill();
    }

    /* ── tick & draw packets ── */
    function tickPackets() {
      // spawn
      if (packets.length < maxPackets() && Math.random() < 0.04) spawnPacket();

      const maxDist = 150;
      packets = packets.filter((p) => {
        const a = nodes[p.from], b = nodes[p.to];
        const dx = a.x - b.x, dy = a.y - b.y;
        if (Math.sqrt(dx * dx + dy * dy) > maxDist) return false; // edge gone
        p.t += p.speed;
        return p.t <= 1.02;
      });

      packets.forEach((p) => {
        const a = nodes[p.from], b = nodes[p.to];
        const cx = a.x + (b.x - a.x) * p.t;
        const cy = a.y + (b.y - a.y) * p.t;

        // trail — keep last 8 positions
        p.trail.push({ x: cx, y: cy });
        if (p.trail.length > 8) p.trail.shift();

        // draw trail
        for (let i = 1; i < p.trail.length; i++) {
          const alpha = (i / p.trail.length) * 0.55;
          ctx!.beginPath();
          ctx!.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
          ctx!.lineTo(p.trail[i].x, p.trail[i].y);
          ctx!.strokeStyle = p.color.replace("0.95", `${alpha}`).replace("0.9", `${alpha}`).replace("0.7", `${alpha}`);
          ctx!.lineWidth = p.size * 0.7;
          ctx!.stroke();
        }

        // draw packet head
        ctx!.beginPath();
        ctx!.arc(cx, cy, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.fill();

        // head glow
        const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, p.size * 3);
        g.addColorStop(0, p.color.replace("0.95", "0.4").replace("0.9", "0.35").replace("0.7", "0.25"));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.beginPath();
        ctx!.arc(cx, cy, p.size * 3, 0, Math.PI * 2);
        ctx!.fillStyle = g;
        ctx!.fill();
      });
    }

    /* ── main draw loop ── */
    function draw() {
      if (paused) { animId = requestAnimationFrame(draw); return; }
      frame++;

      ctx!.clearRect(0, 0, W, H);

      // 1. Background layers
      drawGrid();
      drawHexCorners();
      drawCenterGlow();

      // 2. Edges
      drawEdges();
      drawMouseEdges();

      // 3. Packets (below nodes)
      tickPackets();

      // 4. Nodes
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        drawNode(n);
      });

      animId = requestAnimationFrame(draw);
    }

    /* ── event handlers ── */
    let lastMove = 0;
    function handleMouseMove(e: MouseEvent) {
      const now = Date.now();
      if (now - lastMove < 16) return;
      lastMove = now;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function handleMouseLeave() { mouse.x = -1000; mouse.y = -1000; }
    function handleVisibility() { paused = document.hidden; }

    function init() {
      resize();
      makeNodes(nodeCount());
      cancelAnimationFrame(animId);
      draw();
    }

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    init();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
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
