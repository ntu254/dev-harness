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
      --bg-main: #f8fafc;
      --bg-sidebar: #fbfcfd;
      --bg-surface: #ffffff;
      --border-subtle: #eaedf1;
      --border-strong: #cbd5e1;
      
      --text-title: #0f172a;
      --text-body: #334155;
      --text-muted: #64748b;
      --text-faint: #94a3b8;

      /* Conducting AI Department Colors (Exact from reference) */
      --dep-pm: #ea580c;       /* Product Management - Orange */
      --dep-mktg: #dc2626;     /* Marketing & Growth - Red */
      --dep-sales: #16a34a;    /* Sales - Green */
      --dep-cust: #0d9488;     /* Customer & Admin - Teal */
      --dep-ops: #b45309;      /* Operations & Supply Chain - Amber */
      --dep-tech: #4f46e5;     /* Tech, AI & Automations - Indigo */
      --dep-strat: #2563eb;    /* Strategy & Leadership - Blue */
      --dep-fin: #ca8a04;      /* Finance - Gold */
      --dep-data: #0284c7;     /* Data & Analytics - Sky */
      --dep-legal: #9333ea;    /* Legal, Risk & Compliance - Purple */
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-main);
      color: var(--text-body);
      height: 100vh;
      overflow: hidden;
      display: flex;
    }

    /* 1. LEFT CONDUCTING AI SIDEBAR */
    #sidebar {
      width: 320px;
      min-width: 320px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      height: 100vh;
      z-index: 20;
      position: relative;
    }

    .org-header {
      padding: 16px 18px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      gap: 12px;
      background: #ffffff;
    }

    .org-icon {
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

    .org-title h2 {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-title);
      letter-spacing: -0.2px;
    }

    .org-title p {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .sidebar-search {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-subtle);
      background: #ffffff;
    }

    .search-input-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f1f5f9;
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 6px 10px;
    }

    .search-input-wrap input {
      border: none;
      background: transparent;
      outline: none;
      font-family: inherit;
      font-size: 12px;
      width: 100%;
      color: var(--text-title);
    }

    .sidebar-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 12px 8px;
    }

    .sidebar-section-title {
      font-size: 10px;
      font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 8px 12px 4px;
      margin-top: 6px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.12s ease;
      margin-bottom: 1px;
    }

    .nav-item:hover {
      background: #eef2f6;
      color: var(--text-title);
    }

    .nav-item.active {
      background: #ffffff;
      color: var(--text-title);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid var(--border-subtle);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .count-pill {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-faint);
    }

    /* DEPARTMENT DETAIL SUB-VIEW IN SIDEBAR (Image 4) */
    #dep-sidebar-detail {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #ffffff;
      display: none;
      flex-direction: column;
      z-index: 25;
    }

    .back-btn-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-muted);
    }

    .back-btn-header:hover { color: var(--text-title); }

    .dep-detail-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    /* 2. MAIN VIEW AREA */
    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: relative;
      background: #ffffff;
    }

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

    .stats-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .stats-breadcrumbs strong { color: var(--text-title); }

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
      padding: 6px 14px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s;
    }

    .view-btn.active {
      background: #ffffff;
      color: var(--text-title);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    /* CANVAS VIEWPORT */
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

    /* CANVAS CONTROLS HUD */
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
      color: var(--text-title);
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .hud-btn:hover { background: #f8fafc; }

    /* 3. DOCUMENT VIEW (Claude Style - Image 5) */
    #doc-view {
      position: absolute;
      top: 56px;
      left: 0;
      width: 100%;
      height: calc(100vh - 56px);
      background: #ffffff;
      overflow-y: auto;
      padding: 36px 48px;
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
      margin-top: 24px;
      font-size: 13px;
    }

    .doc-table th {
      text-align: left;
      padding: 10px 14px;
      border-bottom: 2px solid var(--border-subtle);
      font-size: 11px;
      font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase;
    }

    .doc-table td {
      padding: 14px;
      border-bottom: 1px solid var(--border-subtle);
      vertical-align: top;
      line-height: 1.5;
    }

    .role-badge {
      font-size: 11px;
      font-weight: 700;
      background: #f1f5f9;
      color: var(--text-muted);
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 6px;
    }

    .summary-card {
      margin-top: 36px;
      background: #f8fafc;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 24px;
    }

    .summary-card h3 {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 12px;
      color: var(--text-title);
    }

    .summary-item {
      font-size: 13px;
      color: var(--text-body);
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .prompt-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border-subtle);
      font-size: 12.5px;
      color: var(--text-muted);
      font-style: italic;
    }

    /* 4. FLOATING TOOLTIP */
    #tooltip {
      position: absolute;
      pointer-events: none;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      opacity: 0;
      transition: opacity 0.12s ease;
      z-index: 40;
    }
  </style>
</head>
<body>

  <!-- 1. CONDUCTING AI SIDEBAR -->
  <aside id="sidebar">
    <div class="org-header">
      <div class="org-icon">D</div>
      <div class="org-title">
        <h2>Demo Company</h2>
        <p>Organisation Brain</p>
      </div>
    </div>

    <div class="sidebar-search">
      <div class="search-input-wrap">
        <span>🔍</span>
        <input type="text" id="sidebar-search-box" placeholder="Search entities..." oninput="handleSidebarSearch()">
      </div>
    </div>

    <!-- MAIN TREE -->
    <div class="sidebar-scroll" id="main-sidebar-tree">
      <div class="sidebar-section-title">Overview</div>
      <div class="nav-item active" onclick="showAllEntities()">
        <div class="nav-left"><span>🪐</span><span>All Entities</span></div>
        <span class="count-pill" id="cnt-all">757</span>
      </div>

      <div class="sidebar-section-title">By Entity Type</div>
      <div class="nav-item" onclick="filterByKind('people')">
        <div class="nav-left"><span>👥</span><span>People</span></div>
        <span class="count-pill">75</span>
      </div>
      <div class="nav-item" onclick="filterByKind('subagents')">
        <div class="nav-left"><span>🤖</span><span>Sub-Agents</span></div>
        <span class="count-pill">34</span>
      </div>
      <div class="nav-item" onclick="filterByKind('tools')">
        <div class="nav-left"><span>🛠️</span><span>Tools</span></div>
        <span class="count-pill">145</span>
      </div>
      <div class="nav-item" onclick="filterByKind('workflows')">
        <div class="nav-left"><span>⚡</span><span>Workflows</span></div>
        <span class="count-pill">198</span>
      </div>
      <div class="nav-item" onclick="filterByKind('sops')">
        <div class="nav-left"><span>📜</span><span>SOPs</span></div>
        <span class="count-pill">224</span>
      </div>
      <div class="nav-item" onclick="filterByKind('projects')">
        <div class="nav-left"><span>📁</span><span>Projects</span></div>
        <span class="count-pill">12</span>
      </div>
      <div class="nav-item" onclick="filterByKind('teams')">
        <div class="nav-left"><span>👥</span><span>Teams</span></div>
        <span class="count-pill">9</span>
      </div>
      <div class="nav-item" onclick="filterByKind('departments')">
        <div class="nav-left"><span>🏢</span><span>Departments</span></div>
        <span class="count-pill">11</span>
      </div>

      <div class="sidebar-section-title">By Business Function</div>
      <div class="nav-item" onclick="filterByFunction('core')">
        <div class="nav-left"><span class="dot" style="background: #3b82f6;"></span><span>Core</span></div>
        <span class="count-pill">451</span>
      </div>
      <div class="nav-item" onclick="filterByFunction('enabling')">
        <div class="nav-left"><span class="dot" style="background: #8b5cf6;"></span><span>Enabling</span></div>
        <span class="count-pill">306</span>
      </div>

      <div class="sidebar-section-title">By Core Department</div>
      <div class="nav-item" onclick="openDepartmentView('Product Management', 'var(--dep-pm)')">
        <div class="nav-left"><span class="dot" style="background: var(--dep-pm);"></span><span>Product Management</span></div>
      </div>
      <div class="nav-item" onclick="openDepartmentView('Marketing & Growth', 'var(--dep-mktg)')">
        <div class="nav-left"><span class="dot" style="background: var(--dep-mktg);"></span><span>Marketing & Growth</span></div>
      </div>
      <div class="nav-item" onclick="openDepartmentView('Sales', 'var(--dep-sales)')">
        <div class="nav-left"><span class="dot" style="background: var(--dep-sales);"></span><span>Sales</span></div>
      </div>
      <div class="nav-item" onclick="openDepartmentView('Customer & Admin', 'var(--dep-cust)')">
        <div class="nav-left"><span class="dot" style="background: var(--dep-cust);"></span><span>Customer & Admin</span></div>
      </div>
      <div class="nav-item" onclick="openDepartmentView('Operations & Supply Chain', 'var(--dep-ops)')">
        <div class="nav-left"><span class="dot" style="background: var(--dep-ops);"></span><span>Operations & Supply Chain</span></div>
      </div>
      <div class="nav-item" onclick="openDepartmentView('Tech, AI & Automations', 'var(--dep-tech)')">
        <div class="nav-left"><span class="dot" style="background: var(--dep-tech);"></span><span>Tech, AI & Automations</span></div>
      </div>
      <div class="nav-item" onclick="openDepartmentView('Strategy & Leadership', 'var(--dep-strat)')">
        <div class="nav-left"><span class="dot" style="background: var(--dep-strat);"></span><span>Strategy & Leadership</span></div>
      </div>
      <div class="nav-item" onclick="openDepartmentView('Finance', 'var(--dep-fin)')">
        <div class="nav-left"><span class="dot" style="background: var(--dep-fin);"></span><span>Finance</span></div>
      </div>
      <div class="nav-item" onclick="openDepartmentView('Data & Analytics', 'var(--dep-data)')">
        <div class="nav-left"><span class="dot" style="background: var(--dep-data);"></span><span>Data & Analytics</span></div>
      </div>
      <div class="nav-item" onclick="openDepartmentView('Legal, Risk & Compliance', 'var(--dep-legal)')">
        <div class="nav-left"><span class="dot" style="background: var(--dep-legal);"></span><span>Legal, Risk & Compliance</span></div>
      </div>
    </div>

    <!-- DEPARTMENT SUB-VIEW (Exact match to Reference Image 4) -->
    <div id="dep-sidebar-detail">
      <div class="back-btn-header" onclick="closeDepartmentView()">
        <span>←</span>
        <span>Back to Organisation Brain</span>
      </div>
      <div class="dep-detail-scroll">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
          <div id="dep-detail-dot" class="dot" style="width: 12px; height: 12px;"></div>
          <h3 id="dep-detail-title" style="font-size: 16px; font-weight: 800;">Sales</h3>
        </div>
        <p style="font-size: 11px; color: var(--text-faint); text-transform: uppercase; font-weight: 700; margin-bottom: 20px;">DEPARTMENT • PART OF DEMO COMPANY</p>

        <div class="sidebar-section-title">AI Systems</div>
        <div class="nav-item"><div class="nav-left"><span>🤖</span><span id="dep-sys-1">Sales AI Copilot</span></div></div>
        <div class="nav-item"><div class="nav-left"><span>🧠</span><span id="dep-sys-2">Sales AI Brain</span></div></div>
        <div class="nav-item"><div class="nav-left"><span>⚡</span><span id="dep-sys-3">Sales Autonomous Agent</span></div></div>

        <div class="sidebar-section-title">People & Leads</div>
        <div id="dep-people-list">
          <div class="nav-item"><div class="nav-left"><span>👤</span><span>Michael Torres</span></div></div>
          <div class="nav-item"><div class="nav-left"><span>👤</span><span>Omar Hassan</span></div></div>
          <div class="nav-item"><div class="nav-left"><span>👤</span><span>Rachel Green</span></div></div>
        </div>

        <div class="sidebar-section-title">Sub-Agents & Automations</div>
        <div id="dep-agents-list">
          <div class="nav-item"><div class="nav-left"><span>⚙️</span><span>Account Risk and Expansion...</span></div></div>
          <div class="nav-item"><div class="nav-left"><span>⚙️</span><span>Automated Follow Up Sequence...</span></div></div>
          <div class="nav-item"><div class="nav-left"><span>⚙️</span><span>Competitor Intelligence Gatherer...</span></div></div>
        </div>
      </div>
    </div>
  </aside>

  <!-- 2. MAIN CONTENT AREA -->
  <main id="main-content">
    <div class="top-toolbar">
      <div class="stats-breadcrumbs">
        <span>Demo Company</span>
        <span>/</span>
        <strong>Organisation Brain</strong>
        <span style="font-size: 11px; background: #f1f5f9; padding: 3px 8px; border-radius: 9999px; margin-left: 8px;">Entities: <strong>757</strong> • Connections: <strong>1,847</strong></span>
      </div>

      <div class="view-toggles">
        <button class="view-btn active" id="btn-view-galaxy" onclick="switchMainView('galaxy')">🪐 Galaxy Orbit</button>
        <button class="view-btn" id="btn-view-doc" onclick="switchMainView('doc')">📄 Claude Summary View</button>
      </div>
    </div>

    <!-- CANVAS VIEW -->
    <div id="canvas-container">
      <canvas id="galaxy-canvas"></canvas>

      <div class="canvas-hud">
        <button class="hud-btn" onclick="resetZoom()">🎯 Center Galaxy</button>
        <button class="hud-btn" onclick="toggleRotation()">🔄 <span id="rot-label">Pause Orbit</span></button>
      </div>

      <div id="tooltip"></div>
    </div>

    <!-- CLAUDE DOCUMENT / EXECUTIVE REPORT VIEW (Exact match to Reference Image 5) -->
    <div id="doc-view">
      <div class="doc-container">
        <h2 style="font-size: 20px; font-weight: 800; color: var(--text-title); margin-bottom: 4px;">Conducting AI / DEV-HARNESS v2.0 Task Force</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 24px;">Executive roadmap, responsibility allocation, and verified deliverables.</p>

        <table class="doc-table">
          <thead>
            <tr>
              <th>Member / Agent</th>
              <th>Role</th>
              <th>Deliverables & Current Focus</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Marcus Chen</strong> <span class="role-badge">Lead</span></td>
              <td style="color: var(--text-muted);">Chief Strategy Officer</td>
              <td><strong>Employee Onboarding Automation</strong> project — package it for board presentation to secure Phase 2 budget. Drive governance framework drafting.</td>
            </tr>
            <tr>
              <td><strong>Andrew Kowalski</strong> <span class="role-badge">Lead</span></td>
              <td style="color: var(--text-muted);">CTO</td>
              <td>Ensure infra readiness for the two active projects and start scoping Phase 2 architecture. Resolve any technical blockers on the Customer Service and Sales Pipeline rollouts.</td>
            </tr>
            <tr>
              <td><strong>Nina Petrov</strong></td>
              <td style="color: var(--text-muted);">AI Engineer</td>
              <td>Hands-on delivery across both active projects — focus on agent performance tuning, monitoring accuracy of Ticket Triage & Lead Scoring agents, and flagging issues early.</td>
            </tr>
            <tr>
              <td><strong>Dr. Anika Gupta</strong></td>
              <td style="color: var(--text-muted);">Head of Data & Analytics</td>
              <td>Stand up usage/adoption dashboards to track the 80% WAU target per department. Define the data pipeline from Phase 1 copilots that feeds Phase 2 AI brains.</td>
            </tr>
            <tr>
              <td><strong>Laura Bennett</strong></td>
              <td style="color: var(--text-muted);">VP of People</td>
              <td>Lead the AI education push — she needs a plan to get 100% of staff to "In Progress" by Q3 2026. Also own change management comms as copilots roll into new departments.</td>
            </tr>
            <tr>
              <td><strong>Benjamin Fowler (you)</strong></td>
              <td style="color: var(--text-muted);">Head of AI</td>
              <td>Orchestrate across all workstreams — ensure the two active projects stay on track for Q3, support Marcus Chen on the governance framework, and start socialising the Phase 2 roadmap with Catherine Wells.</td>
            </tr>
          </tbody>
        </table>

        <div class="summary-card">
          <h3>Summary</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
            The task force is in solid shape: one project shipped, two running in parallel, and the Phase 1 deployment deadline (Q2 2026) is within reach. The critical path items right now are:
          </p>
          <div class="summary-item"><strong>1. ROI case study</strong> — Marcus Chen needs to package Onboarding Automation results ASAP to unlock Phase 2 funding.</div>
          <div class="summary-item"><strong>2. Adoption tracking</strong> — Dr. Anika Gupta needs dashboards live before the next department launches.</div>
          <div class="summary-item"><strong>3. Governance framework</strong> — needs board sign-off before Phase 2; Marcus Chen and Andrew Kowalski should co-own this.</div>

          <div class="prompt-footer">
            Want me to dig deeper into either of the active projects, or draft any specific deliverables (e.g. the ROI case study outline, governance framework skeleton)?
          </div>
        </div>
      </div>
    </div>
  </main>

  <script>
    const canvas = document.getElementById('galaxy-canvas');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');

    let nodes = [];
    let camera = { x: 0, y: 0, zoom: 0.85 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let hoveredNode = null;
    let selectedDepartment = null;
    let rotationAngle = 0;
    let isRotating = true;

    // Concentric Ring Radii
    const RINGS = [
      { r: 0, color: '#eab308', count: 1, label: 'CORE' },
      { r: 120, color: '#f59e0b', count: 10, label: 'DEPARTMENTS' },
      { r: 240, color: '#8b5cf6', count: 120, label: 'SYSTEMS & AGENTS' },
      { r: 360, color: '#3b82f6', count: 240, label: 'WORKFLOWS & SOPS' },
      { r: 480, color: '#10b981', count: 180, label: 'PEOPLE & ENTITIES' },
      { r: 600, color: '#ef4444', count: 80, label: 'GOVERNANCE & AUDIT' }
    ];

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
    window.addEventListener('resize', resizeCanvas);

    function initGalaxyData() {
      nodes = [];

      // 1. Center Root Node "D"
      nodes.push({
        id: 'center-demo-company',
        name: 'Demo Company',
        kind: 'core',
        color: '#ca8a04',
        radius: 28,
        orbitR: 0,
        angle: 0,
        shape: 'avatar',
        avatarText: 'D'
      });

      // 2. Ring 1: 10 Departments (Each with unique sector angle)
      DEPARTMENTS.forEach((dep, i) => {
        const angle = (i / DEPARTMENTS.length) * Math.PI * 2;
        nodes.push({
          id: 'dep-' + dep.name,
          name: dep.name,
          department: dep.name,
          kind: 'department',
          color: dep.color,
          radius: 12,
          orbitR: 120,
          angle: angle,
          shape: 'circle'
        });

        // Generate nested beads around this department's angular sector!
        // Ring 2: Systems & Tools (Squares & Diamonds)
        for (let j = 0; j < 12; j++) {
          const jAngle = angle + (j - 6) * 0.04;
          const dist = 240 + (j % 3) * 15;
          nodes.push({
            id: \`sys-\${i}-\${j}\`,
            name: \`\${dep.name} System #\${j + 1}\`,
            department: dep.name,
            kind: 'system',
            color: dep.color,
            radius: 5,
            orbitR: dist,
            angle: jAngle,
            shape: (j % 2 === 0) ? 'square' : 'circle'
          });
        }

        // Ring 3: Workflows & SOPs (Fine beads)
        for (let k = 0; k < 24; k++) {
          const kAngle = angle + (k - 12) * 0.022;
          const dist = 360 + (k % 4) * 12;
          nodes.push({
            id: \`wf-\${i}-\${k}\`,
            name: \`\${dep.name} Workflow #\${k + 1}\`,
            department: dep.name,
            kind: 'workflow',
            color: dep.color,
            radius: 3.5,
            orbitR: dist,
            angle: kAngle,
            shape: 'circle'
          });
        }

        // Ring 4: People & Agents (Diamonds & Beads)
        for (let p = 0; p < 18; p++) {
          const pAngle = angle + (p - 9) * 0.028;
          const dist = 480 + (p % 3) * 14;
          nodes.push({
            id: \`ppl-\${i}-\${p}\`,
            name: \`\${dep.name} Specialist #\${p + 1}\`,
            department: dep.name,
            kind: 'people',
            color: dep.color,
            radius: 4,
            orbitR: dist,
            angle: pAngle,
            shape: 'diamond'
          });
        }
      });
    }

    function animate() {
      if (isRotating) {
        rotationAngle += 0.0006;
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

      // 1. Draw Concentric Solar Rings
      RINGS.forEach(ring => {
        if (ring.r === 0) return;
        ctx.beginPath();
        ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.7)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 2. Draw Connection Lines when a department is selected
      if (selectedDepartment) {
        const depNode = nodes.find(n => n.kind === 'department' && n.department === selectedDepartment);
        if (depNode) {
          const curAngle = depNode.angle + rotationAngle;
          const dx = Math.cos(curAngle) * depNode.orbitR;
          const dy = Math.sin(curAngle) * depNode.orbitR;

          // Line Center -> Department
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(dx, dy);
          ctx.strokeStyle = depNode.color + '88';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Lines Department -> Sub-nodes
          nodes.forEach(node => {
            if (node.department === selectedDepartment && node.orbitR > 120) {
              const nAngle = node.angle + rotationAngle;
              const nx = Math.cos(nAngle) * node.orbitR;
              const ny = Math.sin(nAngle) * node.orbitR;

              ctx.beginPath();
              ctx.moveTo(dx, dy);
              ctx.lineTo(nx, ny);
              ctx.strokeStyle = depNode.color + '22';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        }
      }

      // 3. Render Nodes (Beads, Squares, Diamonds, Center Avatar)
      nodes.forEach(node => {
        const curAngle = (node.orbitR === 0) ? 0 : (node.angle + rotationAngle);
        const nx = (node.orbitR === 0) ? 0 : (Math.cos(curAngle) * node.orbitR);
        const ny = (node.orbitR === 0) ? 0 : (Math.sin(curAngle) * node.orbitR);
        node.currentX = nx;
        node.currentY = ny;

        const isHighlighted = !selectedDepartment || node.department === selectedDepartment || node.kind === 'core';
        const alpha = isHighlighted ? 'ff' : '22';

        if (node.shape === 'avatar') {
          // Center "D" avatar box
          ctx.beginPath();
          ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#ca8a04';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('D', 0, 0);
          ctx.textBaseline = 'alphabetic';
        } else if (node.shape === 'square') {
          // Square Bead
          ctx.fillStyle = node.color + alpha;
          ctx.fillRect(nx - node.radius, ny - node.radius, node.radius * 2, node.radius * 2);
        } else if (node.shape === 'diamond') {
          // Diamond Bead
          ctx.beginPath();
          ctx.moveTo(nx, ny - node.radius);
          ctx.lineTo(nx + node.radius, ny);
          ctx.lineTo(nx, ny + node.radius);
          ctx.lineTo(nx - node.radius, ny);
          ctx.closePath();
          ctx.fillStyle = node.color + alpha;
          ctx.fill();
        } else {
          // Circle Bead
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = node.color + alpha;
          ctx.fill();
        }

        // Highlight hover
        if (hoveredNode && hoveredNode.id === node.id) {
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius + 5, 0, Math.PI * 2);
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
        if (dist <= Math.max(10, node.radius + 4)) {
          return node;
        }
      }
      return null;
    }

    // Canvas Mouse Listeners
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
      camera.zoom = Math.max(0.3, Math.min(2.5, camera.zoom * factor));
    });

    container.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const hit = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
      if (hit && hit.department) {
        openDepartmentView(hit.department, hit.color);
      }
    });

    function resetZoom() {
      camera = { x: 0, y: 0, zoom: 0.85 };
    }

    function toggleRotation() {
      isRotating = !isRotating;
      document.getElementById('rot-label').innerText = isRotating ? 'Pause Orbit' : 'Resume Orbit';
    }

    function showAllEntities() {
      selectedDepartment = null;
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      document.querySelector('.nav-item').classList.add('active');
    }

    function openDepartmentView(depName, color) {
      selectedDepartment = depName;
      document.getElementById('dep-sidebar-detail').style.display = 'flex';
      document.getElementById('dep-detail-title').innerText = depName;
      document.getElementById('dep-detail-dot').style.background = color;

      document.getElementById('dep-sys-1').innerText = depName + ' AI Copilot';
      document.getElementById('dep-sys-2').innerText = depName + ' AI Brain';
      document.getElementById('dep-sys-3').innerText = depName + ' Autonomous Agent';
    }

    function closeDepartmentView() {
      document.getElementById('dep-sidebar-detail').style.display = 'none';
      selectedDepartment = null;
    }

    function switchMainView(view) {
      const isGalaxy = (view === 'galaxy');
      document.getElementById('canvas-container').style.display = isGalaxy ? 'block' : 'none';
      document.getElementById('doc-view').style.display = isGalaxy ? 'none' : 'block';

      document.getElementById('btn-view-galaxy').classList.toggle('active', isGalaxy);
      document.getElementById('btn-view-doc').classList.toggle('active', !isGalaxy);
    }

    function handleSidebarSearch() {
      const q = document.getElementById('sidebar-search-box').value.toLowerCase();
      if (!q) return;
      const match = DEPARTMENTS.find(d => d.name.toLowerCase().includes(q));
      if (match) {
        openDepartmentView(match.name, match.color);
      }
    }

    resizeCanvas();
    initGalaxyData();
    animate();
  </script>
</body>
</html>`;
}
