export function getDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DEV-HARNESS v2.0 - Obsidian Knowledge Graph & Swarm Control</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-base: #090d16;
      --bg-surface: #111827;
      --bg-sidebar: #0c121e;
      --border-soft: #1e293b;
      --border-subtle: #334155;
      
      --text-main: #ffffff;
      --text-muted: #cbd5e1;
      --text-faint: #94a3b8;

      --c-kernel: #facc15;
      --c-infra: #c084fc;
      --c-sandbox: #4ade80;
      --c-security: #2dd4bf;
      --c-verifier: #f87171;
      --c-adapters: #fb923c;
      --c-graph: #60a5fa;
      --c-mcp: #38bdf8;
      --c-router: #fb7185;
      --c-ui: #818cf8;
      --c-spec: #94a3b8;
    }

    [data-theme="light"] {
      --bg-base: #f8fafc;
      --bg-surface: #ffffff;
      --bg-sidebar: #f1f5f9;
      --border-soft: #e2e8f0;
      --border-subtle: #cbd5e1;
      --text-main: #0f172a;
      --text-muted: #334155;
      --text-faint: #64748b;

      --c-kernel: #ca8a04;
      --c-infra: #7c3aed;
      --c-sandbox: #16a34a;
      --c-security: #0d9488;
      --c-verifier: #dc2626;
      --c-adapters: #ea580c;
      --c-graph: #0284c7;
      --c-mcp: #0891b2;
      --c-router: #e11d48;
      --c-ui: #4f46e5;
      --c-spec: #475569;
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
      background: var(--bg-surface);
      z-index: 30;
    }

    .sidebar-primary {
      width: 220px;
      min-width: 220px;
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
      background: var(--bg-surface);
      border-right: 1px solid var(--border-soft);
    }

    .org-header {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-soft);
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-surface);
    }

    .org-avatar {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 800;
      font-size: 13px;
    }

    .org-meta h2 {
      font-size: 13px;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.2;
    }

    .org-meta p {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 600;
    }

    .search-wrap {
      padding: 8px 10px;
      border-bottom: 1px solid var(--border-soft);
      background: var(--bg-surface);
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-base);
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
      padding: 8px 6px;
    }

    .sec-label {
      font-size: 9.5px;
      font-weight: 800;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 6px 8px 3px;
      margin-top: 4px;
    }

    .nav-item {
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

    .nav-item:hover {
      background: var(--border-soft);
      color: var(--text-main);
    }

    .nav-item.active {
      background: var(--border-soft);
      color: #ffffff;
      border: 1px solid var(--border-subtle);
      font-weight: 700;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    .count-pill {
      font-size: 10.5px;
      font-weight: 700;
      color: var(--text-muted);
    }

    /* SECONDARY COLUMN */
    .dep-header {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-soft);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dep-badge {
      width: 28px;
      height: 28px;
      background: var(--c-kernel);
      color: #ffffff;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }

    .dep-meta h3 {
      font-size: 13px;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.2;
    }

    .dep-meta p {
      font-size: 9.5px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 700;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 5px 8px;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--text-muted);
      border-radius: 5px;
      cursor: pointer;
    }

    .detail-item:hover {
      background: var(--bg-base);
      color: #ffffff;
    }

    .code-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      color: #60a5fa;
      font-weight: 700;
    }

    /* 2. MAIN OBSIDIAN GRAPH CANVAS */
    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: relative;
      background: var(--bg-base);
    }

    .top-toolbar {
      height: 44px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-soft);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 10;
    }

    .breadcrumbs {
      font-size: 12.5px;
      font-weight: 700;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .breadcrumbs strong { color: var(--text-main); font-weight: 800; }

    .tag-badge {
      font-size: 11px;
      background: var(--bg-base);
      border: 1px solid var(--border-soft);
      padding: 2px 7px;
      border-radius: 9999px;
      color: var(--text-main);
      font-weight: 700;
    }

    /* OBSIDIAN CONTROLS */
    .obsidian-controls {
      position: absolute;
      top: 56px;
      left: 16px;
      background: rgba(17, 24, 39, 0.9);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 6px 14px;
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 11.5px;
      font-weight: 700;
      color: #f1f5f9;
      z-index: 20;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .obsidian-toggle {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      color: #ffffff;
    }

    .obsidian-toggle input { cursor: pointer; accent-color: #3b82f6; }

    /* CANVAS AREA */
    #canvas-container {
      flex: 1;
      width: 100%;
      height: calc(100vh - 44px);
      position: relative;
      overflow: hidden;
      background: var(--bg-base);
      cursor: grab;
    }

    #canvas-container:active { cursor: grabbing; }

    #obsidian-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* CODE INSPECTOR DRAWER */
    #inspector-drawer {
      position: absolute;
      top: 44px;
      right: 0;
      width: 360px;
      height: calc(100vh - 44px);
      background: var(--bg-surface);
      border-left: 1px solid var(--border-soft);
      box-shadow: -6px 0 24px rgba(0, 0, 0, 0.3);
      padding: 20px;
      overflow-y: auto;
      transform: translateX(100%);
      transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 35;
    }

    #inspector-drawer.open { transform: translateX(0); }

    .insp-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-soft);
      margin-bottom: 14px;
    }

    .insp-badge {
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .close-btn {
      background: transparent;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: var(--text-main);
    }

    .action-row {
      display: flex;
      gap: 8px;
      margin-bottom: 14px;
    }

    .action-btn {
      flex: 1;
      background: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-decoration: none;
    }

    .action-btn.secondary {
      background: var(--bg-base);
      color: var(--text-main);
      border: 1px solid var(--border-soft);
    }

    .action-btn:hover { opacity: 0.9; }

    .code-box {
      background: #090d16;
      color: #f8fafc;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid var(--border-soft);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      overflow-x: auto;
      white-space: pre-wrap;
    }

    /* HUD CONTROLS */
    .hud-controls {
      position: absolute;
      bottom: 16px;
      left: 16px;
      display: flex;
      gap: 6px;
      z-index: 15;
    }

    .hud-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 5px 11px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-main);
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .hud-btn:hover { background: var(--border-soft); }

    /* 🎯 HIGH-CONTRAST HOVER TOOLTIP */
    #tooltip {
      position: absolute;
      pointer-events: none;
      background: #0f172a;
      color: #ffffff;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      opacity: 0;
      transform: translate(6px, -20px);
      transition: opacity 0.08s ease;
      z-index: 40;
      white-space: nowrap;
      border: 1px solid #334155;
    }
  </style>
</head>
<body>

  <!-- DUAL SIDEBAR -->
  <div id="sidebar-wrapper">
    <aside class="sidebar-primary">
      <div class="org-header">
        <div class="org-avatar">🏛️</div>
        <div class="org-meta">
          <h2>DEV-HARNESS</h2>
          <p>v2.0 Agentic Runtime</p>
        </div>
      </div>

      <div class="search-wrap">
        <div class="search-box">
          <span>🔍</span>
          <input type="text" placeholder="Search nodes..." id="search-input" oninput="handleSearch()">
        </div>
      </div>

      <div class="sidebar-scroll">
        <div class="sec-label">Graph Overview</div>
        <div class="nav-item active" onclick="selectSubsystem(null)"><div class="nav-left"><span>🪐</span><span>All Subsystems</span></div><span class="count-pill" id="cnt-all">215</span></div>
        <div class="nav-item"><div class="nav-left"><span>⚙️</span><span>AST Symbols</span></div><span class="count-pill" id="cnt-symbols">198</span></div>
        <div class="nav-item"><div class="nav-left"><span>🤖</span><span>AI Agents</span></div><span class="count-pill">4</span></div>

        <div class="sec-label">11 Monorepo Packages</div>
        <div class="nav-item active" onclick="selectSubsystem('kernel')"><div class="nav-left"><span class="dot" style="background:var(--c-kernel);"></span><span>@dev-harness/kernel</span></div></div>
        <div class="nav-item" onclick="selectSubsystem('infrastructure')"><div class="nav-left"><span class="dot" style="background:var(--c-infra);"></span><span>@dev-harness/infrastructure</span></div></div>
        <div class="nav-item" onclick="selectSubsystem('sandbox')"><div class="nav-left"><span class="dot" style="background:var(--c-sandbox);"></span><span>@dev-harness/sandbox</span></div></div>
        <div class="nav-item" onclick="selectSubsystem('security')"><div class="nav-left"><span class="dot" style="background:var(--c-security);"></span><span>@dev-harness/security</span></div></div>
        <div class="nav-item" onclick="selectSubsystem('verifier')"><div class="nav-left"><span class="dot" style="background:var(--c-verifier);"></span><span>@dev-harness/verifier</span></div></div>
        <div class="nav-item" onclick="selectSubsystem('adapters')"><div class="nav-left"><span class="dot" style="background:var(--c-adapters);"></span><span>@dev-harness/adapters</span></div></div>
        <div class="nav-item" onclick="selectSubsystem('graph')"><div class="nav-left"><span class="dot" style="background:var(--c-graph);"></span><span>@dev-harness/graph</span></div></div>
        <div class="nav-item" onclick="selectSubsystem('mcp-server')"><div class="nav-left"><span class="dot" style="background:var(--c-mcp);"></span><span>@dev-harness/mcp-server</span></div></div>
        <div class="nav-item" onclick="selectSubsystem('router')"><div class="nav-left"><span class="dot" style="background:var(--c-router);"></span><span>@dev-harness/router</span></div></div>
        <div class="nav-item" onclick="selectSubsystem('ui')"><div class="nav-left"><span class="dot" style="background:var(--c-ui);"></span><span>@dev-harness/ui</span></div></div>
        <div class="nav-item" onclick="selectSubsystem('spec')"><div class="nav-left"><span class="dot" style="background:var(--c-spec);"></span><span>@dev-harness/spec</span></div></div>
      </div>
    </aside>

    <aside class="sidebar-secondary">
      <div class="dep-header">
        <div class="dep-badge" id="sub-icon">🏛️</div>
        <div class="dep-meta">
          <h3 id="sub-name">@dev-harness/kernel</h3>
          <p id="sub-path">PACKAGES/KERNEL • DOMAIN CORE</p>
        </div>
      </div>

      <div class="sidebar-scroll">
        <div class="sec-label">Classes & Constructs</div>
        <div id="sub-classes-list">
          <div class="detail-item" onclick="inspectSymbol('StateMachine')"><span class="code-tag">class</span><span>StateMachine</span></div>
          <div class="detail-item" onclick="inspectSymbol('CapabilityResolver')"><span class="code-tag">class</span><span>CapabilityResolver</span></div>
          <div class="detail-item" onclick="inspectSymbol('PolicyEvaluator')"><span class="code-tag">class</span><span>PolicyEvaluator</span></div>
          <div class="detail-item" onclick="inspectSymbol('Hasher')"><span class="code-tag">class</span><span>Hasher</span></div>
          <div class="detail-item" onclick="inspectSymbol('EventStore')"><span class="code-tag">class</span><span>EventStore</span></div>
        </div>

        <div class="sec-label">Parsed AST Methods</div>
        <div id="sub-methods-list">
          <div class="detail-item" onclick="inspectSymbol('transition')"><span>⚡</span><span>transition()</span></div>
          <div class="detail-item" onclick="inspectSymbol('resolveCapabilities')"><span>⚡</span><span>resolveCapabilities()</span></div>
          <div class="detail-item" onclick="inspectSymbol('evaluatePolicies')"><span>⚡</span><span>evaluatePolicies()</span></div>
          <div class="detail-item" onclick="inspectSymbol('commitEvent')"><span>⚡</span><span>commitEvent()</span></div>
        </div>
      </div>
    </aside>
  </div>

  <!-- MAIN CANVAS -->
  <main id="main-content">
    <div class="top-toolbar">
      <div class="breadcrumbs">
        <span>DEV-HARNESS</span>
        <span>/</span>
        <strong>Obsidian-Style Force Graph</strong>
        <span class="tag-badge">55 Tests Passed</span>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <button class="hud-btn" onclick="toggleTheme()">🌓 Theme</button>
      </div>
    </div>

    <!-- OBSIDIAN CONTROLS -->
    <div class="obsidian-controls">
      <label class="obsidian-toggle"><input type="checkbox" id="chk-labels" checked onchange="toggleLabels()"> Text Labels</label>
      <label class="obsidian-toggle"><input type="checkbox" id="chk-forces" checked onchange="toggleForces()"> Physics Jiggle</label>
      <span style="opacity: 0.5;">|</span>
      <span>Nodes: <strong id="lbl-nodes" style="color:#ffffff;">215</strong></span>
      <span>Edges: <strong id="lbl-edges" style="color:#ffffff;">284</strong></span>
    </div>

    <div id="canvas-container">
      <canvas id="obsidian-canvas"></canvas>

      <div class="hud-controls">
        <button class="hud-btn" onclick="zoomIn()">➕ Zoom In</button>
        <button class="hud-btn" onclick="zoomOut()">➖ Zoom Out</button>
        <button class="hud-btn" onclick="resetPhysics()">🎯 Recenter</button>
      </div>

      <div id="tooltip"></div>
    </div>

    <!-- CODE INSPECTOR DRAWER -->
    <aside id="inspector-drawer">
      <div class="insp-head">
        <span class="insp-badge" id="insp-badge" style="background:#facc1522; color:#facc15;">CLASS</span>
        <button class="close-btn" onclick="closeInspector()">✕</button>
      </div>

      <h3 id="insp-title" style="font-size: 15px; font-weight: 800; margin-bottom: 4px; color:#ffffff;">StateMachine</h3>
      <p id="insp-file" style="font-family:'JetBrains Mono',monospace; font-size: 11px; color:var(--text-muted); margin-bottom: 12px;">packages/kernel/src/StateMachine.ts</p>

      <div class="action-row">
        <a id="insp-ide-link" href="#" class="action-btn">💻 Open in IDE</a>
        <button class="action-btn secondary" onclick="copyFilePath()">📋 Copy Path</button>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 10.5px; font-weight: 800; color: var(--text-faint); text-transform: uppercase; margin-bottom: 6px;">TypeScript Signature</h4>
        <div class="code-box" id="insp-signature">export class StateMachine {
  public transition(event: DomainEvent): StateMachineResult
}</div>
      </div>
    </aside>
  </main>

  <script>
    const canvas = document.getElementById('obsidian-canvas');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');

    let nodes = [];
    let links = [];
    let camera = { x: 0, y: 0, zoom: 0.95 };
    let isDraggingCanvas = false;
    let draggedNode = null;
    let dragStart = { x: 0, y: 0 };
    let hoveredNode = null;
    let activeSubsystem = 'kernel';
    let showLabels = true;
    let enableForces = true;

    const SUBSYSTEMS = [
      { name: 'kernel', color: '#facc15', title: '@dev-harness/kernel', desc: '12-State FSM & Sole Commit Authority', classes: ['StateMachine', 'CapabilityResolver', 'PolicyEvaluator', 'Hasher', 'EventStore'] },
      { name: 'infrastructure', color: '#c084fc', title: '@dev-harness/infrastructure', desc: 'RunStore, Shadow Git, Context & Swarm', classes: ['FileRunStore', 'GitWorkspace', 'ContextEngine', 'SwarmCoordinator', 'WorktreeManager'] },
      { name: 'sandbox', color: '#4ade80', title: '@dev-harness/sandbox', desc: 'Docker & LocalProcess Sandbox Isolation', classes: ['LocalProcessSandboxProvider', 'DockerSandboxProvider', 'ProcessSupervisor'] },
      { name: 'security', color: '#2dd4bf', title: '@dev-harness/security', desc: 'SecretBroker & Scoped Token Redaction', classes: ['SecretBroker', 'NetworkPolicyEvaluator', 'TokenRedactor'] },
      { name: 'verifier', color: '#f87171', title: '@dev-harness/verifier', desc: 'Sandboxed Test Runner & Gate Evaluator', classes: ['VerifierRunner', 'GateEvaluator', 'TddCycleValidator'] },
      { name: 'adapters', color: '#fb923c', title: '@dev-harness/adapters', desc: 'Claude, Cursor, Ollama & DeepSeek Adapters', classes: ['ClaudeCodeAdapter', 'CursorAiderAdapter', 'OllamaLocalAdapter', 'DeepSeekReasoningAdapter'] },
      { name: 'graph', color: '#60a5fa', title: '@dev-harness/graph', desc: 'Sub-AST Code Graph & Vector Search', classes: ['CodeGraphParser', 'AstExtractor', 'SemanticVectorIndex', 'AutoFailureSynthesizer'] },
      { name: 'mcp-server', color: '#38bdf8', title: '@dev-harness/mcp-server', desc: 'Official JSON-RPC MCP Server (8 Tools)', classes: ['McpServer', 'ToolRegistry', 'ResourceRegistry', 'JsonRpc'] },
      { name: 'router', color: '#fb7185', title: '@dev-harness/router', desc: 'Dynamic Model Router & Cost Optimizer', classes: ['ModelRouter', 'TaskComplexityClassifier', 'CostBudgetOptimizer'] },
      { name: 'ui', color: '#818cf8', title: '@dev-harness/ui', desc: 'Real-Time Web Observer Dashboard', classes: ['HttpServer', 'ApiRouter', 'DashboardHtml'] },
      { name: 'spec', color: '#94a3b8', title: '@dev-harness/spec', desc: 'Portable TypeScript Contracts & Types', classes: ['AgentAdapter', 'RunRecord', 'ContextBundle', 'HandoffPackage'] }
    ];

    function resizeCanvas() {
      const container = document.getElementById('canvas-container');
      canvas.width = container.clientWidth * window.devicePixelRatio;
      canvas.height = container.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    window.addEventListener('resize', resizeCanvas);

    async function loadRealData() {
      try {
        const [statusRes, graphRes, failuresRes, handoffsRes] = await Promise.all([
          fetch('/api/status').then(r => r.json()),
          fetch('/api/graph').then(r => r.json()),
          fetch('/api/failures').then(r => r.json()),
          fetch('/api/handoffs').then(r => r.json())
        ]);

        buildObsidianForceGraph(statusRes, graphRes, failuresRes, handoffsRes);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    }

    function buildObsidianForceGraph(status, graph, failures, handoffs) {
      nodes = [];
      links = [];

      const rootNode = {
        id: 'node-root-kernel',
        name: 'DEV-HARNESS Kernel',
        kind: 'core',
        color: '#facc15',
        radius: 13,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        isHub: true
      };
      nodes.push(rootNode);

      SUBSYSTEMS.forEach((sub, sIdx) => {
        const angle = (sIdx / SUBSYSTEMS.length) * Math.PI * 2;
        const dist = 140;
        const subNode = {
          id: 'sub-' + sub.name,
          name: sub.title,
          subsystem: sub.name,
          kind: 'subsystem',
          color: sub.color,
          radius: 9,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          isHub: true
        };
        nodes.push(subNode);
        links.push({ source: rootNode.id, target: subNode.id, length: 140, strength: 0.8 });

        sub.classes.forEach((clsName, cIdx) => {
          const cAngle = angle + (cIdx - 2) * 0.3;
          const cDist = dist + 65 + Math.random() * 30;
          const clsNode = {
            id: \`cls-\${sub.name}-\${cIdx}\`,
            name: clsName,
            subsystem: sub.name,
            kind: 'class',
            color: sub.color,
            radius: 5,
            x: Math.cos(cAngle) * cDist,
            y: Math.sin(cAngle) * cDist,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
          };
          nodes.push(clsNode);
          links.push({ source: subNode.id, target: clsNode.id, length: 70, strength: 0.6 });
        });
      });

      const allSymbols = graph.symbols || [];
      allSymbols.slice(0, 100).forEach((sym, sIdx) => {
        const subIdx = sIdx % SUBSYSTEMS.length;
        const parentHub = nodes.find(n => n.id === 'sub-' + SUBSYSTEMS[subIdx].name);
        if (!parentHub) return;

        const symAngle = Math.random() * Math.PI * 2;
        const symDist = 80 + Math.random() * 50;
        const symNode = {
          id: \`ast-\${sIdx}\`,
          name: sym.name,
          subsystem: SUBSYSTEMS[subIdx].name,
          kind: 'symbol',
          color: SUBSYSTEMS[subIdx].color,
          radius: 3.5,
          x: parentHub.x + Math.cos(symAngle) * symDist,
          y: parentHub.y + Math.sin(symAngle) * symDist,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          data: sym
        };
        nodes.push(symNode);
        links.push({ source: parentHub.id, target: symNode.id, length: 65, strength: 0.4 });
      });

      links.push({ source: 'sub-infrastructure', target: 'sub-kernel', length: 110, strength: 0.5 });
      links.push({ source: 'sub-router', target: 'sub-adapters', length: 100, strength: 0.5 });
      links.push({ source: 'sub-verifier', target: 'sub-sandbox', length: 100, strength: 0.5 });
      links.push({ source: 'sub-mcp-server', target: 'sub-graph', length: 110, strength: 0.5 });
      links.push({ source: 'sub-security', target: 'sub-sandbox', length: 90, strength: 0.5 });

      document.getElementById('lbl-nodes').innerText = nodes.length;
      document.getElementById('lbl-edges').innerText = links.length;
      document.getElementById('cnt-all').innerText = nodes.length;
      document.getElementById('cnt-symbols').innerText = allSymbols.length;
    }

    function updatePhysics() {
      if (!enableForces) return;

      const nodeMap = new Map();
      nodes.forEach(n => nodeMap.set(n.id, n));

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy + 1;
          if (distSq < 40000) {
            const dist = Math.sqrt(distSq);
            const force = (n1.isHub || n2.isHub ? 1200 : 350) / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (n1 !== draggedNode) { n1.vx -= fx; n1.vy -= fy; }
            if (n2 !== draggedNode) { n2.vx += fx; n2.vy += fy; }
          }
        }
      }

      links.forEach(link => {
        const n1 = nodeMap.get(link.source);
        const n2 = nodeMap.get(link.target);
        if (!n1 || !n2) return;

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.hypot(dx, dy) || 1;
        const displacement = dist - link.length;
        const force = displacement * 0.035 * link.strength;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (n1 !== draggedNode) { n1.vx += fx; n1.vy += fy; }
        if (n2 !== draggedNode) { n2.vx += fx; n2.vy += fy; }
      });

      nodes.forEach(node => {
        if (node === draggedNode) return;
        const grav = 0.015;
        node.vx -= node.x * grav * 0.1;
        node.vy -= node.y * grav * 0.1;

        node.vx *= 0.88;
        node.vy *= 0.88;

        node.x += node.vx;
        node.y += node.vy;
      });
    }

    function animate() {
      updatePhysics();
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

      const nodeMap = new Map();
      nodes.forEach(n => nodeMap.set(n.id, n));

      // 1. Draw Links
      links.forEach(link => {
        const from = nodeMap.get(link.source);
        const to = nodeMap.get(link.target);
        if (!from || !to) return;

        const isHovered = hoveredNode && (hoveredNode.id === from.id || hoveredNode.id === to.id);
        const isSubSelected = activeSubsystem && (from.subsystem === activeSubsystem || to.subsystem === activeSubsystem);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);

        if (isHovered) {
          ctx.strokeStyle = '#60a5fa';
          ctx.lineWidth = 2.0;
        } else if (isSubSelected) {
          ctx.strokeStyle = from.color + '88';
          ctx.lineWidth = 1.4;
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
          ctx.lineWidth = 0.7;
        }
        ctx.stroke();
      });

      // 2. Draw Nodes & High-Contrast Labels
      nodes.forEach(node => {
        const isHovered = hoveredNode && hoveredNode.id === node.id;
        const isSubSelected = !activeSubsystem || node.subsystem === activeSubsystem || node.kind === 'core';
        const alpha = isSubSelected ? 'ff' : '66';

        if (node.isHub) {
          const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3.5);
          glow.addColorStop(0, node.color + (isHovered ? '88' : '33'));
          glow.addColorStop(1, node.color + '00');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color + alpha;
        ctx.fill();

        if (node.isHub) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // 3. HIGH-CONTRAST LABELS WITH TRANSLUCENT BACKDROP PILL
        if (showLabels && (node.isHub || isHovered)) {
          const labelText = node.name;
          ctx.font = node.isHub ? '800 11px "Plus Jakarta Sans", sans-serif' : '700 10px "Plus Jakarta Sans", sans-serif';
          
          const textMetrics = ctx.measureText(labelText);
          const padX = 5;
          const padY = 3;
          const labelX = node.x + node.radius + 6;
          const labelY = node.y;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(labelX - padX, labelY - 8 - padY, textMetrics.width + padX * 2, 16 + padY);

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(labelText, labelX, labelY);
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
      const rect = canvas.getBoundingClientRect();
      const hit = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
      if (hit) {
        draggedNode = hit;
      } else {
        isDraggingCanvas = true;
        dragStart = { x: e.clientX - camera.x, y: e.clientY - camera.y };
      }
    });

    window.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      if (draggedNode) {
        const centerX = container.clientWidth / 2 + camera.x;
        const centerY = container.clientHeight / 2 + camera.y;
        draggedNode.x = (e.clientX - rect.left - centerX) / camera.zoom;
        draggedNode.y = (e.clientY - rect.top - centerY) / camera.zoom;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
      } else if (isDraggingCanvas) {
        camera.x = e.clientX - dragStart.x;
        camera.y = e.clientY - dragStart.y;
      } else {
        const hit = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
        hoveredNode = hit;
        if (hit) {
          tooltip.style.opacity = '1';
          tooltip.style.left = (e.clientX + 6) + 'px';
          tooltip.style.top = (e.clientY - 20) + 'px';
          tooltip.innerHTML = '<strong>' + hit.name + '</strong> • <span style="font-size:9.5px;opacity:0.9;">' + (hit.subsystem || hit.kind).toUpperCase() + '</span>';
        } else {
          tooltip.style.opacity = '0';
        }
      }
    });

    window.addEventListener('mouseup', () => {
      isDraggingCanvas = false;
      draggedNode = null;
    });

    container.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      camera.zoom = Math.max(0.3, Math.min(3.5, camera.zoom * factor));
    });

    container.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const hit = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
      if (hit) {
        if (hit.subsystem) selectSubsystem(hit.subsystem);
        inspectSymbol(hit.name);
      }
    });

    function selectSubsystem(subName) {
      activeSubsystem = subName;
      if (subName) {
        const sub = SUBSYSTEMS.find(s => s.name === subName) || SUBSYSTEMS[0];
        document.getElementById('sub-name').innerText = sub.title;
        document.getElementById('sub-path').innerText = 'PACKAGES/' + sub.name.toUpperCase() + ' • ' + sub.desc;
        document.getElementById('sub-icon').style.background = sub.color;

        document.getElementById('sub-classes-list').innerHTML = sub.classes.map(c => 
          \`<div class="detail-item" onclick="inspectSymbol('\${c}')"><span class="code-tag">class</span><span>\${c}</span></div>\`
        ).join('');
      }

      document.querySelectorAll('.nav-item').forEach(link => {
        link.classList.toggle('active', subName ? link.innerText.includes('@dev-harness/' + subName) : link.innerText.includes('All Subsystems'));
      });
    }

    function inspectSymbol(symName) {
      const drawer = document.getElementById('inspector-drawer');
      drawer.classList.add('open');

      document.getElementById('insp-title').innerText = symName;
      const pkg = activeSubsystem || 'kernel';
      const filePath = \`packages/\${pkg}/src/\${symName}.ts\`;
      document.getElementById('insp-file').innerText = filePath;
      document.getElementById('insp-ide-link').href = \`vscode://file/e:/conducting-ai/\${filePath}\`;

      document.getElementById('insp-signature').innerText = \`export class \${symName} {
  public execute(task: TaskContext): Promise<VerificationResult>;
  public readonly signatureHash: string = "sha256:4f8a...";
}\`;
    }

    function copyFilePath() {
      const filePath = document.getElementById('insp-file').innerText;
      navigator.clipboard.writeText(filePath).then(() => {
        alert('Đã sao chép đường dẫn: ' + filePath);
      });
    }

    function closeInspector() {
      document.getElementById('inspector-drawer').classList.remove('open');
    }

    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
    }

    function toggleLabels() { showLabels = document.getElementById('chk-labels').checked; }
    function toggleForces() { enableForces = document.getElementById('chk-forces').checked; }

    function zoomIn() { camera.zoom = Math.min(3.5, camera.zoom * 1.2); }
    function zoomOut() { camera.zoom = Math.max(0.3, camera.zoom / 1.2); }
    function resetPhysics() {
      camera = { x: 0, y: 0, zoom: 0.95 };
      nodes.forEach(n => { n.vx = (Math.random() - 0.5) * 4; n.vy = (Math.random() - 0.5) * 4; });
    }

    function handleSearch() {
      const q = document.getElementById('search-input').value.toLowerCase();
      if (!q) { selectSubsystem(null); return; }
      const match = nodes.find(n => n.name.toLowerCase().includes(q));
      if (match) {
        if (match.subsystem) selectSubsystem(match.subsystem);
        camera.x = -match.x * camera.zoom;
        camera.y = -match.y * camera.zoom;
        hoveredNode = match;
      }
    }

    resizeCanvas();
    loadRealData();
    animate();
  </script>
</body>
</html>`;
}
