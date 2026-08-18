export function getDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conducting AI / DEV-HARNESS v2.0 - Organisation Brain & Agent Galaxy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-base: #f8fafc;
      --bg-surface: #ffffff;
      --bg-sidebar: #f1f5f9;
      --bg-card: #ffffff;
      --bg-card-hover: #f8fafc;
      --border: #e2e8f0;
      --border-focus: #3b82f6;

      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-subtle: #94a3b8;

      /* Conducting AI Signature Ring Colors */
      --c-core: #f59e0b;       /* Ring 1 - Yellow/Core */
      --c-systems: #8b5cf6;    /* Ring 2 - Purple/Systems & Packages */
      --c-symbols: #3b82f6;    /* Ring 3 - Blue/AST Symbols */
      --c-agents: #10b981;     /* Ring 4 - Green/Agents & Workers */
      --c-failures: #ef4444;   /* Ring 5 - Red/Failures & Warnings */
      --c-handoffs: #06b6d4;   /* Ring 6 - Cyan/Handoffs */
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-base);
      color: var(--text-main);
      height: 100vh;
      overflow: hidden;
      display: flex;
    }

    /* 1. LEFT TAXONOMY SIDEBAR */
    #sidebar {
      width: 320px;
      min-width: 320px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      height: 100vh;
      z-index: 20;
    }

    .sidebar-header {
      padding: 18px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-surface);
    }

    .app-logo {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 18px;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
    }

    .app-title h2 {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: var(--text-main);
    }

    .app-title p {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .sidebar-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 16px 12px;
    }

    .nav-section-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 8px 12px 6px;
      margin-top: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
      margin-bottom: 2px;
    }

    .nav-item:hover {
      background: rgba(226, 232, 240, 0.7);
      color: var(--text-main);
    }

    .nav-item.active {
      background: var(--bg-surface);
      color: #2563eb;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      border: 1px solid var(--border);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .nav-count {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 9999px;
      background: #e2e8f0;
      color: var(--text-muted);
    }

    /* 2. MAIN GALAXY CANVAS AREA */
    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: relative;
      background: #fafbfc;
    }

    .top-toolbar {
      height: 60px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      z-index: 10;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f1f5f9;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 6px 14px;
      width: 320px;
    }

    .search-box input {
      border: none;
      background: transparent;
      outline: none;
      font-family: inherit;
      font-size: 13px;
      width: 100%;
      color: var(--text-main);
    }

    .filter-pills {
      display: flex;
      gap: 6px;
    }

    .pill-btn {
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 9999px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }

    .pill-btn:hover, .pill-btn.active {
      background: #0f172a;
      color: #ffffff;
      border-color: #0f172a;
    }

    /* CANVAS VIEWPORT */
    #canvas-container {
      flex: 1;
      position: relative;
      overflow: hidden;
      cursor: grab;
    }

    #canvas-container:active {
      cursor: grabbing;
    }

    #galaxy-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* CANVAS CONTROLS */
    .canvas-overlay-controls {
      position: absolute;
      bottom: 24px;
      left: 24px;
      display: flex;
      gap: 8px;
      z-index: 15;
    }

    .ctrl-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-main);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .ctrl-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    /* 3. RIGHT ENTITY INSPECTOR DRAWER */
    #inspector {
      position: absolute;
      top: 60px;
      right: 0;
      width: 380px;
      height: calc(100vh - 60px);
      background: var(--bg-surface);
      border-left: 1px solid var(--border);
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.04);
      padding: 24px;
      overflow-y: auto;
      transform: translateX(100%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 30;
    }

    #inspector.open {
      transform: translateX(0);
    }

    .inspector-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 20px;
    }

    .node-type-badge {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .close-btn {
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: var(--text-muted);
    }

    .inspector-section {
      margin-bottom: 20px;
    }

    .inspector-section h4 {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-subtle);
      margin-bottom: 8px;
    }

    .code-snippet {
      background: #0f172a;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      overflow-x: auto;
      white-space: pre-wrap;
    }

    /* Tooltip */
    #tooltip {
      position: absolute;
      pointer-events: none;
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(8px);
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      opacity: 0;
      transition: opacity 0.15s;
      z-index: 40;
    }
  </style>
</head>
<body>

  <!-- 1. LEFT TAXONOMY SIDEBAR (Conducting AI Structure) -->
  <aside id="sidebar">
    <div class="sidebar-header">
      <div class="app-logo">🌌</div>
      <div class="app-title">
        <h2>Conducting AI</h2>
        <p>Organisation Brain & Swarm</p>
      </div>
    </div>

    <div class="sidebar-scroll">
      <div class="nav-section-title">Overview</div>
      <div class="nav-item active" onclick="setFilter('all')">
        <div class="nav-left">
          <span>🪐</span>
          <span>Full Galaxy Brain</span>
        </div>
        <span class="nav-count" id="count-all">0</span>
      </div>

      <div class="nav-section-title">Architecture & Systems</div>
      <div class="nav-item" onclick="setFilter('packages')">
        <div class="nav-left">
          <span class="nav-dot" style="background: var(--c-systems);"></span>
          <span>Core Packages</span>
        </div>
        <span class="nav-count" id="count-packages">11</span>
      </div>

      <div class="nav-item" onclick="setFilter('symbols')">
        <div class="nav-left">
          <span class="nav-dot" style="background: var(--c-symbols);"></span>
          <span>AST Symbols & Calls</span>
        </div>
        <span class="nav-count" id="count-symbols">0</span>
      </div>

      <div class="nav-section-title">Multi-Agent Swarm</div>
      <div class="nav-item" onclick="setFilter('agents')">
        <div class="nav-left">
          <span class="nav-dot" style="background: var(--c-agents);"></span>
          <span>Active AI Agents</span>
        </div>
        <span class="nav-count" id="count-agents">4</span>
      </div>

      <div class="nav-item" onclick="setFilter('handoffs')">
        <div class="nav-left">
          <span class="nav-dot" style="background: var(--c-handoffs);"></span>
          <span>Sealed Handoffs</span>
        </div>
        <span class="nav-count" id="count-handoffs">0</span>
      </div>

      <div class="nav-section-title">Empirical Knowledge</div>
      <div class="nav-item" onclick="setFilter('failures')">
        <div class="nav-left">
          <span class="nav-dot" style="background: var(--c-failures);"></span>
          <span>Failure Memories</span>
        </div>
        <span class="nav-count" id="count-failures">0</span>
      </div>
    </div>
  </aside>

  <!-- 2. MAIN GALAXY CANVAS -->
  <main id="main-content">
    <div class="top-toolbar">
      <div class="search-box">
        <span>🔍</span>
        <input type="text" id="search-input" placeholder="Search symbols, failures, packages, or agents..." oninput="handleSearch()">
      </div>

      <div class="filter-pills">
        <button class="pill-btn active" onclick="setFilter('all')">All Orbits</button>
        <button class="pill-btn" onclick="setFilter('packages')">Packages</button>
        <button class="pill-btn" onclick="setFilter('symbols')">Symbols</button>
        <button class="pill-btn" onclick="setFilter('failures')">Failures</button>
        <button class="pill-btn" onclick="setFilter('agents')">Agents</button>
      </div>
    </div>

    <div id="canvas-container">
      <canvas id="galaxy-canvas"></canvas>

      <div class="canvas-overlay-controls">
        <button class="ctrl-btn" onclick="resetZoom()">🎯 Center Galaxy</button>
        <button class="ctrl-btn" onclick="toggleRotation()">🔄 <span id="rotation-label">Pause Orbit</span></button>
      </div>

      <div id="tooltip"></div>
    </div>

    <!-- 3. RIGHT ENTITY INSPECTOR -->
    <aside id="inspector">
      <div class="inspector-header">
        <span class="node-type-badge" id="insp-badge">ENTITY</span>
        <button class="close-btn" onclick="closeInspector()">✕</button>
      </div>

      <h3 id="insp-title" style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Node Title</h3>
      <p id="insp-desc" style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">Description or metadata</p>

      <div class="inspector-section" id="insp-code-sec">
        <h4>Source / Signature</h4>
        <div class="code-snippet" id="insp-code">export class Example {}</div>
      </div>

      <div class="inspector-section" id="insp-connections-sec">
        <h4>Connected Edges</h4>
        <ul id="insp-edges" style="font-size: 13px; color: var(--text-muted); padding-left: 16px;"></ul>
      </div>
    </aside>
  </main>

  <script>
    const canvas = document.getElementById('galaxy-canvas');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');

    let nodes = [];
    let edges = [];
    let camera = { x: 0, y: 0, zoom: 1 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let hoveredNode = null;
    let selectedNode = null;
    let rotationAngle = 0;
    let isRotating = true;
    let currentFilter = 'all';

    // Ring Radius definitions
    const R_CORE = 0;
    const R_PACKAGES = 140;
    const R_SYMBOLS = 280;
    const R_FAILURES = 420;
    const R_AGENTS = 540;
    const R_HANDOFFS = 660;

    function resizeCanvas() {
      const container = document.getElementById('canvas-container');
      canvas.width = container.clientWidth * window.devicePixelRatio;
      canvas.height = container.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    window.addEventListener('resize', resizeCanvas);

    async function loadData() {
      try {
        const [statusRes, graphRes, failuresRes, handoffsRes] = await Promise.all([
          fetch('/api/status').then(r => r.json()),
          fetch('/api/graph').then(r => r.json()),
          fetch('/api/failures').then(r => r.json()),
          fetch('/api/handoffs').then(r => r.json())
        ]);

        buildGalaxy(statusRes, graphRes, failuresRes, handoffsRes);
      } catch (err) {
        console.error('Failed to load galaxy data:', err);
      }
    }

    function buildGalaxy(status, graph, failures, handoffs) {
      nodes = [];
      edges = [];

      // 1. Center Core Node
      nodes.push({
        id: 'core-root',
        name: 'DEV-HARNESS Kernel',
        kind: 'core',
        color: '#f59e0b',
        radius: 32,
        orbitRadius: 0,
        angle: 0,
        data: { description: 'Sole Commit Authority & Portable Specification' }
      });

      // 2. Package Nodes (Ring 1)
      const pkgs = [
        'spec', 'kernel', 'infrastructure', 'sandbox', 'security', 
        'verifier', 'adapters', 'graph', 'mcp-server', 'router', 'ui'
      ];
      pkgs.forEach((pkg, idx) => {
        const angle = (idx / pkgs.length) * Math.PI * 2;
        nodes.push({
          id: 'pkg-' + pkg,
          name: '@dev-harness/' + pkg,
          kind: 'packages',
          color: '#8b5cf6',
          radius: 18,
          orbitRadius: R_PACKAGES,
          angle: angle,
          data: { description: 'Monorepo Architecture Package' }
        });
        edges.push({ from: 'core-root', to: 'pkg-' + pkg, color: 'rgba(139, 92, 246, 0.3)' });
      });

      // 3. AST Symbols (Ring 2)
      const symbols = graph.symbols || [];
      symbols.forEach((sym, idx) => {
        const angle = (idx / Math.max(1, symbols.length)) * Math.PI * 2;
        nodes.push({
          id: 'sym-' + sym.name,
          name: sym.name,
          kind: 'symbols',
          color: '#3b82f6',
          radius: 12,
          orbitRadius: R_SYMBOLS + (idx % 3) * 20,
          angle: angle,
          data: sym
        });
      });

      // 4. Failure Memories (Ring 3)
      failures.forEach((f, idx) => {
        const angle = (idx / Math.max(1, failures.length)) * Math.PI * 2;
        nodes.push({
          id: 'fail-' + f.id,
          name: f.id,
          kind: 'failures',
          color: '#ef4444',
          radius: 14,
          orbitRadius: R_FAILURES,
          angle: angle,
          data: f
        });
      });

      // 5. Active Agents (Ring 4)
      const agents = [
        { id: 'claude-code', name: 'Claude Code Agent', role: 'Architect & Lead Coder' },
        { id: 'cursor-aider', name: 'Cursor / Aider', role: 'Refactoring & Test Fixer' },
        { id: 'ollama-local', name: 'Ollama Local Qwen', role: '100% Offline Free Coder' },
        { id: 'deepseek-r1', name: 'DeepSeek-R1', role: 'Deep Reasoning Verifier' }
      ];
      agents.forEach((ag, idx) => {
        const angle = (idx / agents.length) * Math.PI * 2;
        nodes.push({
          id: 'agent-' + ag.id,
          name: ag.name,
          kind: 'agents',
          color: '#10b981',
          radius: 20,
          orbitRadius: R_AGENTS,
          angle: angle,
          data: ag
        });
      });

      // 6. Handoffs (Ring 5)
      handoffs.forEach((h, idx) => {
        const angle = (idx / Math.max(1, handoffs.length)) * Math.PI * 2;
        nodes.push({
          id: 'handoff-' + h.handoffId,
          name: h.handoffId,
          kind: 'handoffs',
          color: '#06b6d4',
          radius: 16,
          orbitRadius: R_HANDOFFS,
          angle: angle,
          data: h
        });
      });

      // Update Sidebar counters
      document.getElementById('count-all').innerText = nodes.length;
      document.getElementById('count-symbols').innerText = symbols.length;
      document.getElementById('count-failures').innerText = failures.length;
      document.getElementById('count-handoffs').innerText = handoffs.length;
    }

    function animate() {
      if (isRotating) {
        rotationAngle += 0.0012;
      }
      render();
      requestAnimationFrame(animate);
    }

    function render() {
      const container = document.getElementById('canvas-container');
      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2 + camera.x;
      const centerY = height / 2 + camera.y;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(camera.zoom, camera.zoom);

      // 1. Draw Concentric Solar/Orbit Rings (Conducting AI Style)
      const rings = [
        { r: R_PACKAGES, color: 'rgba(139, 92, 246, 0.15)', label: 'RING 1: CORE PACKAGES' },
        { r: R_SYMBOLS, color: 'rgba(59, 130, 246, 0.12)', label: 'RING 2: AST SYMBOLS' },
        { r: R_FAILURES, color: 'rgba(239, 68, 68, 0.12)', label: 'RING 3: FAILURE MEMORIES' },
        { r: R_AGENTS, color: 'rgba(16, 185, 129, 0.12)', label: 'RING 4: MULTI-AGENT SWARM' },
        { r: R_HANDOFFS, color: 'rgba(6, 182, 212, 0.12)', label: 'RING 5: SEALED HANDOFFS' }
      ];

      rings.forEach(ring => {
        ctx.beginPath();
        ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label on Ring
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(ring.label, ring.r + 8, 0);
      });

      // 2. Draw Edges
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (fromNode && toNode) {
          const p1 = getNodePos(fromNode);
          const p2 = getNodePos(toNode);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = edge.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      // 3. Draw Nodes
      nodes.forEach(node => {
        if (currentFilter !== 'all' && node.kind !== currentFilter && node.kind !== 'core') {
          return;
        }

        const pos = getNodePos(node);

        // Outer Glow
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, node.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = node.color + '22';
        ctx.fill();

        // Core Circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node Label
        ctx.fillStyle = '#1e293b';
        ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, pos.x, pos.y + node.radius + 14);
      });

      ctx.restore();
    }

    function getNodePos(node) {
      if (node.orbitRadius === 0) return { x: 0, y: 0 };
      const currentAngle = node.angle + (node.kind === 'core' ? 0 : rotationAngle);
      return {
        x: Math.cos(currentAngle) * node.orbitRadius,
        y: Math.sin(currentAngle) * node.orbitRadius
      };
    }

    function getNodeAt(x, y) {
      const container = document.getElementById('canvas-container');
      const centerX = container.clientWidth / 2 + camera.x;
      const centerY = container.clientHeight / 2 + camera.y;

      const localX = (x - centerX) / camera.zoom;
      const localY = (y - centerY) / camera.zoom;

      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (currentFilter !== 'all' && node.kind !== currentFilter && node.kind !== 'core') continue;
        const pos = getNodePos(node);
        const dist = Math.hypot(pos.x - localX, pos.y - localY);
        if (dist <= node.radius + 4) {
          return node;
        }
      }
      return null;
    }

    // Event Listeners for Interaction
    const container = document.getElementById('canvas-container');

    container.addEventListener('mousedown', e => {
      isDragging = true;
      dragStart = { x: e.clientX - camera.x, y: e.clientY - camera.y };
    });

    window.addEventListener('mousemove', e => {
      if (isDragging) {
        camera.x = e.clientX - dragStart.x;
        camera.y = e.clientY - dragStart.y;
      } else {
        const rect = canvas.getBoundingClientRect();
        const hit = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
        if (hit) {
          tooltip.style.opacity = '1';
          tooltip.style.left = (e.clientX + 14) + 'px';
          tooltip.style.top = (e.clientY + 14) + 'px';
          tooltip.innerHTML = '<strong>' + hit.name + '</strong> (' + hit.kind + ')';
        } else {
          tooltip.style.opacity = '0';
        }
      }
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('wheel', e => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      camera.zoom = Math.max(0.2, Math.min(3.0, camera.zoom * zoomFactor));
    });

    container.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const hit = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
      if (hit) {
        openInspector(hit);
      }
    });

    function openInspector(node) {
      selectedNode = node;
      const insp = document.getElementById('inspector');
      insp.classList.add('open');

      document.getElementById('insp-title').innerText = node.name;
      document.getElementById('insp-badge').innerText = node.kind.toUpperCase();
      document.getElementById('insp-badge').style.background = node.color + '22';
      document.getElementById('insp-badge').style.color = node.color;

      document.getElementById('insp-desc').innerText = node.data.lesson || node.data.description || node.data.signature || 'Entity in DEV-HARNESS Galaxy';
      document.getElementById('insp-code').innerText = JSON.stringify(node.data, null, 2);
    }

    function closeInspector() {
      document.getElementById('inspector').classList.remove('open');
    }

    function resetZoom() {
      camera = { x: 0, y: 0, zoom: 1 };
    }

    function toggleRotation() {
      isRotating = !isRotating;
      document.getElementById('rotation-label').innerText = isRotating ? 'Pause Orbit' : 'Resume Orbit';
    }

    function setFilter(filter) {
      currentFilter = filter;
      document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(filter));
      });
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('onclick').includes(filter));
      });
    }

    function handleSearch() {
      const q = document.getElementById('search-input').value.toLowerCase();
      if (!q) return;
      const match = nodes.find(n => n.name.toLowerCase().includes(q));
      if (match) {
        openInspector(match);
      }
    }

    resizeCanvas();
    loadData();
    animate();
    setInterval(loadData, 6000);
  </script>
</body>
</html>`;
}
