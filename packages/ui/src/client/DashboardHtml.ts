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
      --bg-base: #fcfdfd;
      --bg-surface: #ffffff;
      --bg-sidebar: #fafbfd;
      --border-soft: #edf2f7;
      --border-subtle: #e2e8f0;
      
      --text-main: #1e293b;
      --text-muted: #64748b;
      --text-faint: #94a3b8;

      /* Conducting AI Harmonic Pastel Palette */
      --c-pm: #f97316;
      --c-mktg: #ef4444;
      --c-sales: #10b981;
      --c-cust: #14b8a6;
      --c-ops: #d97706;
      --c-tech: #6366f1;
      --c-strat: #3b82f6;
      --c-fin: #eab308;
      --c-data: #0ea5e9;
      --c-legal: #a855f7;
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
    }

    /* 1. DUAL-COLUMN LEFT SIDEBAR */
    #sidebar-wrapper {
      display: flex;
      height: 100vh;
      border-right: 1px solid var(--border-soft);
      background: #ffffff;
      z-index: 30;
      box-shadow: 2px 0 12px rgba(0, 0, 0, 0.02);
    }

    .sidebar-primary {
      width: 230px;
      min-width: 230px;
      border-right: 1px solid var(--border-soft);
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--bg-sidebar);
    }

    .sidebar-secondary {
      width: 270px;
      min-width: 270px;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #ffffff;
      border-right: 1px solid var(--border-soft);
    }

    .org-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-soft);
      display: flex;
      align-items: center;
      gap: 10px;
      background: #ffffff;
    }

    .org-avatar {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 800;
      font-size: 13px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
    }

    .org-meta h2 {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.2;
    }

    .org-meta p {
      font-size: 10.5px;
      color: var(--text-muted);
    }

    .search-wrap {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border-soft);
      background: #ffffff;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      border: 1px solid var(--border-soft);
      border-radius: 6px;
      padding: 5px 8px;
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
      padding: 10px 6px;
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

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      margin-bottom: 1px;
      transition: all 0.12s;
    }

    .nav-item:hover {
      background: #f1f5f9;
      color: var(--text-main);
    }

    .nav-item.active {
      background: #ffffff;
      color: var(--text-main);
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      border: 1px solid var(--border-soft);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .count-pill {
      font-size: 10.5px;
      font-weight: 600;
      color: var(--text-faint);
    }

    /* SECONDARY COLUMN - DEPARTMENT DETAILS */
    .dep-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-soft);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dep-badge {
      width: 28px;
      height: 28px;
      background: var(--c-sales);
      color: #ffffff;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
    }

    .dep-meta h3 {
      font-size: 13.5px;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.2;
    }

    .dep-meta p {
      font-size: 9.5px;
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

    .avatar-mini {
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background: #e2e8f0;
      font-size: 8.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #334155;
    }

    /* 2. MAIN ORGANIC CANVAS */
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
      border-bottom: 1px solid var(--border-soft);
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

    /* FULL-SIZE CANVAS VIEWPORT */
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

    #galaxy-canvas {
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
      border: 1px solid var(--border-soft);
      border-radius: 6px;
      padding: 5px 11px;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--text-main);
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s;
    }

    .hud-btn:hover { background: #f8fafc; border-color: var(--border-subtle); }

    #tooltip {
      position: absolute;
      pointer-events: none;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      opacity: 0;
      transition: opacity 0.1s ease;
      z-index: 40;
    }
  </style>
</head>
<body>

  <!-- DUAL SIDEBAR -->
  <div id="sidebar-wrapper">
    <!-- Primary Taxonomy -->
    <aside class="sidebar-primary">
      <div class="org-header">
        <div class="org-avatar">D</div>
        <div class="org-meta">
          <h2>Demo Company</h2>
          <p>Organisation Brain</p>
        </div>
      </div>

      <div class="search-wrap">
        <div class="search-box">
          <span>🔍</span>
          <input type="text" placeholder="Search entities..." id="search-input" oninput="handleSearch()">
        </div>
      </div>

      <div class="sidebar-scroll">
        <div class="sec-label">By Entity Type</div>
        <div class="nav-item active" onclick="selectDepartment(null)"><div class="nav-left"><span>🏢</span><span>All Entities</span></div><span class="count-pill">757</span></div>
        <div class="nav-item"><div class="nav-left"><span>👥</span><span>People</span></div><span class="count-pill">75</span></div>
        <div class="nav-item"><div class="nav-left"><span>🤖</span><span>Sub-Agents</span></div><span class="count-pill">34</span></div>
        <div class="nav-item"><div class="nav-left"><span>🛠️</span><span>Tools</span></div><span class="count-pill">145</span></div>
        <div class="nav-item"><div class="nav-left"><span>⚡</span><span>Workflows</span></div><span class="count-pill">198</span></div>
        <div class="nav-item"><div class="nav-left"><span>📜</span><span>SOPs</span></div><span class="count-pill">224</span></div>
        <div class="nav-item"><div class="nav-left"><span>📁</span><span>Projects</span></div><span class="count-pill">12</span></div>

        <div class="sec-label">Departments</div>
        <div class="nav-item" onclick="selectDepartment('Product Management')"><div class="nav-left"><span class="dot" style="background:var(--c-pm);"></span><span>Product Management</span></div></div>
        <div class="nav-item" onclick="selectDepartment('Marketing & Growth')"><div class="nav-left"><span class="dot" style="background:var(--c-mktg);"></span><span>Marketing & Growth</span></div></div>
        <div class="nav-item active" onclick="selectDepartment('Sales')"><div class="nav-left"><span class="dot" style="background:var(--c-sales);"></span><span>Sales</span></div></div>
        <div class="nav-item" onclick="selectDepartment('Customer & Admin')"><div class="nav-left"><span class="dot" style="background:var(--c-cust);"></span><span>Customer & Admin</span></div></div>
        <div class="nav-item" onclick="selectDepartment('Operations & Supply Chain')"><div class="nav-left"><span class="dot" style="background:var(--c-ops);"></span><span>Operations & Supply Chain</span></div></div>
        <div class="nav-item" onclick="selectDepartment('Tech, AI & Automations')"><div class="nav-left"><span class="dot" style="background:var(--c-tech);"></span><span>Tech, AI & Automations</span></div></div>
        <div class="nav-item" onclick="selectDepartment('Strategy & Leadership')"><div class="nav-left"><span class="dot" style="background:var(--c-strat);"></span><span>Strategy & Leadership</span></div></div>
        <div class="nav-item" onclick="selectDepartment('Finance')"><div class="nav-left"><span class="dot" style="background:var(--c-fin);"></span><span>Finance</span></div></div>
        <div class="nav-item" onclick="selectDepartment('Data & Analytics')"><div class="nav-left"><span class="dot" style="background:var(--c-data);"></span><span>Data & Analytics</span></div></div>
        <div class="nav-item" onclick="selectDepartment('Legal, Risk & Compliance')"><div class="nav-left"><span class="dot" style="background:var(--c-legal);"></span><span>Legal, Risk & Compliance</span></div></div>
      </div>
    </aside>

    <!-- Secondary Inspector (Exact match to Reference Screenshot) -->
    <aside class="sidebar-secondary">
      <div class="dep-header">
        <div class="dep-badge" id="dep-icon">🏢</div>
        <div class="dep-meta">
          <h3 id="dep-name">Sales</h3>
          <p>DEPARTMENT • DEMO COMPANY</p>
        </div>
      </div>

      <div class="sidebar-scroll">
        <div class="sec-label">AI Systems</div>
        <div class="detail-item"><span>🤖</span><span id="dep-sys-1">Sales AI Copilot</span></div>
        <div class="detail-item"><span>🧠</span><span id="dep-sys-2">Sales AI Brain</span></div>
        <div class="detail-item"><span>⚡</span><span id="dep-sys-3">Sales Autonomous Agent</span></div>

        <div class="sec-label">People & Leads</div>
        <div class="detail-item"><span class="avatar-mini">MT</span><span>Michael Torres</span></div>
        <div class="detail-item"><span class="avatar-mini">OH</span><span>Omar Hassan</span></div>
        <div class="detail-item"><span class="avatar-mini">RG</span><span>Rachel Green</span></div>
        <div class="detail-item"><span class="avatar-mini">SR</span><span>Samantha Reed</span></div>
        <div class="detail-item"><span class="avatar-mini">LC</span><span>Lisa Chang</span></div>
        <div class="detail-item"><span class="avatar-mini">DP</span><span>David Park</span></div>

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

        <div class="sec-label">Tools & Integrations</div>
        <div class="detail-item"><span>📁</span><span>Notion</span></div>
        <div class="detail-item"><span>📋</span><span>Asana</span></div>
        <div class="detail-item"><span>✨</span><span>Claude / Anthropic</span></div>
        <div class="detail-item"><span>🎯</span><span>Apollo.io</span></div>
      </div>
    </aside>
  </div>

  <!-- MAIN CANVAS -->
  <main id="main-content">
    <div class="top-toolbar">
      <div class="breadcrumbs">
        <span>Demo Company</span>
        <span>/</span>
        <strong>Organisation Brain</strong>
        <span class="tag-badge">Entities: <strong>757</strong> • Connections: <strong>1,847</strong></span>
      </div>

      <div style="font-size: 12px; font-weight: 600; color: var(--text-muted);">
        Organic Celestial Graph
      </div>
    </div>

    <div id="canvas-container">
      <canvas id="galaxy-canvas"></canvas>

      <div class="hud-controls">
        <button class="hud-btn" onclick="zoomIn()">➕ Zoom In</button>
        <button class="hud-btn" onclick="zoomOut()">➖ Zoom Out</button>
        <button class="hud-btn" onclick="fitView()">🎯 Fit View</button>
        <button class="hud-btn" onclick="toggleRotation()">🔄 <span id="rot-lbl">Pause</span></button>
      </div>

      <div id="tooltip"></div>
    </div>
  </main>

  <script>
    const canvas = document.getElementById('galaxy-canvas');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');

    let nodes = [];
    let camera = { x: 0, y: 0, zoom: 0.95 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let hoveredNode = null;
    let activeDepartment = 'Sales';
    let rotationAngle = 0;
    let isRotating = true;
    let waveTime = 0;

    const DEPARTMENTS = [
      { name: 'Product Management', color: '#f97316' },
      { name: 'Marketing & Growth', color: '#ef4444' },
      { name: 'Sales', color: '#10b981' },
      { name: 'Customer & Admin', color: '#14b8a6' },
      { name: 'Operations & Supply Chain', color: '#d97706' },
      { name: 'Tech, AI & Automations', color: '#6366f1' },
      { name: 'Strategy & Leadership', color: '#3b82f6' },
      { name: 'Finance', color: '#eab308' },
      { name: 'Data & Analytics', color: '#0ea5e9' },
      { name: 'Legal, Risk & Compliance', color: '#a855f7' }
    ];

    function resizeCanvas() {
      const container = document.getElementById('canvas-container');
      canvas.width = container.clientWidth * window.devicePixelRatio;
      canvas.height = container.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    window.addEventListener('resize', resizeCanvas);

    function initOrganicGalaxy() {
      nodes = [];

      // 1. Center Root Node "D"
      nodes.push({
        id: 'node-root',
        name: 'Demo Company',
        kind: 'core',
        color: '#ca8a04',
        radius: 20,
        orbitR: 0,
        angle: 0,
        shape: 'avatar'
      });

      // 2. Generate Graceful Fluid Concentric Celestial Rings
      DEPARTMENTS.forEach((dep, dIdx) => {
        const baseAngle = (dIdx / DEPARTMENTS.length) * Math.PI * 2;

        // Department Hub
        nodes.push({
          id: 'dep-' + dep.name,
          name: dep.name,
          department: dep.name,
          kind: 'department',
          color: dep.color,
          radius: 9.5,
          orbitR: 0.17,
          angle: baseAngle,
          shape: 'circle'
        });

        // Systems (Soft square beads flowing in concentric arc)
        for (let s = 0; s < 14; s++) {
          const arcAngle = baseAngle + (s - 6.5) * 0.032;
          nodes.push({
            id: \`sys-\${dIdx}-\${s}\`,
            name: \`\${dep.name} System #\${s+1}\`,
            department: dep.name,
            kind: 'system',
            color: dep.color,
            radius: 4,
            orbitR: 0.33 + (s % 3) * 0.015,
            angle: arcAngle,
            shape: (s % 2 === 0) ? 'square' : 'circle',
            jitterPhase: Math.random() * Math.PI * 2
          });
        }

        // Workflows & SOPs (Fine rounded pearls)
        for (let w = 0; w < 28; w++) {
          const arcAngle = baseAngle + (w - 13.5) * 0.018;
          nodes.push({
            id: \`wf-\${dIdx}-\${w}\`,
            name: \`\${dep.name} Workflow #\${w+1}\`,
            department: dep.name,
            kind: 'workflow',
            color: dep.color,
            radius: 3.2,
            orbitR: 0.50 + (w % 4) * 0.016,
            angle: arcAngle,
            shape: 'circle',
            jitterPhase: Math.random() * Math.PI * 2
          });
        }

        // People & Agents (Outer wide celestial band with diamonds and avatars)
        for (let p = 0; p < 22; p++) {
          const arcAngle = baseAngle + (p - 10.5) * 0.022;
          nodes.push({
            id: \`ppl-\${dIdx}-\${p}\`,
            name: \`\${dep.name} Specialist #\${p+1}\`,
            department: dep.name,
            kind: 'agent',
            color: dep.color,
            radius: 3.8,
            orbitR: 0.69 + (p % 3) * 0.018,
            angle: arcAngle,
            shape: 'diamond',
            jitterPhase: Math.random() * Math.PI * 2
          });
        }
      });
    }

    function animate() {
      if (isRotating) {
        rotationAngle += 0.0006;
      }
      waveTime += 0.015;
      render();
      requestAnimationFrame(animate);
    }

    function render() {
      const container = document.getElementById('canvas-container');
      const width = container.clientWidth;
      const height = container.clientHeight;
      const baseDim = Math.min(width, height) / 2;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2 + camera.x;
      const centerY = height / 2 + camera.y;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(camera.zoom, camera.zoom);

      // 1. Center Soft Warm Ambient Halo
      const sunGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 90);
      sunGlow.addColorStop(0, 'rgba(234, 179, 8, 0.12)');
      sunGlow.addColorStop(0.5, 'rgba(234, 179, 8, 0.04)');
      sunGlow.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.fill();

      // 2. Delicate Concentric Orbit Guide Arcs
      const ringsNorm = [0.17, 0.34, 0.51, 0.70, 0.84];
      ringsNorm.forEach(rn => {
        const radius = baseDim * rn;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.65)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Smooth Curved Bezier Connections when department is selected (Mềm mại, cong tự nhiên!)
      if (activeDepartment) {
        const depNode = nodes.find(n => n.kind === 'department' && n.department === activeDepartment);
        if (depNode) {
          const curAngle = depNode.angle + rotationAngle;
          const depR = baseDim * depNode.orbitR;
          const dx = Math.cos(curAngle) * depR;
          const dy = Math.sin(curAngle) * depR;

          // Soft Glowing Halo around Active Department
          const depGlow = ctx.createRadialGradient(dx, dy, 0, dx, dy, 70);
          depGlow.addColorStop(0, depNode.color + '22');
          depGlow.addColorStop(1, depNode.color + '00');
          ctx.fillStyle = depGlow;
          ctx.beginPath();
          ctx.arc(dx, dy, 70, 0, Math.PI * 2);
          ctx.fill();

          // Smooth curved connection Center -> Active Department
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(dx * 0.5 + Math.sin(curAngle) * 20, dy * 0.5 - Math.cos(curAngle) * 20, dx, dy);
          ctx.strokeStyle = depNode.color + '99';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Delicate Bezier Splines from Department to Sub-nodes
          nodes.forEach(node => {
            if (node.department === activeDepartment && node.orbitR > 0.17) {
              const nAngle = node.angle + rotationAngle;
              const nR = baseDim * node.orbitR;
              const nx = Math.cos(nAngle) * nR;
              const ny = Math.sin(nAngle) * nR;

              // Smooth curved bezier spline
              const midX = (dx + nx) / 2 + Math.sin(nAngle) * 8;
              const midY = (dy + ny) / 2 - Math.cos(nAngle) * 8;

              ctx.beginPath();
              ctx.moveTo(dx, dy);
              ctx.quadraticCurveTo(midX, midY, nx, ny);
              ctx.strokeStyle = depNode.color + '38';
              ctx.lineWidth = 1.0;
              ctx.stroke();
            }
          });
        }
      }

      // 4. Render Nodes with Soft Anti-aliasing & Floating Harmonic Wave
      nodes.forEach(node => {
        const curAngle = (node.orbitR === 0) ? 0 : (node.angle + rotationAngle);
        // Subtle organic breathing float
        const breath = (node.jitterPhase) ? Math.sin(waveTime + node.jitterPhase) * 1.5 : 0;
        const curR = baseDim * node.orbitR + breath;
        const nx = Math.cos(curAngle) * curR;
        const ny = Math.sin(curAngle) * curR;
        node.currentX = nx;
        node.currentY = ny;

        const isRelated = (!activeDepartment || node.department === activeDepartment || node.kind === 'core');
        // Non-active nodes maintain 55% soft pastel visibility instead of turning ghostly/ugly!
        const alpha = isRelated ? 'ff' : '66';

        if (node.shape === 'avatar') {
          // Center "D" Node
          ctx.beginPath();
          ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('D', 0, 0);
          ctx.textBaseline = 'alphabetic';
        } else if (node.shape === 'square') {
          // Soft Rounded Square
          ctx.fillStyle = node.color + alpha;
          ctx.fillRect(nx - node.radius, ny - node.radius, node.radius * 2, node.radius * 2);
        } else if (node.shape === 'diamond') {
          // Delicate Diamond
          ctx.beginPath();
          ctx.moveTo(nx, ny - node.radius);
          ctx.lineTo(nx + node.radius, ny);
          ctx.lineTo(nx, ny + node.radius);
          ctx.lineTo(nx - node.radius, ny);
          ctx.closePath();
          ctx.fillStyle = node.color + alpha;
          ctx.fill();
        } else {
          // Soft Circular Pearl
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = node.color + alpha;
          ctx.fill();
        }

        // Active Department Green Ring Halo
        if (node.department === activeDepartment && node.kind === 'department') {
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2.2;
          ctx.stroke();
        }

        // Hover Effect
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
      if (depName) {
        document.getElementById('dep-name').innerText = depName;
        const depObj = DEPARTMENTS.find(d => d.name === depName) || { color: '#10b981' };
        document.getElementById('dep-icon').style.background = depObj.color;

        document.getElementById('dep-sys-1').innerText = depName + ' AI Copilot';
        document.getElementById('dep-sys-2').innerText = depName + ' AI Brain';
        document.getElementById('dep-sys-3').innerText = depName + ' Autonomous Agent';
      }

      document.querySelectorAll('.nav-item').forEach(link => {
        link.classList.toggle('active', depName ? link.innerText.includes(depName) : link.innerText.includes('All Entities'));
      });
    }

    function zoomIn() { camera.zoom = Math.min(3.0, camera.zoom * 1.2); }
    function zoomOut() { camera.zoom = Math.max(0.4, camera.zoom / 1.2); }
    function fitView() { camera = { x: 0, y: 0, zoom: 0.95 }; }

    function toggleRotation() {
      isRotating = !isRotating;
      document.getElementById('rot-lbl').innerText = isRotating ? 'Pause' : 'Resume';
    }

    function handleSearch() {
      const q = document.getElementById('search-input').value.toLowerCase();
      if (!q) { selectDepartment(null); return; }
      const match = DEPARTMENTS.find(d => d.name.toLowerCase().includes(q));
      if (match) {
        selectDepartment(match.name);
      }
    }

    resizeCanvas();
    initOrganicGalaxy();
    animate();
    fitView();
  </script>
</body>
</html>`;
}
