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
      --bg-base: #fbfcfd;
      --bg-surface: #ffffff;
      --border: #e9ecef;
      --border-dark: #ced4da;
      
      --text-main: #1e293b;
      --text-muted: #64748b;
      --text-faint: #94a3b8;

      --c-sales: #16a34a;
      --c-tech: #4f46e5;
      --c-pm: #ea580c;
      --c-mktg: #dc2626;
      --c-cust: #0d9488;
      --c-ops: #b45309;
      --c-strat: #2563eb;
      --c-fin: #ca8a04;
      --c-data: #0284c7;
      --c-legal: #9333ea;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      background-color: var(--bg-base);
      color: var(--text-main);
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      display: flex;
    }

    /* 1. DUAL-COLUMN LEFT SIDEBAR (Exact match to screenshot) */
    #sidebar-wrapper {
      display: flex;
      height: 100vh;
      border-right: 1px solid var(--border);
      background: #ffffff;
      z-index: 30;
    }

    /* Column 1: Main Taxonomy */
    .sidebar-col-primary {
      width: 240px;
      min-width: 240px;
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #fbfcfd;
    }

    /* Column 2: Department Inspector (Docked side-by-side) */
    .sidebar-col-secondary {
      width: 280px;
      min-width: 280px;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #ffffff;
      border-right: 1px solid var(--border);
    }

    .org-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
      background: #ffffff;
    }

    .org-icon {
      width: 28px;
      height: 28px;
      background: #0f172a;
      border-radius: 6px;
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

    .search-container {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      background: #ffffff;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 4px 8px;
    }

    .search-box input {
      border: none;
      background: transparent;
      outline: none;
      font-family: inherit;
      font-size: 11.5px;
      width: 100%;
      color: var(--text-main);
    }

    .sidebar-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 10px 8px;
    }

    .sec-label {
      font-size: 9.5px;
      font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 6px 8px 2px;
      margin-top: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 8px;
      border-radius: 5px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      margin-bottom: 1px;
      transition: all 0.12s;
    }

    .nav-link:hover {
      background: #f1f5f9;
      color: var(--text-main);
    }

    .nav-link.active {
      background: #ffffff;
      color: var(--text-main);
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      border: 1px solid var(--border);
    }

    .nav-link-left {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .count-badge {
      font-size: 10.5px;
      font-weight: 600;
      color: var(--text-faint);
    }

    /* SECONDARY COLUMN - DEPARTMENT DETAILS (Image exact match) */
    .dep-header-box {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dep-badge-icon {
      width: 28px;
      height: 28px;
      background: var(--c-sales);
      color: #ffffff;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
    }

    .dep-title-meta h3 {
      font-size: 14px;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.2;
    }

    .dep-title-meta p {
      font-size: 10px;
      color: var(--text-faint);
      text-transform: uppercase;
      font-weight: 700;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 8px;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--text-muted);
      border-radius: 5px;
      cursor: pointer;
    }

    .detail-item:hover {
      background: #f8fafc;
      color: var(--text-main);
    }

    .avatar-circle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #cbd5e1;
      font-size: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #334155;
    }

    /* 2. MAIN NETWORK GRAPH CANVAS */
    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: relative;
      background: #ffffff;
    }

    .top-toolbar {
      height: 48px;
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      z-index: 10;
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
      background: #f1f5f9;
      padding: 2px 8px;
      border-radius: 9999px;
      color: var(--text-muted);
    }

    /* CANVAS AREA */
    #canvas-container {
      flex: 1;
      width: 100%;
      height: calc(100vh - 48px);
      position: relative;
      overflow: hidden;
      background: radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%);
      cursor: grab;
    }

    #canvas-container:active { cursor: grabbing; }

    #network-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* FLOATING CONTROLS */
    .hud-controls {
      position: absolute;
      bottom: 20px;
      left: 20px;
      display: flex;
      gap: 6px;
      z-index: 15;
    }

    .hud-btn {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 5px 10px;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--text-main);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .hud-btn:hover { background: #f8fafc; }

    #tooltip {
      position: absolute;
      pointer-events: none;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(6px);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      opacity: 0;
      transition: opacity 0.1s ease;
      z-index: 40;
    }
  </style>
</head>
<body>

  <!-- 1. DUAL-COLUMN LEFT SIDEBAR -->
  <div id="sidebar-wrapper">
    <!-- Primary Taxonomy Column -->
    <aside class="sidebar-col-primary">
      <div class="org-header">
        <div class="org-icon">D</div>
        <div class="org-title">
          <h2>Demo Company</h2>
          <p>Organisation Brain</p>
        </div>
      </div>

      <div class="search-container">
        <div class="search-box">
          <span>🔍</span>
          <input type="text" placeholder="Search entities...">
        </div>
      </div>

      <div class="sidebar-scroll">
        <div class="sec-label">By Entity Type</div>
        <div class="nav-link active" onclick="selectDepartment('Sales')"><div class="nav-link-left"><span>🏢</span><span>All</span></div><span class="count-badge">757</span></div>
        <div class="nav-link"><div class="nav-link-left"><span>👥</span><span>People</span></div><span class="count-badge">75</span></div>
        <div class="nav-link"><div class="nav-link-left"><span>🤖</span><span>Sub-Agents</span></div><span class="count-badge">34</span></div>
        <div class="nav-link"><div class="nav-link-left"><span>🛠️</span><span>Tools</span></div><span class="count-badge">145</span></div>
        <div class="nav-link"><div class="nav-link-left"><span>⚡</span><span>Workflows</span></div><span class="count-badge">198</span></div>
        <div class="nav-link"><div class="nav-link-left"><span>📜</span><span>SOPs</span></div><span class="count-badge">224</span></div>
        <div class="nav-link"><div class="nav-link-left"><span>📁</span><span>Projects</span></div><span class="count-badge">12</span></div>
        <div class="nav-link"><div class="nav-link-left"><span>👥</span><span>Teams</span></div><span class="count-badge">9</span></div>
        <div class="nav-link"><div class="nav-link-left"><span>🏢</span><span>Departments</span></div><span class="count-badge">11</span></div>

        <div class="sec-label">By Business Function</div>
        <div class="nav-link"><div class="nav-link-left"><span class="dot" style="background:#3b82f6;"></span><span>Core</span></div><span class="count-badge">451</span></div>
        <div class="nav-link"><div class="nav-link-left"><span class="dot" style="background:#8b5cf6;"></span><span>Enabling</span></div><span class="count-badge">306</span></div>

        <div class="sec-label">Departments</div>
        <div class="nav-link" onclick="selectDepartment('Product Management')"><div class="nav-link-left"><span class="dot" style="background:var(--c-pm);"></span><span>Product Management</span></div></div>
        <div class="nav-link" onclick="selectDepartment('Marketing & Growth')"><div class="nav-link-left"><span class="dot" style="background:var(--c-mktg);"></span><span>Marketing & Growth</span></div></div>
        <div class="nav-link active" onclick="selectDepartment('Sales')"><div class="nav-link-left"><span class="dot" style="background:var(--c-sales);"></span><span>Sales</span></div></div>
        <div class="nav-link" onclick="selectDepartment('Customer & Admin')"><div class="nav-link-left"><span class="dot" style="background:var(--c-cust);"></span><span>Customer & Admin</span></div></div>
        <div class="nav-link" onclick="selectDepartment('Operations & Supply Chain')"><div class="nav-link-left"><span class="dot" style="background:var(--c-ops);"></span><span>Operations & Supply Chain</span></div></div>
        <div class="nav-link" onclick="selectDepartment('Tech, AI & Automations')"><div class="nav-link-left"><span class="dot" style="background:var(--c-tech);"></span><span>Tech, AI & Automations</span></div></div>
        <div class="nav-link" onclick="selectDepartment('Strategy & Leadership')"><div class="nav-link-left"><span class="dot" style="background:var(--c-strat);"></span><span>Strategy & Leadership</span></div></div>
        <div class="nav-link" onclick="selectDepartment('Finance')"><div class="nav-link-left"><span class="dot" style="background:var(--c-fin);"></span><span>Finance</span></div></div>
        <div class="nav-link" onclick="selectDepartment('Data & Analytics')"><div class="nav-link-left"><span class="dot" style="background:var(--c-data);"></span><span>Data & Analytics</span></div></div>
        <div class="nav-link" onclick="selectDepartment('Legal, Risk & Compliance')"><div class="nav-link-left"><span class="dot" style="background:var(--c-legal);"></span><span>Legal, Risk & Compliance</span></div></div>
      </div>
    </aside>

    <!-- Secondary Inspector Column (Exact match to Reference Screenshot 4) -->
    <aside class="sidebar-col-secondary">
      <div class="dep-header-box">
        <div class="dep-badge-icon" id="dep-icon">🏢</div>
        <div class="dep-title-meta">
          <h3 id="dep-name">Sales</h3>
          <p>DEPARTMENT • PART OF DEMO COMPANY</p>
        </div>
      </div>

      <div class="sidebar-scroll">
        <div class="sec-label">AI Systems</div>
        <div class="detail-item"><span>🤖</span><span id="dep-sys-1">Sales AI Copilot</span></div>
        <div class="detail-item"><span>🧠</span><span id="dep-sys-2">Sales AI Brain</span></div>
        <div class="detail-item"><span>⚡</span><span id="dep-sys-3">Sales Autonomous Agent</span></div>

        <div class="sec-label">People & Leads</div>
        <div class="detail-item"><span class="avatar-circle">MT</span><span>Michael Torres</span></div>
        <div class="detail-item"><span class="avatar-circle">OH</span><span>Omar Hassan</span></div>
        <div class="detail-item"><span class="avatar-circle">RG</span><span>Rachel Green</span></div>
        <div class="detail-item"><span class="avatar-circle">SR</span><span>Samantha Reed</span></div>
        <div class="detail-item"><span class="avatar-circle">LC</span><span>Lisa Chang</span></div>
        <div class="detail-item"><span class="avatar-circle">DP</span><span>David Park</span></div>

        <div class="sec-label">Sub-Agents & Automations</div>
        <div class="detail-item"><span>⚙️</span><span>Account Risk and Expansion...</span></div>
        <div class="detail-item"><span>⚙️</span><span>Automated Follow Up Sequence...</span></div>
        <div class="detail-item"><span>⚙️</span><span>Competitor Intelligence Gatherer...</span></div>
        <div class="detail-item"><span>⚙️</span><span>Next-Best Action Recommender...</span></div>
        <div class="detail-item"><span>⚙️</span><span>Meeting Transcription & Auto...</span></div>
        <div class="detail-item"><span>⚙️</span><span>Intelligent Lead Scoring & Routing...</span></div>
        <div class="detail-item"><span>⚙️</span><span>Proposal & Document Generator...</span></div>
        <div class="detail-item"><span>⚙️</span><span>Prospect Research & CRM Enrichment...</span></div>
        <div class="detail-item"><span>⚙️</span><span>Sales Pipeline Health Monitor...</span></div>
        <div class="detail-item"><span>⚙️</span><span>Auto Email Labelling & Draft...</span></div>

        <div class="sec-label">Tools & Integrations</div>
        <div class="detail-item"><span>📁</span><span>Notion</span></div>
        <div class="detail-item"><span>📋</span><span>Asana</span></div>
        <div class="detail-item"><span>✨</span><span>Claude / Anthropic</span></div>
        <div class="detail-item"><span>🎯</span><span>Apollo.io</span></div>
      </div>
    </aside>
  </div>

  <!-- 2. MAIN NETWORK GRAPH CANVAS -->
  <main id="main-content">
    <div class="top-toolbar">
      <div class="breadcrumbs">
        <span>Demo Company</span>
        <span>/</span>
        <strong>Organisation Brain</strong>
        <span class="tag-badge">Entities: <strong>757</strong> • Connections: <strong>1,847</strong></span>
      </div>

      <div style="font-size: 12px; font-weight: 600; color: var(--text-muted);">
        Interactive Web Network Perspective
      </div>
    </div>

    <!-- CANVAS VIEW -->
    <div id="canvas-container">
      <canvas id="network-canvas"></canvas>

      <div class="hud-controls">
        <button class="hud-btn" onclick="zoomIn()">➕ Zoom In</button>
        <button class="hud-btn" onclick="zoomOut()">➖ Zoom Out</button>
        <button class="hud-btn" onclick="resetFocus()">🎯 Reset Focus</button>
      </div>

      <div id="tooltip"></div>
    </div>
  </main>

  <script>
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');

    let nodes = [];
    let edges = [];
    let camera = { x: -80, y: 40, zoom: 0.95 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let hoveredNode = null;
    let activeDepartment = 'Sales';

    const DEPARTMENTS = [
      { name: 'Sales', color: '#16a34a' },
      { name: 'Tech, AI & Automations', color: '#4f46e5' },
      { name: 'Product Management', color: '#ea580c' },
      { name: 'Marketing & Growth', color: '#dc2626' },
      { name: 'Customer & Admin', color: '#0d9488' },
      { name: 'Operations & Supply Chain', color: '#b45309' },
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
    window.addEventListener('resize', resizeCanvas);

    function initNetworkGraph() {
      nodes = [];
      edges = [];

      // 1. Center Root Node "D" (Demo Company)
      const root = {
        id: 'node-root',
        name: 'Demo Company',
        kind: 'core',
        color: '#ca8a04',
        radius: 20,
        x: 180,
        y: 120,
        shape: 'avatar'
      };
      nodes.push(root);

      // 2. Build Realistic Web-Link Network Structure matching the screenshot!
      DEPARTMENTS.forEach((dep, dIdx) => {
        // Base Department Hub Angle
        const depAngle = (dIdx / DEPARTMENTS.length) * Math.PI * 1.8 - 0.4;
        const depDist = 220;
        const depX = root.x + Math.cos(depAngle) * depDist;
        const depY = root.y + Math.sin(depAngle) * depDist;

        const depNode = {
          id: 'dep-' + dep.name,
          name: dep.name,
          department: dep.name,
          kind: 'department',
          color: dep.color,
          radius: (dep.name === activeDepartment) ? 14 : 9,
          x: depX,
          y: depY,
          shape: 'circle'
        };
        nodes.push(depNode);
        edges.push({ from: root.id, to: depNode.id, color: dep.color });

        // Branching People (Upper Arc with Avatars)
        const peopleList = ['MT', 'OH', 'RG', 'SR', 'LC', 'DP'];
        peopleList.forEach((p, pIdx) => {
          const pAngle = depAngle - 0.25 + (pIdx / peopleList.length) * 0.5;
          const pDist = depDist + 160 + (pIdx % 2) * 40;
          const pX = root.x + Math.cos(pAngle) * pDist;
          const pY = root.y + Math.sin(pAngle) * pDist;

          const pNode = {
            id: \`ppl-\${dep.name}-\${pIdx}\`,
            name: \`Person \${p} (\${dep.name})\`,
            department: dep.name,
            kind: 'person',
            color: '#64748b',
            radius: 8,
            x: pX,
            y: pY,
            shape: 'avatar-mini',
            avatarText: p
          };
          nodes.push(pNode);
          edges.push({ from: depNode.id, to: pNode.id, color: dep.color });
        });

        // Branching Sub-Agents & Tools (Fan of Green/Colored Squares)
        for (let a = 0; a < 8; a++) {
          const aAngle = depAngle - 0.2 + (a / 8) * 0.4;
          const aDist = depDist + 90 + (a % 3) * 25;
          const aX = root.x + Math.cos(aAngle) * aDist;
          const aY = root.y + Math.sin(aAngle) * aDist;

          const aNode = {
            id: \`agent-\${dep.name}-\${a}\`,
            name: \`\${dep.name} Sub-Agent #\${a+1}\`,
            department: dep.name,
            kind: 'subagent',
            color: dep.color,
            radius: 5,
            x: aX,
            y: aY,
            shape: 'square'
          };
          nodes.push(aNode);
          edges.push({ from: depNode.id, to: aNode.id, color: dep.color });
        }

        // Branching Workflow & SOP Beads (Yellow & Blue Beads Network)
        for (let w = 0; w < 16; w++) {
          const wAngle = depAngle - 0.3 + (w / 16) * 0.6;
          const wDist = depDist + 240 + (w % 4) * 20;
          const wX = root.x + Math.cos(wAngle) * wDist;
          const wY = root.y + Math.sin(wAngle) * wDist;

          const wNode = {
            id: \`wf-\${dep.name}-\${w}\`,
            name: \`\${dep.name} Workflow #\${w+1}\`,
            department: dep.name,
            kind: 'workflow',
            color: (w % 3 === 0) ? '#eab308' : '#3b82f6',
            radius: 3.5,
            x: wX,
            y: wY,
            shape: 'circle'
          };
          nodes.push(wNode);
          edges.push({ from: depNode.id, to: wNode.id, color: dep.color });
        }
      });
    }

    function animate() {
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

      // 1. Draw Visible Network Connecting Lines (Bezier & Straight Edges)
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return;

        const isRelated = (!activeDepartment || fromNode.department === activeDepartment || toNode.department === activeDepartment || fromNode.kind === 'core');
        const alpha = isRelated ? '55' : '0d';

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = edge.color + alpha;
        ctx.lineWidth = isRelated ? 1.5 : 0.6;
        ctx.stroke();
      });

      // 2. Render Nodes (Avatars, Circles, Squares)
      nodes.forEach(node => {
        const isRelated = (!activeDepartment || node.department === activeDepartment || node.kind === 'core');
        const alpha = isRelated ? 'ff' : '22';

        if (node.shape === 'avatar') {
          // Center "D" Root Node
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('D', node.x, node.y);
          ctx.textBaseline = 'alphabetic';
        } else if (node.shape === 'avatar-mini') {
          // People Small Round Avatar Circle with Initials
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = isRelated ? '#e2e8f0' : '#f1f5f9';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          if (isRelated) {
            ctx.fillStyle = '#334155';
            ctx.font = '700 8px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.avatarText || 'U', node.x, node.y);
            ctx.textBaseline = 'alphabetic';
          }
        } else if (node.shape === 'square') {
          // Sub-Agent Green / Colored Square
          ctx.fillStyle = node.color + alpha;
          ctx.fillRect(node.x - node.radius, node.y - node.radius, node.radius * 2, node.radius * 2);
        } else {
          // Circle Dot / Bead
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = node.color + alpha;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Selected Department Green Halo Box (Exact match to Sales node in screenshot)
        if (node.department === activeDepartment && node.kind === 'department') {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Hover Effect
        if (hoveredNode && hoveredNode.id === node.id) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
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
        const dist = Math.hypot(node.x - localX, node.y - localY);
        if (dist <= Math.max(10, node.radius + 4)) {
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
          tooltip.innerHTML = '<strong>' + hit.name + '</strong><br><span style="font-size:10px;opacity:0.8;">' + (hit.department || hit.kind).toUpperCase() + '</span>';
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
        selectDepartment(hit.department);
      }
    });

    function selectDepartment(depName) {
      activeDepartment = depName;
      document.getElementById('dep-name').innerText = depName;
      const depObj = DEPARTMENTS.find(d => d.name === depName) || { color: '#16a34a' };
      document.getElementById('dep-icon').style.background = depObj.color;

      document.getElementById('dep-sys-1').innerText = depName + ' AI Copilot';
      document.getElementById('dep-sys-2').innerText = depName + ' AI Brain';
      document.getElementById('dep-sys-3').innerText = depName + ' Autonomous Agent';

      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.innerText.includes(depName));
      });
    }

    function zoomIn() { camera.zoom = Math.min(3.0, camera.zoom * 1.2); }
    function zoomOut() { camera.zoom = Math.max(0.4, camera.zoom / 1.2); }
    function resetFocus() { camera = { x: -80, y: 40, zoom: 0.95 }; }

    resizeCanvas();
    initNetworkGraph();
    animate();
  </script>
</body>
</html>`;
}
