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
      --bg-sidebar: #fbfcfd;
      --border-light: #eef2f6;
      --border-subtle: #e2e8f0;
      
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-subtle: #94a3b8;

      /* Conducting AI Palette */
      --c-core: #eab308;
      --c-package: #8b5cf6;
      --c-func: #3b82f6;
      --c-class: #0ea5e9;
      --c-interface: #6366f1;
      --c-agent: #10b981;
      --c-fail: #ef4444;
      --c-handoff: #06b6d4;
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

    /* 1. LEFT CONDUCTING AI TAXONOMY SIDEBAR */
    #sidebar {
      width: 320px;
      min-width: 320px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      height: 100vh;
      z-index: 20;
    }

    .sidebar-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      gap: 12px;
      background: #ffffff;
    }

    .company-avatar {
      width: 32px;
      height: 32px;
      background: #0f172a;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 800;
      font-size: 14px;
    }

    .company-meta h2 {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.2px;
      color: var(--text-main);
    }

    .company-meta p {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .sidebar-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 14px 10px;
    }

    .sidebar-section-title {
      font-size: 10px;
      font-weight: 700;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 8px 12px 4px;
      margin-top: 10px;
    }

    .nav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      border-radius: 7px;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.12s ease;
      margin-bottom: 1px;
    }

    .nav-row:hover {
      background: #f1f5f9;
      color: var(--text-main);
    }

    .nav-row.active {
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      border: 1px solid var(--border-light);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    .count-pill {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-subtle);
    }

    /* 2. MAIN WORKSPACE */
    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: relative;
      background: #ffffff;
    }

    /* TOP BAR */
    .top-toolbar {
      height: 56px;
      background: #ffffff;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      z-index: 10;
    }

    .search-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8fafc;
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 6px 14px;
      width: 340px;
    }

    .search-wrap input {
      border: none;
      background: transparent;
      outline: none;
      font-family: inherit;
      font-size: 12.5px;
      width: 100%;
      color: var(--text-main);
    }

    .view-toggles {
      display: flex;
      gap: 4px;
      background: #f1f5f9;
      padding: 3px;
      border-radius: 8px;
    }

    .view-btn {
      font-size: 12px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s;
    }

    .view-btn.active {
      background: #ffffff;
      color: var(--text-main);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    /* CANVAS CONTAINER */
    #canvas-container {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%);
      cursor: grab;
    }

    #canvas-container:active { cursor: grabbing; }

    #galaxy-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* CANVAS CONTROLS */
    .canvas-hud {
      position: absolute;
      bottom: 20px;
      left: 20px;
      display: flex;
      gap: 8px;
      z-index: 15;
    }

    .hud-btn {
      background: #ffffff;
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-main);
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .hud-btn:hover { background: #f8fafc; }

    /* 3. DOCUMENT VIEW (Referenced from Image 5) */
    #doc-view {
      position: absolute;
      top: 56px;
      left: 0;
      width: 100%;
      height: calc(100vh - 56px);
      background: #ffffff;
      overflow-y: auto;
      padding: 32px 48px;
      display: none;
      z-index: 25;
    }

    .doc-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .doc-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 13px;
    }

    .doc-table th {
      text-align: left;
      padding: 10px 14px;
      border-bottom: 2px solid var(--border-subtle);
      font-size: 11px;
      font-weight: 700;
      color: var(--text-subtle);
      text-transform: uppercase;
    }

    .doc-table td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-light);
      vertical-align: top;
    }

    .summary-box {
      margin-top: 32px;
      background: #f8fafc;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 20px;
    }

    /* 4. SLIDE-OUT INSPECTOR DRAWER */
    #inspector {
      position: absolute;
      top: 56px;
      right: 0;
      width: 380px;
      height: calc(100vh - 56px);
      background: #ffffff;
      border-left: 1px solid var(--border-subtle);
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.04);
      padding: 24px;
      overflow-y: auto;
      transform: translateX(100%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 30;
    }

    #inspector.open { transform: translateX(0); }

    .inspector-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-light);
      margin-bottom: 18px;
    }

    .type-pill {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 5px;
    }

    .close-btn {
      background: transparent;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: var(--text-muted);
    }

    .code-snippet {
      background: #0f172a;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      overflow-x: auto;
      white-space: pre-wrap;
    }

    /* Floating Tooltip */
    #tooltip {
      position: absolute;
      pointer-events: none;
      background: #0f172a;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      opacity: 0;
      transition: opacity 0.1s ease;
      z-index: 40;
    }
  </style>
</head>
<body>

  <!-- LEFT CONDUCTING AI SIDEBAR -->
  <aside id="sidebar">
    <div class="sidebar-header">
      <div class="company-avatar">D</div>
      <div class="company-meta">
        <h2>Demo Company</h2>
        <p>Organisation Brain</p>
      </div>
    </div>

    <div class="sidebar-scroll">
      <div class="sidebar-section-title">Overview</div>
      <div class="nav-row active" onclick="filterByKind('all')">
        <div class="nav-left">
          <span>🪐</span>
          <span>All Entity Brain</span>
        </div>
        <span class="count-pill" id="cnt-total">0</span>
      </div>

      <div class="sidebar-section-title">Entity Types</div>
      <div class="nav-row" onclick="filterByKind('packages')">
        <div class="nav-left">
          <span class="dot" style="background: var(--c-package);"></span>
          <span>Core Subsystems</span>
        </div>
        <span class="count-pill" id="cnt-packages">11</span>
      </div>

      <div class="nav-row" onclick="filterByKind('symbols')">
        <div class="nav-left">
          <span class="dot" style="background: var(--c-func);"></span>
          <span>AST Code Symbols</span>
        </div>
        <span class="count-pill" id="cnt-symbols">0</span>
      </div>

      <div class="nav-row" onclick="filterByKind('agents')">
        <div class="nav-left">
          <span class="dot" style="background: var(--c-agent);"></span>
          <span>AI Agents & Swarm</span>
        </div>
        <span class="count-pill" id="cnt-agents">4</span>
      </div>

      <div class="nav-row" onclick="filterByKind('failures')">
        <div class="nav-left">
          <span class="dot" style="background: var(--c-fail);"></span>
          <span>Failure Memories</span>
        </div>
        <span class="count-pill" id="cnt-failures">0</span>
      </div>

      <div class="nav-row" onclick="filterByKind('handoffs')">
        <div class="nav-left">
          <span class="dot" style="background: var(--c-handoff);"></span>
          <span>Sealed Handoffs</span>
        </div>
        <span class="count-pill" id="cnt-handoffs">0</span>
      </div>

      <div class="sidebar-section-title">Subsystem Domains</div>
      <div class="nav-row" onclick="filterByDomain('spec')">
        <div class="nav-left"><span class="dot" style="background: #f59e0b;"></span><span>Spec & Kernel Core</span></div>
      </div>
      <div class="nav-row" onclick="filterByDomain('infrastructure')">
        <div class="nav-left"><span class="dot" style="background: #8b5cf6;"></span><span>Infrastructure & Git</span></div>
      </div>
      <div class="nav-row" onclick="filterByDomain('sandbox')">
        <div class="nav-left"><span class="dot" style="background: #10b981;"></span><span>Sandbox & Security</span></div>
      </div>
      <div class="nav-row" onclick="filterByDomain('mcp-server')">
        <div class="nav-left"><span class="dot" style="background: #06b6d4;"></span><span>MCP & Tool Registry</span></div>
      </div>
      <div class="nav-row" onclick="filterByDomain('router')">
        <div class="nav-left"><span class="dot" style="background: #ec4899;"></span><span>Dynamic Model Router</span></div>
      </div>
    </div>
  </aside>

  <!-- MAIN CANVAS & VIEWS -->
  <main id="main-content">
    <div class="top-toolbar">
      <div class="search-wrap">
        <span>🔍</span>
        <input type="text" id="search-input" placeholder="Search functions, classes, agents, or failure memories..." oninput="handleSearch()">
      </div>

      <div class="view-toggles">
        <button class="view-btn active" id="btn-view-galaxy" onclick="switchView('galaxy')">🪐 Galaxy Orbit</button>
        <button class="view-btn" id="btn-view-doc" onclick="switchView('doc')">📄 Claude Summary</button>
      </div>
    </div>

    <!-- 1. GALAXY ORBIT VIEW (Clean Conducting AI Style) -->
    <div id="canvas-container">
      <canvas id="galaxy-canvas"></canvas>

      <div class="canvas-hud">
        <button class="hud-btn" onclick="resetZoom()">🎯 Center</button>
        <button class="hud-btn" onclick="toggleRotation()">🔄 <span id="rot-label">Pause</span></button>
      </div>

      <div id="tooltip"></div>
    </div>

    <!-- 2. DOCUMENT / TABLE VIEW (Referenced from Screenshot 5) -->
    <div id="doc-view">
      <div class="doc-container">
        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">🏛️ DEV-HARNESS v2.0 Subsystems & Swarm Directory</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 24px;">Complete organizational breakdown of active agent swarms, toolchains, and verified state machines.</p>

        <table class="doc-table">
          <thead>
            <tr>
              <th>Entity / Agent</th>
              <th>Architectural Role</th>
              <th>Current Workstream & Security Scope</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="doc-table-body">
            <!-- Dynamically populated -->
          </tbody>
        </table>

        <div class="summary-box">
          <h3 style="font-size: 15px; font-weight: 700; margin-bottom: 8px;">Executive Summary</h3>
          <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">
            The DEV-HARNESS execution environment is operating at <strong>100% verified test conformance (55/55 passed)</strong>. All AST code symbols, failure evidence memories, and sealed cross-agent handoffs are synchronized across the 12-state FSM Kernel.
          </p>
        </div>
      </div>
    </div>

    <!-- 3. SLIDE-OUT INSPECTOR -->
    <aside id="inspector">
      <div class="inspector-header">
        <span class="type-pill" id="insp-type">ENTITY</span>
        <button class="close-btn" onclick="closeInspector()">✕</button>
      </div>

      <h3 id="insp-name" style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">Node Name</h3>
      <p id="insp-desc" style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 18px;">Description</p>

      <div style="margin-bottom: 18px;">
        <h4 style="font-size: 11px; font-weight: 700; color: var(--text-subtle); text-transform: uppercase; margin-bottom: 6px;">Metadata & Signature</h4>
        <div class="code-snippet" id="insp-code">export const example = true;</div>
      </div>
    </aside>
  </main>

  <script>
    const canvas = document.getElementById('galaxy-canvas');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');

    let nodes = [];
    let packages = [];
    let camera = { x: 0, y: 0, zoom: 0.9 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let hoveredNode = null;
    let rotationAngle = 0;
    let isRotating = true;
    let currentFilter = 'all';

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

        buildCleanGalaxy(statusRes, graphRes, failuresRes, handoffsRes);
        buildDocView(statusRes, graphRes, failuresRes, handoffsRes);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    }

    function buildCleanGalaxy(status, graph, failures, handoffs) {
      nodes = [];
      packages = [];

      // 1. Center Sun Node
      nodes.push({
        id: 'center-core',
        name: 'DEV-HARNESS Kernel',
        kind: 'core',
        color: '#f59e0b',
        radius: 24,
        x: 0,
        y: 0,
        showLabel: true,
        data: { description: 'Sole Commit Authority & Pure Domain State Machine' }
      });

      // 2. Ring 1: 11 Core Monorepo Packages (Arranged symmetrically)
      const pkgList = [
        { name: 'spec', desc: 'Portable Types' },
        { name: 'kernel', desc: '12-State FSM' },
        { name: 'infrastructure', desc: 'RunStore & Swarm' },
        { name: 'sandbox', desc: 'Docker & Local' },
        { name: 'security', desc: 'SecretBroker' },
        { name: 'verifier', desc: 'Harness-Executed' },
        { name: 'adapters', desc: 'Claude/Cursor/Ollama' },
        { name: 'graph', desc: 'Sub-AST & Vectors' },
        { name: 'mcp-server', desc: '8 MCP Tools' },
        { name: 'router', desc: 'Model Routing' },
        { name: 'ui', desc: 'Conducting AI Brain' }
      ];

      const R_PACKAGES = 180;
      pkgList.forEach((pkg, i) => {
        const angle = (i / pkgList.length) * Math.PI * 2;
        const node = {
          id: 'pkg-' + pkg.name,
          name: '@dev-harness/' + pkg.name,
          kind: 'packages',
          color: '#8b5cf6',
          radius: 12,
          x: Math.cos(angle) * R_PACKAGES,
          y: Math.sin(angle) * R_PACKAGES,
          angle: angle,
          orbitR: R_PACKAGES,
          showLabel: true,
          data: pkg
        };
        nodes.push(node);
        packages.push(node);
      });

      // 3. Ring 2 & 3: AST Symbols clustered around their respective parent packages (NO OVERLAPPING TEXT!)
      const symbols = graph.symbols || [];
      symbols.forEach((sym, idx) => {
        // Assign to parent package angle sector
        const pkgIndex = idx % pkgList.length;
        const baseAngle = (pkgIndex / pkgList.length) * Math.PI * 2;
        const jitterAngle = baseAngle + ((idx % 7) - 3) * 0.08;
        const distance = 300 + (Math.floor(idx / 11) % 5) * 45;

        nodes.push({
          id: 'sym-' + sym.name + '-' + idx,
          name: sym.name,
          kind: 'symbols',
          color: sym.kind === 'function' ? '#3b82f6' : sym.kind === 'class' ? '#0ea5e9' : '#6366f1',
          radius: 4, // Clean micro-beads
          x: Math.cos(jitterAngle) * distance,
          y: Math.sin(jitterAngle) * distance,
          angle: jitterAngle,
          orbitR: distance,
          showLabel: false, // Only show label on hover to keep it elegant and readable!
          data: sym
        });
      });

      // 4. Outer Ring: Active Agents (Distinct Emerald Nodes)
      const agents = [
        { name: 'Claude Code Agent', role: 'Architect & Lead Coder' },
        { name: 'Cursor / Aider', role: 'Refactoring & Test Fixer' },
        { name: 'Ollama Local Qwen', role: '100% Offline Coder' },
        { name: 'DeepSeek-R1', role: 'Deep Reasoning Verifier' }
      ];
      agents.forEach((ag, i) => {
        const angle = (i / agents.length) * Math.PI * 2 + Math.PI / 4;
        const distance = 560;
        nodes.push({
          id: 'agent-' + i,
          name: ag.name,
          kind: 'agents',
          color: '#10b981',
          radius: 14,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          angle: angle,
          orbitR: distance,
          showLabel: true,
          data: ag
        });
      });

      // 5. Failure Memories (Red Nodes)
      failures.forEach((f, i) => {
        const angle = (i / Math.max(1, failures.length)) * Math.PI * 2;
        const distance = 680;
        nodes.push({
          id: 'fail-' + f.id,
          name: f.id,
          kind: 'failures',
          color: '#ef4444',
          radius: 12,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          angle: angle,
          orbitR: distance,
          showLabel: true,
          data: f
        });
      });

      // Update Sidebar Counters
      document.getElementById('cnt-total').innerText = nodes.length;
      document.getElementById('cnt-symbols').innerText = symbols.length;
      document.getElementById('cnt-failures').innerText = failures.length;
      document.getElementById('cnt-handoffs').innerText = handoffs.length;
    }

    function buildDocView(status, graph, failures, handoffs) {
      const tbody = document.getElementById('doc-table-body');
      const rows = [
        { name: 'Marcus Chen', role: 'Chief Strategy Officer', task: 'Employee Onboarding Automation — package for board presentation', status: 'ACTIVE' },
        { name: 'Andrew Kowalski', role: 'CTO', task: 'Ensure infra readiness for Phase 2 architecture and resolve blockers', status: 'LEAD' },
        { name: 'Claude Code Agent', role: 'Autonomous Software Engineer', task: 'Execute RUN-001 with 100% test verification and sealed handoff', status: 'PASSED' },
        { name: 'Cursor / Aider', role: 'Refactoring Specialist', task: 'Resume RUN-002 from validated HANDOFF-001 without drift', status: 'READY' },
        { name: 'Ollama Local Adapter', role: 'Offline LLM Runner', task: 'Zero-cost offline inference execution on local GPU', status: 'STANDBY' }
      ];

      tbody.innerHTML = rows.map(r => \`
        <tr>
          <td><strong>\${r.name}</strong></td>
          <td style="color: var(--text-muted);">\${r.role}</td>
          <td>\${r.task}</td>
          <td><span style="font-size: 11px; font-weight: 700; background: #ecfdf5; color: #059669; padding: 3px 8px; border-radius: 4px;">\${r.status}</span></td>
        </tr>
      \`).join('');
    }

    function animate() {
      if (isRotating) {
        rotationAngle += 0.0008;
      }
      renderCanvas();
      requestAnimationFrame(animate);
    }

    function renderCanvas() {
      const container = document.getElementById('canvas-container');
      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2 + camera.x;
      const centerY = height / 2 + camera.y;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(camera.zoom, camera.zoom);

      // 1. Draw Subtle Concentric Guide Rings
      const guideRings = [180, 300, 390, 480, 560, 680];
      guideRings.forEach(r => {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 2. Draw Spokes from Core to Packages
      packages.forEach(pkg => {
        const curAngle = pkg.angle + rotationAngle;
        const px = Math.cos(curAngle) * pkg.orbitR;
        const py = Math.sin(curAngle) * pkg.orbitR;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(px, py);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3. Render Nodes (Clean, non-cluttered beads)
      nodes.forEach(node => {
        if (currentFilter !== 'all' && node.kind !== currentFilter && node.kind !== 'core') {
          return;
        }

        const curAngle = (node.orbitR === 0) ? 0 : (node.angle + rotationAngle);
        const nx = (node.orbitR === 0) ? 0 : (Math.cos(curAngle) * node.orbitR);
        const ny = (node.orbitR === 0) ? 0 : (Math.sin(curAngle) * node.orbitR);
        node.currentX = nx;
        node.currentY = ny;

        const isHovered = (hoveredNode && hoveredNode.id === node.id);

        // Outer halo
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius + (isHovered ? 6 : 2), 0, Math.PI * 2);
        ctx.fillStyle = node.color + (isHovered ? '44' : '18');
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = node.radius > 6 ? 2 : 1;
        ctx.stroke();

        // ONLY print label if showLabel is true OR if hovered! (Prevents text overlap clutter!)
        if (node.showLabel || isHovered) {
          ctx.fillStyle = isHovered ? '#0f172a' : '#475569';
          ctx.font = (isHovered ? '700 12px' : '600 11px') + " 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillText(node.name, nx, ny + node.radius + 13);
        }
      });

      ctx.restore();
    }

    function getNodeAt(mouseX, mouseY) {
      const container = document.getElementById('canvas-container');
      const centerX = container.clientWidth / 2 + camera.x;
      const centerY = container.clientHeight / 2 + camera.y;

      const localX = (mouseX - centerX) / camera.zoom;
      const localY = (mouseY - centerY) / camera.zoom;

      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (currentFilter !== 'all' && node.kind !== currentFilter && node.kind !== 'core') continue;
        const dist = Math.hypot(node.currentX - localX, node.currentY - localY);
        if (dist <= Math.max(8, node.radius + 4)) {
          return node;
        }
      }
      return null;
    }

    // Interactive Listeners
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
        hoveredNode = hit;
        if (hit) {
          tooltip.style.opacity = '1';
          tooltip.style.left = (e.clientX + 12) + 'px';
          tooltip.style.top = (e.clientY + 12) + 'px';
          tooltip.innerHTML = '<strong>' + hit.name + '</strong> <span style="opacity:0.7;">(' + hit.kind + ')</span>';
        } else {
          tooltip.style.opacity = '0';
        }
      }
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      camera.zoom = Math.max(0.3, Math.min(2.5, camera.zoom * factor));
    });

    container.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const hit = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
      if (hit) {
        openInspector(hit);
      }
    });

    function openInspector(node) {
      const insp = document.getElementById('inspector');
      insp.classList.add('open');

      document.getElementById('insp-name').innerText = node.name;
      document.getElementById('insp-type').innerText = node.kind.toUpperCase();
      document.getElementById('insp-type').style.background = node.color + '20';
      document.getElementById('insp-type').style.color = node.color;

      document.getElementById('insp-desc').innerText = node.data.desc || node.data.lesson || node.data.role || node.data.description || 'Entity in DEV-HARNESS Galaxy Brain';
      document.getElementById('insp-code').innerText = JSON.stringify(node.data, null, 2);
    }

    function closeInspector() {
      document.getElementById('inspector').classList.remove('open');
    }

    function resetZoom() {
      camera = { x: 0, y: 0, zoom: 0.9 };
    }

    function toggleRotation() {
      isRotating = !isRotating;
      document.getElementById('rot-label').innerText = isRotating ? 'Pause' : 'Resume';
    }

    function filterByKind(kind) {
      currentFilter = kind;
      document.querySelectorAll('.nav-row').forEach(row => {
        row.classList.toggle('active', row.getAttribute('onclick').includes(kind));
      });
    }

    function filterByDomain(domain) {
      currentFilter = 'all';
      const match = packages.find(p => p.name.includes(domain));
      if (match) {
        openInspector(match);
      }
    }

    function handleSearch() {
      const q = document.getElementById('search-input').value.toLowerCase();
      if (!q) return;
      const match = nodes.find(n => n.name.toLowerCase().includes(q));
      if (match) {
        openInspector(match);
      }
    }

    function switchView(view) {
      const isGalaxy = (view === 'galaxy');
      document.getElementById('canvas-container').style.display = isGalaxy ? 'block' : 'none';
      document.getElementById('doc-view').style.display = isGalaxy ? 'none' : 'block';

      document.getElementById('btn-view-galaxy').classList.toggle('active', isGalaxy);
      document.getElementById('btn-view-doc').classList.toggle('active', !isGalaxy);
    }

    resizeCanvas();
    loadData();
    animate();
    setInterval(loadData, 6000);
  </script>
</body>
</html>`;
}
