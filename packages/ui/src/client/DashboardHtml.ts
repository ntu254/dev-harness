export function getDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
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
      --border-subtle: #e2e8f0;
      --border-light: #f1f5f9;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-faint: #94a3b8;
      --ring-guide: rgba(226, 232, 240, 0.85);

      --dep-pm: #ea580c;
      --dep-mktg: #dc2626;
      --dep-sales: #16a34a;
      --dep-cust: #0d9488;
      --dep-ops: #b45309;
      --dep-tech: #4f46e5;
      --dep-strat: #2563eb;
      --dep-fin: #ca8a04;
      --dep-data: #0284c7;
      --dep-legal: #9333ea;
    }

    [data-theme="dark"] {
      --bg-base: #090d16;
      --bg-surface: #111827;
      --bg-sidebar: #0b1120;
      --border-subtle: #1e293b;
      --border-light: #172033;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-faint: #64748b;
      --ring-guide: rgba(30, 41, 59, 0.8);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-base);
      color: var(--text-main);
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      display: flex;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    /* 1. SIDEBAR (Collapsible for maximum real estate!) */
    #sidebar {
      width: 280px;
      min-width: 280px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      height: 100vh;
      z-index: 20;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    #sidebar.collapsed {
      width: 0;
      min-width: 0;
      overflow: hidden;
      border-right: none;
    }

    .org-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-surface);
    }

    .org-meta {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .org-avatar {
      width: 30px;
      height: 30px;
      background: #0f172a;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 800;
      font-size: 13px;
    }

    .org-title h2 {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.2;
    }

    .org-title p {
      font-size: 10.5px;
      color: var(--text-muted);
    }

    .sidebar-search {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-surface);
    }

    .search-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 5px 8px;
    }

    .search-wrap input {
      border: none;
      background: transparent;
      outline: none;
      font-family: inherit;
      font-size: 12px;
      width: 100%;
      color: var(--text-main);
    }

    .sidebar-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 10px 6px;
    }

    .sidebar-sec-title {
      font-size: 9.5px;
      font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 0.7px;
      padding: 6px 10px 3px;
      margin-top: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.12s ease;
      margin-bottom: 1px;
    }

    .nav-item:hover {
      background: var(--border-light);
      color: var(--text-main);
    }

    .nav-item.active {
      background: var(--bg-surface);
      color: var(--text-main);
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      border: 1px solid var(--border-subtle);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    .count-pill {
      font-size: 10.5px;
      font-weight: 600;
      color: var(--text-faint);
    }

    /* 2. MAIN FULL-BLEED CANVAS */
    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: relative;
      background: var(--bg-surface);
    }

    /* TOP SLIM FLOATING BAR */
    .top-toolbar {
      height: 48px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 18px;
      z-index: 10;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toggle-sidebar-btn {
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      color: var(--text-muted);
    }

    .breadcrumbs {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .breadcrumbs strong { color: var(--text-main); }

    .tag-badge {
      font-size: 11px;
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      padding: 2px 7px;
      border-radius: 9999px;
      color: var(--text-muted);
    }

    .view-toggles {
      display: flex;
      gap: 4px;
      background: var(--bg-base);
      padding: 2px;
      border-radius: 6px;
      border: 1px solid var(--border-subtle);
    }

    .view-btn {
      font-size: 11.5px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 4px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s;
    }

    .view-btn.active {
      background: var(--bg-surface);
      color: var(--text-main);
      box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    }

    /* FULL-SIZE CANVAS VIEWPORT */
    #canvas-container {
      flex: 1;
      width: 100%;
      height: calc(100vh - 48px);
      position: relative;
      overflow: hidden;
      background: radial-gradient(circle at center, var(--bg-surface) 0%, var(--bg-base) 100%);
      cursor: grab;
    }

    #canvas-container:active { cursor: grabbing; }

    #galaxy-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* FLOATING BOTTOM CONTROLS (HUD) */
    .canvas-hud {
      position: absolute;
      bottom: 18px;
      left: 18px;
      display: flex;
      gap: 6px;
      z-index: 15;
    }

    .hud-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 5px 10px;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--text-main);
      box-shadow: 0 2px 5px rgba(0,0,0,0.04);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .hud-btn:hover { background: var(--bg-base); }

    /* CLAUDE SUMMARY DOCUMENT VIEW */
    #doc-view {
      position: absolute;
      top: 48px;
      left: 0;
      width: 100%;
      height: calc(100vh - 48px);
      background: var(--bg-surface);
      overflow-y: auto;
      padding: 32px 40px;
      display: none;
      z-index: 25;
    }

    .doc-container {
      max-width: 960px;
      margin: 0 auto;
    }

    .doc-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 12.5px;
    }

    .doc-table th {
      text-align: left;
      padding: 8px 12px;
      border-bottom: 2px solid var(--border-subtle);
      font-size: 11px;
      font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase;
    }

    .doc-table td {
      padding: 12px;
      border-bottom: 1px solid var(--border-light);
      vertical-align: top;
      line-height: 1.5;
    }

    .summary-card {
      margin-top: 28px;
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 20px;
    }

    /* TOOLTIP */
    #tooltip {
      position: absolute;
      pointer-events: none;
      background: #0f172a;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      opacity: 0;
      transition: opacity 0.1s ease;
      z-index: 40;
    }
  </style>
</head>
<body>

  <!-- 1. COLLAPSIBLE CONDUCTING AI SIDEBAR -->
  <aside id="sidebar">
    <div class="org-header">
      <div class="org-meta">
        <div class="org-avatar">D</div>
        <div class="org-title">
          <h2>Demo Company</h2>
          <p>Organisation Brain</p>
        </div>
      </div>
    </div>

    <div class="sidebar-search">
      <div class="search-wrap">
        <span>🔍</span>
        <input type="text" placeholder="Search entities..." id="sidebar-search" oninput="handleSearch()">
      </div>
    </div>

    <div class="sidebar-scroll">
      <div class="sidebar-sec-title">Overview</div>
      <div class="nav-item active" onclick="filterDepartment(null)">
        <div class="nav-left"><span>🪐</span><span>All Entities Brain</span></div>
        <span class="count-pill">757</span>
      </div>

      <div class="sidebar-sec-title">By Entity Type</div>
      <div class="nav-item"><div class="nav-left"><span>👥</span><span>People</span></div><span class="count-pill">75</span></div>
      <div class="nav-item"><div class="nav-left"><span>🤖</span><span>Sub-Agents</span></div><span class="count-pill">34</span></div>
      <div class="nav-item"><div class="nav-left"><span>🛠️</span><span>Tools</span></div><span class="count-pill">145</span></div>
      <div class="nav-item"><div class="nav-left"><span>⚡</span><span>Workflows</span></div><span class="count-pill">198</span></div>
      <div class="nav-item"><div class="nav-left"><span>📜</span><span>SOPs</span></div><span class="count-pill">224</span></div>
      <div class="nav-item"><div class="nav-left"><span>📁</span><span>Projects</span></div><span class="count-pill">12</span></div>

      <div class="sidebar-sec-title">Core Departments</div>
      <div class="nav-item" onclick="filterDepartment('Product Management')"><div class="nav-left"><span class="dot" style="background: var(--dep-pm);"></span><span>Product Management</span></div></div>
      <div class="nav-item" onclick="filterDepartment('Marketing & Growth')"><div class="nav-left"><span class="dot" style="background: var(--dep-mktg);"></span><span>Marketing & Growth</span></div></div>
      <div class="nav-item" onclick="filterDepartment('Sales')"><div class="nav-left"><span class="dot" style="background: var(--dep-sales);"></span><span>Sales</span></div></div>
      <div class="nav-item" onclick="filterDepartment('Customer & Admin')"><div class="nav-left"><span class="dot" style="background: var(--dep-cust);"></span><span>Customer & Admin</span></div></div>
      <div class="nav-item" onclick="filterDepartment('Operations & Supply Chain')"><div class="nav-left"><span class="dot" style="background: var(--dep-ops);"></span><span>Operations & Supply Chain</span></div></div>
      <div class="nav-item" onclick="filterDepartment('Tech, AI & Automations')"><div class="nav-left"><span class="dot" style="background: var(--dep-tech);"></span><span>Tech, AI & Automations</span></div></div>
      <div class="nav-item" onclick="filterDepartment('Strategy & Leadership')"><div class="nav-left"><span class="dot" style="background: var(--dep-strat);"></span><span>Strategy & Leadership</span></div></div>
      <div class="nav-item" onclick="filterDepartment('Finance')"><div class="nav-left"><span class="dot" style="background: var(--dep-fin);"></span><span>Finance</span></div></div>
      <div class="nav-item" onclick="filterDepartment('Data & Analytics')"><div class="nav-left"><span class="dot" style="background: var(--dep-data);"></span><span>Data & Analytics</span></div></div>
      <div class="nav-item" onclick="filterDepartment('Legal, Risk & Compliance')"><div class="nav-left"><span class="dot" style="background: var(--dep-legal);"></span><span>Legal, Risk & Compliance</span></div></div>
    </div>
  </aside>

  <!-- 2. MAIN FULL-BLEED AREA -->
  <main id="main-content">
    <div class="top-toolbar">
      <div class="toolbar-left">
        <button class="toggle-sidebar-btn" onclick="toggleSidebar()">☰</button>
        <div class="breadcrumbs">
          <span>Demo Company</span>
          <span>/</span>
          <strong>Organisation Brain</strong>
          <span class="tag-badge">757 Entities • 1,847 Links</span>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <button class="hud-btn" onclick="toggleTheme()">🌓 <span id="theme-label">Dark</span></button>
        <div class="view-toggles">
          <button class="view-btn active" id="btn-v-galaxy" onclick="switchView('galaxy')">🪐 Galaxy Orbit</button>
          <button class="view-btn" id="btn-v-doc" onclick="switchView('doc')">📄 Claude View</button>
        </div>
      </div>
    </div>

    <!-- CANVAS VIEW -->
    <div id="canvas-container">
      <canvas id="galaxy-canvas"></canvas>

      <div class="canvas-hud">
        <button class="hud-btn" onclick="zoomIn()">➕ Zoom In</button>
        <button class="hud-btn" onclick="zoomOut()">➖ Zoom Out</button>
        <button class="hud-btn" onclick="fitView()">🎯 Fit View</button>
        <button class="hud-btn" onclick="toggleRotation()">🔄 <span id="rot-lbl">Pause</span></button>
      </div>

      <div id="tooltip"></div>
    </div>

    <!-- CLAUDE DOCUMENT VIEW -->
    <div id="doc-view">
      <div class="doc-container">
        <h2 style="font-size: 18px; font-weight: 800; margin-bottom: 4px;">Conducting AI / DEV-HARNESS v2.0 Task Force</h2>
        <p style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 20px;">Executive roadmap, responsibility allocation, and verified deliverables.</p>

        <table class="doc-table">
          <thead>
            <tr><th>Member / Agent</th><th>Role</th><th>Current Focus & Deliverables</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Marcus Chen</strong> [Lead]</td><td style="color:var(--text-muted);">Chief Strategy Officer</td><td>Employee Onboarding Automation — package for board presentation to secure Phase 2 budget.</td></tr>
            <tr><td><strong>Andrew Kowalski</strong> [Lead]</td><td style="color:var(--text-muted);">CTO</td><td>Ensure infra readiness for the two active projects and start scoping Phase 2 architecture.</td></tr>
            <tr><td><strong>Nina Petrov</strong></td><td style="color:var(--text-muted);">AI Engineer</td><td>Hands-on delivery across both active projects — focus on agent performance tuning.</td></tr>
            <tr><td><strong>Dr. Anika Gupta</strong></td><td style="color:var(--text-muted);">Head of Data & Analytics</td><td>Stand up usage/adoption dashboards to track 80% WAU target per department.</td></tr>
          </tbody>
        </table>

        <div class="summary-card">
          <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">Executive Summary</h3>
          <p style="font-size: 12.5px; color: var(--text-muted); line-height: 1.5;">
            The task force is in solid shape: one project shipped, two running in parallel, and Phase 1 deployment deadline is within reach.
          </p>
        </div>
      </div>
    </div>
  </main>

  <script>
    const canvas = document.getElementById('galaxy-canvas');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');

    let nodes = [];
    let camera = { x: 0, y: 0, zoom: 1.0 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let hoveredNode = null;
    let selectedDepartment = null;
    let rotationAngle = 0;
    let isRotating = true;

    const DEPARTMENTS = [
      { name: 'Product Management', color: '#ea580c' },
      { name: 'Marketing & Growth', color: '#dc2626' },
      { name: 'Sales', color: '#16a34a' },
      { name: 'Customer & Admin', color: '#0d9488' },
      { name: 'Operations & Supply Chain', color: '#b45309' },
      { name: 'Tech, AI & Automations', color: '#4f46e5' },
      { name: 'Strategy & Leadership', color: '#2563eb' },
      { name: 'Finance', color: '#ca8a04' },
      { name: 'Data & Analytics', color: '#0284c7' },
      { name: 'Legal, Risk & Compliance', color: '#9333ea' }
    ];

    function resizeCanvas() {
      const container = document.getElementById('canvas-container');
      canvas.width = container.clientWidth * window.devicePixelRatio;
      canvas.height = container.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    window.addEventListener('resize', () => { resizeCanvas(); fitView(); });

    function initData() {
      nodes = [];

      // 1. Center Avatar "D"
      nodes.push({
        id: 'root-d',
        name: 'Demo Company',
        kind: 'core',
        color: '#ca8a04',
        radius: 22,
        ringIdx: 0,
        orbitR: 0,
        angle: 0,
        shape: 'avatar'
      });

      // 2. Build Multi-Tier High-Density Orbital Sectors that elegantly fill the entire viewport!
      DEPARTMENTS.forEach((dep, dIdx) => {
        const baseAngle = (dIdx / DEPARTMENTS.length) * Math.PI * 2;

        // Tier 1: Department Hub
        nodes.push({
          id: 'dep-' + dIdx,
          name: dep.name,
          department: dep.name,
          kind: 'department',
          color: dep.color,
          radius: 9,
          ringIdx: 1,
          orbitR: 0.18, // Normalized multiplier of viewport min-dimension
          angle: baseAngle,
          shape: 'circle'
        });

        // Tier 2: Systems (Dense curved arc of squares)
        for (let s = 0; s < 14; s++) {
          const arcAngle = baseAngle + (s - 6.5) * 0.038;
          nodes.push({
            id: \`sys-\${dIdx}-\${s}\`,
            name: \`\${dep.name} System #\${s+1}\`,
            department: dep.name,
            kind: 'system',
            color: dep.color,
            radius: 4,
            ringIdx: 2,
            orbitR: 0.34 + (s % 3) * 0.015,
            angle: arcAngle,
            shape: (s % 2 === 0) ? 'square' : 'circle'
          });
        }

        // Tier 3: Workflows (Dense sweeping arc of beads)
        for (let w = 0; w < 28; w++) {
          const arcAngle = baseAngle + (w - 13.5) * 0.021;
          nodes.push({
            id: \`wf-\${dIdx}-\${w}\`,
            name: \`\${dep.name} Workflow #\${w+1}\`,
            department: dep.name,
            kind: 'workflow',
            color: dep.color,
            radius: 3,
            ringIdx: 3,
            orbitR: 0.52 + (w % 4) * 0.018,
            angle: arcAngle,
            shape: 'circle'
          });
        }

        // Tier 4: People & Agents (Outer wide celestial band)
        for (let p = 0; p < 22; p++) {
          const arcAngle = baseAngle + (p - 10.5) * 0.026;
          nodes.push({
            id: \`ppl-\${dIdx}-\${p}\`,
            name: \`\${dep.name} Agent #\${p+1}\`,
            department: dep.name,
            kind: 'agent',
            color: dep.color,
            radius: 3.5,
            ringIdx: 4,
            orbitR: 0.72 + (p % 3) * 0.02,
            angle: arcAngle,
            shape: 'diamond'
          });
        }
      });
    }

    function animate() {
      if (isRotating) {
        rotationAngle += 0.0007;
      }
      render();
      requestAnimationFrame(animate);
    }

    function render() {
      const container = document.getElementById('canvas-container');
      const width = container.clientWidth;
      const height = container.clientHeight;
      const baseDim = Math.min(width, height) / 2; // Dynamic viewport sizing

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2 + camera.x;
      const centerY = height / 2 + camera.y;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(camera.zoom, camera.zoom);

      // 1. Concentric Radial Orbit Guide Lines
      const ringsNorm = [0.18, 0.35, 0.53, 0.73, 0.88];
      ringsNorm.forEach(rn => {
        const radius = baseDim * rn;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--ring-guide');
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 2. Focused Connection Lines
      if (selectedDepartment) {
        const depNode = nodes.find(n => n.kind === 'department' && n.department === selectedDepartment);
        if (depNode) {
          const curAngle = depNode.angle + rotationAngle;
          const depR = baseDim * depNode.orbitR;
          const dx = Math.cos(curAngle) * depR;
          const dy = Math.sin(curAngle) * depR;

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(dx, dy);
          ctx.strokeStyle = depNode.color + 'aa';
          ctx.lineWidth = 2;
          ctx.stroke();

          nodes.forEach(node => {
            if (node.department === selectedDepartment && node.orbitR > 0.18) {
              const nAngle = node.angle + rotationAngle;
              const nR = baseDim * node.orbitR;
              const nx = Math.cos(nAngle) * nR;
              const ny = Math.sin(nAngle) * nR;

              ctx.beginPath();
              ctx.moveTo(dx, dy);
              ctx.lineTo(nx, ny);
              ctx.strokeStyle = depNode.color + '33';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        }
      }

      // 3. Render Nodes
      nodes.forEach(node => {
        const curAngle = (node.orbitR === 0) ? 0 : (node.angle + rotationAngle);
        const curR = baseDim * node.orbitR;
        const nx = Math.cos(curAngle) * curR;
        const ny = Math.sin(curAngle) * curR;
        node.currentX = nx;
        node.currentY = ny;

        const isHighlighted = !selectedDepartment || node.department === selectedDepartment || node.kind === 'core';
        const alpha = isHighlighted ? 'ff' : '22';

        if (node.shape === 'avatar') {
          // Center "D" Avatar
          ctx.beginPath();
          ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#ca8a04';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('D', 0, 0);
          ctx.textBaseline = 'alphabetic';
        } else if (node.shape === 'square') {
          ctx.fillStyle = node.color + alpha;
          ctx.fillRect(nx - node.radius, ny - node.radius, node.radius * 2, node.radius * 2);
        } else if (node.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(nx, ny - node.radius);
          ctx.lineTo(nx + node.radius, ny);
          ctx.lineTo(nx, ny + node.radius);
          ctx.lineTo(nx - node.radius, ny);
          ctx.closePath();
          ctx.fillStyle = node.color + alpha;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = node.color + alpha;
          ctx.fill();
        }

        if (hoveredNode && hoveredNode.id === node.id) {
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2;
          ctx.stroke();
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
        const dist = Math.hypot(node.currentX - localX, node.currentY - localY);
        if (dist <= Math.max(9, node.radius + 3)) {
          return node;
        }
      }
      return null;
    }

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
          tooltip.style.left = (e.clientX + 14) + 'px';
          tooltip.style.top = (e.clientY + 14) + 'px';
          tooltip.innerHTML = '<strong>' + hit.name + '</strong><br><span style="font-size:10px;opacity:0.7;">' + (hit.department || hit.kind).toUpperCase() + '</span>';
        } else {
          tooltip.style.opacity = '0';
        }
      }
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      camera.zoom = Math.max(0.4, Math.min(3.0, camera.zoom * factor));
    });

    container.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const hit = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
      if (hit && hit.department) {
        filterDepartment(hit.department);
      }
    });

    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('collapsed');
      setTimeout(resizeCanvas, 300);
    }

    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      document.getElementById('theme-label').innerText = next === 'dark' ? 'Light' : 'Dark';
    }

    function zoomIn() { camera.zoom = Math.min(3.0, camera.zoom * 1.2); }
    function zoomOut() { camera.zoom = Math.max(0.4, camera.zoom / 1.2); }
    function fitView() { camera = { x: 0, y: 0, zoom: 1.0 }; }

    function toggleRotation() {
      isRotating = !isRotating;
      document.getElementById('rot-lbl').innerText = isRotating ? 'Pause' : 'Resume';
    }

    function filterDepartment(depName) {
      selectedDepartment = depName;
      document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', depName ? el.innerText.includes(depName) : el.innerText.includes('All Entities'));
      });
    }

    function switchView(view) {
      const isGalaxy = (view === 'galaxy');
      document.getElementById('canvas-container').style.display = isGalaxy ? 'block' : 'none';
      document.getElementById('doc-view').style.display = isGalaxy ? 'none' : 'block';

      document.getElementById('btn-v-galaxy').classList.toggle('active', isGalaxy);
      document.getElementById('btn-v-doc').classList.toggle('active', !isGalaxy);
    }

    function handleSearch() {
      const q = document.getElementById('sidebar-search').value.toLowerCase();
      if (!q) { filterDepartment(null); return; }
      const match = DEPARTMENTS.find(d => d.name.toLowerCase().includes(q));
      if (match) {
        filterDepartment(match.name);
      }
    }

    resizeCanvas();
    initData();
    animate();
    fitView();
  </script>
</body>
</html>`;
}
