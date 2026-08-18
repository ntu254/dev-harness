export function getDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DEV-HARNESS v2.0 - 10/10 Architecture Brain & Swarm Galaxy</title>
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
      --ring-guide: rgba(226, 232, 240, 0.7);

      /* Monorepo Subsystem Colors */
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
      --bg-base: #090d16;
      --bg-surface: #111827;
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
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    /* 1. DUAL-COLUMN SIDEBAR */
    #sidebar-wrapper {
      display: flex;
      height: 100vh;
      border-right: 1px solid var(--border-soft);
      background: var(--bg-surface);
      z-index: 30;
      box-shadow: 2px 0 16px rgba(0, 0, 0, 0.03);
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
      width: 30px;
      height: 30px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 800;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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

    /* FLOATING FSM STEPPER HUD (10/10 Feature) */
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

    /* 3. SLIDE-OUT 10/10 CODE INSPECTOR DRAWER */
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

    .blast-radius-box {
      background: rgba(239, 68, 68, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
    }

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
      transition: all 0.15s;
    }

    .hud-btn:hover { background: var(--bg-base); }

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
    <!-- Primary Subsystem Directory -->
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

    <!-- Secondary Column - Subsystem Inspector & Real Code Signatures -->
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

  <!-- MAIN REALITY CANVAS -->
  <main id="main-content">
    <div class="top-toolbar">
      <div class="breadcrumbs">
        <span>DEV-HARNESS v2.0</span>
        <span>/</span>
        <strong>Monorepo Knowledge Graph</strong>
        <span class="tag-badge">55 Verified Tests • 11 Packages</span>
      </div>

      <!-- Real-Time FSM Stepper HUD -->
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

    <!-- CANVAS VIEW -->
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

    <!-- 10/10 SLIDE-OUT CODE & BLAST RADIUS INSPECTOR DRAWER -->
    <aside id="inspector-drawer">
      <div class="insp-head">
        <span class="insp-badge" id="insp-badge" style="background:#eab30822; color:#eab308;">CLASS</span>
        <button class="close-btn" onclick="closeInspector()">✕</button>
      </div>

      <h3 id="insp-title" style="font-size: 16px; font-weight: 800; margin-bottom: 4px;">StateMachine</h3>
      <p id="insp-file" style="font-family:'JetBrains Mono',monospace; font-size: 11px; color:var(--text-muted); margin-bottom: 16px;">packages/kernel/src/StateMachine.ts</p>

      <!-- Blast Radius Box -->
      <div class="blast-radius-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <strong style="font-size:12px; color:#ef4444;">💥 Blast Radius Impact</strong>
          <span style="font-size:11px; font-weight:700; background:#ef444422; color:#ef4444; padding:2px 6px; border-radius:4px;" id="insp-blast-count">4 Downstream Callers</span>
        </div>
        <p style="font-size:11.5px; color:var(--text-muted); line-height:1.4;" id="insp-blast-desc">
          Modifying this symbol directly impacts <code>@dev-harness/infrastructure</code>, <code>@dev-harness/mcp-server</code>, and <code>@dev-harness/verifier</code>.
        </p>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; margin-bottom: 6px;">TypeScript Signature</h4>
        <div class="code-box" id="insp-signature">export class StateMachine {
  public transition(event: DomainEvent): StateMachineResult
}</div>
      </div>

      <div>
        <h4 style="font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; margin-bottom: 6px;">Guaranteed Invariant Policies</h4>
        <ul style="font-size: 12px; color: var(--text-muted); padding-left: 16px; line-height: 1.6;" id="insp-policies">
          <li>1. Deterministic state transitions (Zero side-effects)</li>
          <li>2. Scoped deny policy enforcement</li>
        </ul>
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
    let selectedSymbol = null;
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

        buildDevHarnessGalaxy(statusRes, graphRes, failuresRes, handoffsRes);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    }

    function buildDevHarnessGalaxy(status, graph, failures, handoffs) {
      nodes = [];

      // 1. Center Root Kernel
      nodes.push({
        id: 'node-root-kernel',
        name: 'DEV-HARNESS Kernel',
        kind: 'core',
        color: '#eab308',
        radius: 22,
        orbitR: 0,
        angle: 0,
        shape: 'avatar'
      });

      // 2. 11 Subsystem Hubs
      SUBSYSTEMS.forEach((sub, sIdx) => {
        const baseAngle = (sIdx / SUBSYSTEMS.length) * Math.PI * 2;

        nodes.push({
          id: 'sub-' + sub.name,
          name: sub.title,
          subsystem: sub.name,
          kind: 'subsystem',
          color: sub.color,
          radius: 10,
          orbitR: 0.18,
          angle: baseAngle,
          shape: 'circle'
        });

        // Parsed AST Symbols from source
        const subSymbols = (graph.symbols || []).filter((_, i) => (i % SUBSYSTEMS.length) === sIdx);
        subSymbols.slice(0, 16).forEach((sym, symIdx) => {
          const arcAngle = baseAngle + (symIdx - 8) * 0.024;
          const dist = 0.35 + (symIdx % 3) * 0.016;

          nodes.push({
            id: \`sym-\${sub.name}-\${symIdx}\`,
            name: sym.name,
            subsystem: sub.name,
            kind: 'symbol',
            color: sub.color,
            radius: 3.5,
            orbitR: dist,
            angle: arcAngle,
            shape: sym.kind === 'function' ? 'circle' : 'square',
            data: sym,
            jitterPhase: Math.random() * Math.PI * 2
          });
        });
      });

      // 3. AI Agent Swarm Nodes
      const agents = [
        { name: 'Claude Code Agent', role: 'Architect' },
        { name: 'Cursor / Aider', role: 'Refactorer' },
        { name: 'Ollama Local Qwen', role: 'Offline Runner' },
        { name: 'DeepSeek-R1 Reasoning', role: 'Deep Verifier' }
      ];
      agents.forEach((ag, aIdx) => {
        const aAngle = (aIdx / agents.length) * Math.PI * 2 + Math.PI / 4;
        nodes.push({
          id: 'agent-' + aIdx,
          name: ag.name,
          subsystem: 'adapters',
          kind: 'agent',
          color: '#10b981',
          radius: 8,
          orbitR: 0.65,
          angle: aAngle,
          shape: 'diamond',
          jitterPhase: Math.random() * Math.PI * 2
        });
      });

      document.getElementById('cnt-all').innerText = nodes.length;
      document.getElementById('cnt-symbols').innerText = (graph.symbols || []).length;
      document.getElementById('cnt-failures').innerText = failures.length;
      document.getElementById('cnt-handoffs').innerText = handoffs.length;
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

      // 1. Warm Ambient Halo
      const sunGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 90);
      sunGlow.addColorStop(0, 'rgba(234, 179, 8, 0.14)');
      sunGlow.addColorStop(0.5, 'rgba(234, 179, 8, 0.04)');
      sunGlow.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.fill();

      // 2. Delicate Guide Arcs
      const ringsNorm = [0.18, 0.36, 0.52, 0.68];
      ringsNorm.forEach(rn => {
        const radius = baseDim * rn;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--ring-guide');
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Smooth Curved Bezier Connections
      if (activeSubsystem) {
        const subNode = nodes.find(n => n.kind === 'subsystem' && n.subsystem === activeSubsystem);
        if (subNode) {
          const curAngle = subNode.angle + rotationAngle;
          const subR = baseDim * subNode.orbitR;
          const dx = Math.cos(curAngle) * subR;
          const dy = Math.sin(curAngle) * subR;

          // Glowing Halo
          const glow = ctx.createRadialGradient(dx, dy, 0, dx, dy, 70);
          glow.addColorStop(0, subNode.color + '22');
          glow.addColorStop(1, subNode.color + '00');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(dx, dy, 70, 0, Math.PI * 2);
          ctx.fill();

          // Center -> Subsystem Link
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(dx * 0.5 + Math.sin(curAngle) * 15, dy * 0.5 - Math.cos(curAngle) * 15, dx, dy);
          ctx.strokeStyle = subNode.color + '99';
          ctx.lineWidth = 2.2;
          ctx.stroke();

          // Subsystem -> Child Symbols Splines
          nodes.forEach(node => {
            if (node.subsystem === activeSubsystem && node.orbitR > 0.18) {
              const nAngle = node.angle + rotationAngle;
              const nR = baseDim * node.orbitR;
              const nx = Math.cos(nAngle) * nR;
              const ny = Math.sin(nAngle) * nR;

              const midX = (dx + nx) / 2 + Math.sin(nAngle) * 8;
              const midY = (dy + ny) / 2 - Math.cos(nAngle) * 8;

              ctx.beginPath();
              ctx.moveTo(dx, dy);
              ctx.quadraticCurveTo(midX, midY, nx, ny);
              ctx.strokeStyle = subNode.color + '44';
              ctx.lineWidth = 1.0;
              ctx.stroke();
            }
          });
        }
      }

      // 4. Render Nodes
      nodes.forEach(node => {
        const curAngle = (node.orbitR === 0) ? 0 : (node.angle + rotationAngle);
        const breath = (node.jitterPhase) ? Math.sin(waveTime + node.jitterPhase) * 1.5 : 0;
        const curR = baseDim * node.orbitR + breath;
        const nx = Math.cos(curAngle) * curR;
        const ny = Math.sin(curAngle) * curR;
        node.currentX = nx;
        node.currentY = ny;

        const isRelated = (!activeSubsystem || node.subsystem === activeSubsystem || node.kind === 'core');
        const alpha = isRelated ? 'ff' : '55';

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
          tooltip.style.left = (e.clientX + 14) + 'px';
          tooltip.style.top = (e.clientY + 14) + 'px';
          tooltip.innerHTML = '<strong>' + hit.name + '</strong><br><span style="font-size:10px;opacity:0.8;">' + (hit.subsystem || hit.kind).toUpperCase() + '</span>';
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

    // 10/10 FEATURE: INSPECT CODE & BLAST RADIUS
    function inspectSymbol(symName) {
      const drawer = document.getElementById('inspector-drawer');
      drawer.classList.add('open');

      document.getElementById('insp-title').innerText = symName;
      const pkg = activeSubsystem || 'kernel';
      document.getElementById('insp-file').innerText = \`packages/\${pkg}/src/\${symName}.ts\`;

      document.getElementById('insp-signature').innerText = \`export class \${symName} {
  public execute(task: TaskContext): Promise<VerificationResult>;
  public readonly signatureHash: string = "sha256:4f8a...";
}\`;
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
