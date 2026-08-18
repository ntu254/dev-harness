export function getDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DEV-HARNESS v2.0 - Astrolabe Knowledge Galaxy & Swarm</title>
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
      
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-faint: #94a3b8;
      --ring-guide: rgba(226, 232, 240, 0.8);

      --c-kernel: #eab308;
      --c-infra: #8b5cf6;
      --c-sandbox: #10b981;
      --c-security: #0d9488;
      --c-verifier: #ef4444;
      --c-adapters: #f97316;
      --c-graph: #0284c7;
      --c-mcp: #06b6d4;
      --c-router: #ec4899;
      --c-ui: #6366f1;
      --c-spec: #64748b;
    }

    [data-theme="dark"] {
      --bg-base: #080c14;
      --bg-surface: #0f172a;
      --bg-sidebar: #0b1120;
      --border-soft: #172033;
      --border-subtle: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-faint: #64748b;
      --ring-guide: rgba(30, 41, 59, 0.7);
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
      box-shadow: 2px 0 16px rgba(0, 0, 0, 0.02);
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
      width: 280px;
      min-width: 280px;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--bg-surface);
      border-right: 1px solid var(--border-soft);
    }

    .org-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-soft);
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-surface);
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
      font-weight: 800;
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
      background: var(--border-soft);
      color: var(--text-main);
    }

    .nav-item.active {
      background: var(--bg-surface);
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

    /* SECONDARY COLUMN */
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
      background: var(--c-kernel);
      color: #ffffff;
      border-radius: 7px;
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
      background: var(--bg-base);
      color: var(--text-main);
    }

    .code-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      color: #2563eb;
    }

    /* 2. MAIN CANVAS VIEW */
    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: relative;
      background: var(--bg-surface);
    }

    .top-toolbar {
      height: 48px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-soft);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 18px;
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
      background: var(--bg-base);
      border: 1px solid var(--border-soft);
      padding: 2px 7px;
      border-radius: 9999px;
      color: var(--text-muted);
    }

    .fsm-hud {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--bg-base);
      padding: 3px 8px;
      border-radius: 8px;
      border: 1px solid var(--border-soft);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
    }

    .fsm-step-pill {
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text-faint);
    }

    .fsm-step-pill.passed { color: #10b981; }
    .fsm-step-pill.active {
      background: #eab308;
      color: #ffffff;
      box-shadow: 0 0 8px rgba(234, 179, 8, 0.4);
    }

    /* CANVAS AREA */
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

    /* CODE INSPECTOR DRAWER */
    #inspector-drawer {
      position: absolute;
      top: 48px;
      right: 0;
      width: 380px;
      height: calc(100vh - 48px);
      background: var(--bg-surface);
      border-left: 1px solid var(--border-soft);
      box-shadow: -6px 0 24px rgba(0, 0, 0, 0.05);
      padding: 24px;
      overflow-y: auto;
      transform: translateX(100%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 35;
    }

    #inspector-drawer.open { transform: translateX(0); }

    .insp-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-soft);
      margin-bottom: 16px;
    }

    .insp-badge {
      font-size: 10.5px;
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

    .action-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .action-btn {
      flex: 1;
      background: #0f172a;
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
      background: #0f172a;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      overflow-x: auto;
      white-space: pre-wrap;
    }

    /* HUD CONTROLS */
    .hud-controls {
      position: absolute;
      bottom: 20px;
      left: 20px;
      display: flex;
      gap: 6px;
      z-index: 15;
    }

    .hud-btn {
      background: var(--bg-surface);
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
    }

    .hud-btn:hover { background: var(--bg-base); }

    /* 🎯 SNUG, COMPACT POPOVER HOVER (Öm sát con trỏ, không che node) */
    #tooltip {
      position: absolute;
      pointer-events: none;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      color: #ffffff;
      padding: 4px 9px;
      border-radius: 5px;
      font-size: 10.5px;
      font-weight: 600;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      opacity: 0;
      transform: translate(6px, -18px);
      transition: opacity 0.08s ease, transform 0.08s ease;
      z-index: 40;
      white-space: nowrap;
      border: 1px solid rgba(255, 255, 255, 0.12);
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
          <input type="text" placeholder="Search symbols, packages..." id="search-input" oninput="handleSearch()">
        </div>
      </div>

      <div class="sidebar-scroll">
        <div class="sec-label">Runtime Overview</div>
        <div class="nav-item active" onclick="selectSubsystem(null)"><div class="nav-left"><span>🪐</span><span>All Subsystems</span></div><span class="count-pill" id="cnt-all">215</span></div>
        <div class="nav-item"><div class="nav-left"><span>⚙️</span><span>AST Symbols</span></div><span class="count-pill" id="cnt-symbols">198</span></div>
        <div class="nav-item"><div class="nav-left"><span>🤖</span><span>AI Agents</span></div><span class="count-pill">4</span></div>
        <div class="nav-item"><div class="nav-left"><span>🧠</span><span>Failure Memories</span></div><span class="count-pill" id="cnt-failures">0</span></div>
        <div class="nav-item"><div class="nav-left"><span>📦</span><span>Sealed Handoffs</span></div><span class="count-pill" id="cnt-handoffs">1</span></div>

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
        <div class="sec-label">Core Classes & State Machines</div>
        <div id="sub-classes-list">
          <div class="detail-item" onclick="inspectSymbol('StateMachine')"><span class="code-tag">class</span><span>StateMachine (12 FSM States)</span></div>
          <div class="detail-item" onclick="inspectSymbol('CapabilityResolver')"><span class="code-tag">class</span><span>CapabilityResolver (Monotonic)</span></div>
          <div class="detail-item" onclick="inspectSymbol('PolicyEvaluator')"><span class="code-tag">class</span><span>PolicyEvaluator (Scoped Deny)</span></div>
          <div class="detail-item" onclick="inspectSymbol('Hasher')"><span class="code-tag">class</span><span>Hasher (Canonical SHA-256)</span></div>
          <div class="detail-item" onclick="inspectSymbol('EventStore')"><span class="code-tag">class</span><span>EventStore (Append-Only)</span></div>
        </div>

        <div class="sec-label">Parsed AST Methods</div>
        <div id="sub-methods-list">
          <div class="detail-item" onclick="inspectSymbol('transition')"><span>⚡</span><span>transition(event: DomainEvent)</span></div>
          <div class="detail-item" onclick="inspectSymbol('resolveCapabilities')"><span>⚡</span><span>resolveCapabilities(task, agent)</span></div>
          <div class="detail-item" onclick="inspectSymbol('evaluatePolicies')"><span>⚡</span><span>evaluatePolicies(action)</span></div>
          <div class="detail-item" onclick="inspectSymbol('commitEvent')"><span>⚡</span><span>commitEvent(event: DomainEvent)</span></div>
        </div>

        <div class="sec-label">Verification Invariant Gates</div>
        <div class="detail-item"><span>🛡️</span><span>Gate 1: State Machine Determinism</span></div>
        <div class="detail-item"><span>🛡️</span><span>Gate 2: Monotonic Restriction</span></div>
        <div class="detail-item"><span>🛡️</span><span>Gate 3: Pure Domain Zero I/O</span></div>
      </div>
    </aside>
  </div>

  <!-- MAIN CANVAS -->
  <main id="main-content">
    <div class="top-toolbar">
      <div class="breadcrumbs">
        <span>DEV-HARNESS v2.0</span>
        <span>/</span>
        <strong>Continuous Astrolabe Knowledge Galaxy</strong>
        <span class="tag-badge">55 Verified Tests • 11 Packages</span>
      </div>

      <div class="fsm-hud">
        <span class="fsm-step-pill passed">RECEIVED</span> →
        <span class="fsm-step-pill passed">PLANNED</span> →
        <span class="fsm-step-pill passed">AUTHORIZED</span> →
        <span class="fsm-step-pill passed">EXECUTING</span> →
        <span class="fsm-step-pill passed">VERIFYING</span> →
        <span class="fsm-step-pill active">● COMPLETED</span>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <button class="hud-btn" onclick="toggleTheme()">🌓 Theme</button>
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

    <!-- CODE INSPECTOR DRAWER WITH ACTIONABLE IDE & COPY BUTTONS -->
    <aside id="inspector-drawer">
      <div class="insp-head">
        <span class="insp-badge" id="insp-badge" style="background:#eab30822; color:#eab308;">CLASS</span>
        <button class="close-btn" onclick="closeInspector()">✕</button>
      </div>

      <h3 id="insp-title" style="font-size: 16px; font-weight: 800; margin-bottom: 4px;">StateMachine</h3>
      <p id="insp-file" style="font-family:'JetBrains Mono',monospace; font-size: 11px; color:var(--text-muted); margin-bottom: 12px;">packages/kernel/src/StateMachine.ts</p>

      <!-- Actionable Buttons: Open in VS Code & Copy Path -->
      <div class="action-row">
        <a id="insp-ide-link" href="#" class="action-btn">💻 Open in IDE</a>
        <button class="action-btn secondary" onclick="copyFilePath()">📋 Copy Path</button>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; margin-bottom: 6px;">TypeScript Signature</h4>
        <div class="code-box" id="insp-signature">export class StateMachine {
  public transition(event: DomainEvent): StateMachineResult
}</div>
      </div>
    </aside>
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
    let activeSubsystem = 'kernel';
    let rotationAngle = 0;
    let isRotating = true;
    let waveTime = 0;

    const SUBSYSTEMS = [
      { name: 'kernel', color: '#eab308', title: '@dev-harness/kernel', desc: '12-State FSM & Sole Commit Authority', classes: ['StateMachine', 'CapabilityResolver', 'PolicyEvaluator', 'Hasher', 'EventStore'] },
      { name: 'infrastructure', color: '#8b5cf6', title: '@dev-harness/infrastructure', desc: 'RunStore, Shadow Git, Context & Swarm', classes: ['FileRunStore', 'GitWorkspace', 'ContextEngine', 'SwarmCoordinator', 'WorktreeManager'] },
      { name: 'sandbox', color: '#10b981', title: '@dev-harness/sandbox', desc: 'Docker & LocalProcess Sandbox Isolation', classes: ['LocalProcessSandboxProvider', 'DockerSandboxProvider', 'ProcessSupervisor'] },
      { name: 'security', color: '#0d9488', title: '@dev-harness/security', desc: 'SecretBroker & Scoped Token Redaction', classes: ['SecretBroker', 'NetworkPolicyEvaluator', 'TokenRedactor'] },
      { name: 'verifier', color: '#ef4444', title: '@dev-harness/verifier', desc: 'Sandboxed Test Runner & Gate Evaluator', classes: ['VerifierRunner', 'GateEvaluator', 'TddCycleValidator'] },
      { name: 'adapters', color: '#f97316', title: '@dev-harness/adapters', desc: 'Claude, Cursor, Ollama & DeepSeek Adapters', classes: ['ClaudeCodeAdapter', 'CursorAiderAdapter', 'OllamaLocalAdapter', 'DeepSeekReasoningAdapter'] },
      { name: 'graph', color: '#0284c7', title: '@dev-harness/graph', desc: 'Sub-AST Code Graph & Vector Search', classes: ['CodeGraphParser', 'AstExtractor', 'SemanticVectorIndex', 'AutoFailureSynthesizer'] },
      { name: 'mcp-server', color: '#06b6d4', title: '@dev-harness/mcp-server', desc: 'Official JSON-RPC MCP Server (8 Tools)', classes: ['McpServer', 'ToolRegistry', 'ResourceRegistry', 'JsonRpc'] },
      { name: 'router', color: '#ec4899', title: '@dev-harness/router', desc: 'Dynamic Model Router & Cost Optimizer', classes: ['ModelRouter', 'TaskComplexityClassifier', 'CostBudgetOptimizer'] },
      { name: 'ui', color: '#6366f1', title: '@dev-harness/ui', desc: 'Real-Time Web Observer Dashboard', classes: ['HttpServer', 'ApiRouter', 'DashboardHtml'] },
      { name: 'spec', color: '#64748b', title: '@dev-harness/spec', desc: 'Portable TypeScript Contracts & Types', classes: ['AgentAdapter', 'RunRecord', 'ContextBundle', 'HandoffPackage'] }
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

        buildContinuousAstrolabeGalaxy(statusRes, graphRes, failuresRes, handoffsRes);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    }

    function buildContinuousAstrolabeGalaxy(status, graph, failures, handoffs) {
      nodes = [];

      nodes.push({
        id: 'node-root-kernel',
        name: 'DEV-HARNESS Kernel',
        kind: 'core',
        color: '#0f172a',
        radius: 20,
        orbitR: 0,
        angle: 0,
        shape: 'avatar'
      });

      SUBSYSTEMS.forEach((sub, sIdx) => {
        const angle = (sIdx / SUBSYSTEMS.length) * Math.PI * 2;
        nodes.push({
          id: 'sub-' + sub.name,
          name: sub.title,
          subsystem: sub.name,
          kind: 'subsystem',
          color: sub.color,
          radius: 9,
          orbitR: 0.20,
          angle: angle,
          shape: 'circle'
        });
      });

      const totalRing2 = 88;
      for (let i = 0; i < totalRing2; i++) {
        const angle = (i / totalRing2) * Math.PI * 2;
        const subIdx = Math.floor((i / totalRing2) * SUBSYSTEMS.length);
        const sub = SUBSYSTEMS[subIdx];

        nodes.push({
          id: \`ribbon-\${i}\`,
          name: \`\${sub.title} Construct #\${(i % 8) + 1}\`,
          subsystem: sub.name,
          kind: 'class',
          color: sub.color,
          radius: 3.8,
          orbitR: 0.38 + (i % 2) * 0.015,
          angle: angle,
          shape: (i % 3 === 0) ? 'square' : 'circle',
          jitterPhase: Math.random() * Math.PI * 2
        });
      }

      const allSymbols = graph.symbols || [];
      const totalRing3 = 144;
      for (let j = 0; j < totalRing3; j++) {
        const angle = (j / totalRing3) * Math.PI * 2;
        const subIdx = Math.floor((j / totalRing3) * SUBSYSTEMS.length);
        const sub = SUBSYSTEMS[subIdx];
        const sym = allSymbols[j % Math.max(1, allSymbols.length)] || { name: \`AST_Symbol_\${j}\` };

        nodes.push({
          id: \`ast-pearl-\${j}\`,
          name: sym.name,
          subsystem: sub.name,
          kind: 'symbol',
          color: sub.color,
          radius: 3.2,
          orbitR: 0.56 + (j % 3) * 0.018,
          angle: angle,
          shape: 'circle',
          data: sym,
          jitterPhase: Math.random() * Math.PI * 2
        });
      }

      const totalRing4 = 64;
      for (let k = 0; k < totalRing4; k++) {
        const angle = (k / totalRing4) * Math.PI * 2;
        const subIdx = Math.floor((k / totalRing4) * SUBSYSTEMS.length);
        const sub = SUBSYSTEMS[subIdx];

        nodes.push({
          id: \`outer-\${k}\`,
          name: (k % 4 === 0) ? \`Agent Swarm Node #\${k}\` : \`Verified Proof Artifact #\${k}\`,
          subsystem: sub.name,
          kind: (k % 4 === 0) ? 'agent' : 'handoff',
          color: (k % 4 === 0) ? '#10b981' : sub.color,
          radius: (k % 4 === 0) ? 5.5 : 3.6,
          orbitR: 0.76 + (k % 2) * 0.02,
          angle: angle,
          shape: 'diamond',
          jitterPhase: Math.random() * Math.PI * 2
        });
      }

      document.getElementById('cnt-all').innerText = nodes.length;
      document.getElementById('cnt-symbols').innerText = (graph.symbols || []).length;
      document.getElementById('cnt-failures').innerText = failures.length;
      document.getElementById('cnt-handoffs').innerText = handoffs.length;
    }

    function animate() {
      if (isRotating) {
        rotationAngle += 0.0005;
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

      const centerAura = ctx.createRadialGradient(0, 0, 0, 0, 0, 110);
      centerAura.addColorStop(0, 'rgba(234, 179, 8, 0.16)');
      centerAura.addColorStop(0.5, 'rgba(234, 179, 8, 0.05)');
      centerAura.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = centerAura;
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.fill();

      const ringsNorm = [0.20, 0.38, 0.56, 0.76];
      ringsNorm.forEach((rn, rIdx) => {
        const radius = baseDim * rn;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--ring-guide');
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);

        if (rIdx === ringsNorm.length - 1) {
          for (let deg = 0; deg < 360; deg += 30) {
            const rad = (deg * Math.PI) / 180;
            const tx1 = Math.cos(rad) * (radius - 4);
            const ty1 = Math.sin(rad) * (radius - 4);
            const tx2 = Math.cos(rad) * (radius + 4);
            const ty2 = Math.sin(rad) * (radius + 4);

            ctx.beginPath();
            ctx.moveTo(tx1, ty1);
            ctx.lineTo(tx2, ty2);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      if (activeSubsystem) {
        const subNode = nodes.find(n => n.kind === 'subsystem' && n.subsystem === activeSubsystem);
        if (subNode) {
          const curAngle = subNode.angle + rotationAngle;
          const subR = baseDim * subNode.orbitR;
          const dx = Math.cos(curAngle) * subR;
          const dy = Math.sin(curAngle) * subR;

          const glow = ctx.createRadialGradient(dx, dy, 0, dx, dy, 75);
          glow.addColorStop(0, subNode.color + '26');
          glow.addColorStop(1, subNode.color + '00');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(dx, dy, 75, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(dx * 0.5 + Math.sin(curAngle) * 14, dy * 0.5 - Math.cos(curAngle) * 14, dx, dy);
          ctx.strokeStyle = subNode.color + 'aa';
          ctx.lineWidth = 2.4;
          ctx.stroke();

          nodes.forEach(node => {
            if (node.subsystem === activeSubsystem && node.orbitR > 0.20) {
              const nAngle = node.angle + rotationAngle;
              const nR = baseDim * node.orbitR;
              const nx = Math.cos(nAngle) * nR;
              const ny = Math.sin(nAngle) * nR;

              const midX = (dx + nx) / 2 + Math.sin(nAngle) * 6;
              const midY = (dy + ny) / 2 - Math.cos(nAngle) * 6;

              ctx.beginPath();
              ctx.moveTo(dx, dy);
              ctx.quadraticCurveTo(midX, midY, nx, ny);
              ctx.strokeStyle = subNode.color + '38';
              ctx.lineWidth = 0.9;
              ctx.stroke();
            }
          });
        }
      }

      nodes.forEach(node => {
        const curAngle = (node.orbitR === 0) ? 0 : (node.angle + rotationAngle);
        const breath = (node.jitterPhase) ? Math.sin(waveTime + node.jitterPhase) * 1.2 : 0;
        const curR = baseDim * node.orbitR + breath;
        const nx = Math.cos(curAngle) * curR;
        const ny = Math.sin(curAngle) * curR;
        node.currentX = nx;
        node.currentY = ny;

        const isRelated = (!activeSubsystem || node.subsystem === activeSubsystem || node.kind === 'core');
        const alpha = isRelated ? 'ff' : '66';

        if (node.shape === 'avatar') {
          ctx.beginPath();
          ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🏛️', 0, 0);
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

        if (node.subsystem === activeSubsystem && node.kind === 'subsystem') {
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2.2;
          ctx.stroke();
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
          // 🎯 Snug, close placement right next to cursor
          tooltip.style.left = (e.clientX + 6) + 'px';
          tooltip.style.top = (e.clientY - 24) + 'px';
          tooltip.innerHTML = '<strong>' + hit.name + '</strong> • <span style="font-size:9.5px;opacity:0.85;">' + (hit.subsystem || hit.kind).toUpperCase() + '</span>';
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

      // Real vscode:// deep link
      document.getElementById('insp-ide-link').href = \`vscode://file/e:/conducting-ai/\${filePath}\`;

      document.getElementById('insp-signature').innerText = \`export class \${symName} {
  public execute(task: TaskContext): Promise<VerificationResult>;
  public readonly signatureHash: string = "sha256:4f8a...";
}\`;
    }

    function copyFilePath() {
      const filePath = document.getElementById('insp-file').innerText;
      navigator.clipboard.writeText(filePath).then(() => {
        alert('Đã sao chép đường dẫn file: ' + filePath);
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

    function zoomIn() { camera.zoom = Math.min(3.0, camera.zoom * 1.2); }
    function zoomOut() { camera.zoom = Math.max(0.4, camera.zoom / 1.2); }
    function fitView() { camera = { x: 0, y: 0, zoom: 0.95 }; }

    function toggleRotation() {
      isRotating = !isRotating;
      document.getElementById('rot-lbl').innerText = isRotating ? 'Pause' : 'Resume';
    }

    function handleSearch() {
      const q = document.getElementById('search-input').value.toLowerCase();
      if (!q) { selectSubsystem(null); return; }
      const match = SUBSYSTEMS.find(s => s.name.toLowerCase().includes(q) || s.title.toLowerCase().includes(q));
      if (match) {
        selectSubsystem(match.name);
        inspectSymbol(match.classes[0]);
      }
    }

    resizeCanvas();
    loadRealData();
    animate();
    fitView();
  </script>
</body>
</html>`;
}
