export function getDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DEV-HARNESS v2.0 - Mission Control Observer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-base: #080b11;
      --bg-surface: #0f1623;
      --bg-card: #151e2e;
      --bg-card-hover: #1c2638;
      --border-subtle: #1e2b40;
      --border-focus: #38bdf8;
      
      --cyan: #00f2fe;
      --cyan-glow: rgba(0, 242, 254, 0.15);
      --indigo: #6366f1;
      --indigo-glow: rgba(99, 102, 241, 0.15);
      --emerald: #10b981;
      --emerald-glow: rgba(16, 185, 129, 0.15);
      --amber: #f59e0b;
      --rose: #f43f5e;
      
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      background-color: var(--bg-base);
      color: var(--text-primary);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Top Navigation Bar */
    header {
      background: rgba(15, 22, 35, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
      padding: 14px 28px;
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo-box {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 0 16px var(--cyan-glow);
    }

    .brand-text h1 {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-text p {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .pulse-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 12px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 9999px;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: var(--emerald);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--emerald);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
    }

    /* Tab Navigation */
    .tab-bar {
      display: flex;
      gap: 8px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      padding: 0 28px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      padding: 14px 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .tab-btn:hover {
      color: var(--text-primary);
    }

    .tab-btn.active {
      color: var(--cyan);
      border-bottom-color: var(--cyan);
      background: rgba(0, 242, 254, 0.03);
    }

    /* Main Container */
    main {
      flex: 1;
      padding: 28px;
      max-width: 1600px;
      margin: 0 auto;
      width: 100%;
    }

    /* KPI Summary Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 18px;
      margin-bottom: 28px;
    }

    .kpi-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 20px;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }

    .kpi-card:hover {
      border-color: rgba(56, 189, 248, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.5);
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--cyan);
    }

    .kpi-card.emerald::before { background: var(--emerald); }
    .kpi-card.indigo::before { background: var(--indigo); }
    .kpi-card.amber::before { background: var(--amber); }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .kpi-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--text-muted);
    }

    .kpi-icon {
      font-size: 18px;
      opacity: 0.8;
    }

    .kpi-val {
      font-size: 26px;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.5px;
    }

    .kpi-sub {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Content Panes */
    .tab-pane {
      display: none;
    }
    .tab-pane.active {
      display: block;
      animation: fadeIn 0.25s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Layout Grids */
    .section-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .section-grid { grid-template-columns: 1fr; }
    }

    .panel {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .panel-header h3 {
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* State Machine Stepper */
    .fsm-stepper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }

    .fsm-step {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 12px 10px;
      text-align: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      transition: all 0.2s;
    }

    .fsm-step.active {
      background: rgba(0, 242, 254, 0.08);
      border-color: var(--cyan);
      color: var(--cyan);
      box-shadow: 0 0 14px var(--cyan-glow);
    }

    .fsm-step.passed {
      background: rgba(16, 185, 129, 0.08);
      border-color: var(--emerald);
      color: #34d399;
    }

    /* Interactive Search Box */
    .search-input {
      width: 100%;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 10px 14px;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 13px;
      outline: none;
      margin-bottom: 16px;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: var(--cyan);
    }

    /* Interactive Data Lists */
    .data-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .data-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 16px;
      transition: all 0.2s;
    }

    .data-card:hover {
      border-color: rgba(56, 189, 248, 0.3);
      background: var(--bg-card-hover);
    }

    .data-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .data-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: var(--cyan);
    }

    .tag {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }

    .tag-valid { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .tag-stale { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .tag-domain { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; }

    .code-box {
      background: #090e17;
      border: 1px solid #1a2538;
      border-radius: 8px;
      padding: 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #e2e8f0;
      overflow-x: auto;
      white-space: pre-wrap;
    }

    /* Button Copy */
    .copy-btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .copy-btn:hover {
      background: #334155;
      color: #fff;
    }
  </style>
</head>
<body>

  <header>
    <div class="brand-group">
      <div class="logo-box">🏛️</div>
      <div class="brand-text">
        <h1>DEV-HARNESS v2.0</h1>
        <p>Distributed AI Software Engineering Runtime</p>
      </div>
    </div>
    <div class="header-actions">
      <div class="pulse-pill">
        <span class="pulse-dot"></span>
        <span>REAL-TIME OBSERVER ACTIVE</span>
      </div>
      <button class="copy-btn" onclick="copyFingerprint()">📋 Copy Fingerprint</button>
    </div>
  </header>

  <nav class="tab-bar">
    <button class="tab-btn active" onclick="switchTab('overview')">📊 Mission Overview</button>
    <button class="tab-btn" onclick="switchTab('runs')">🏃 Runs & FSM Lifecycle</button>
    <button class="tab-btn" onclick="switchTab('handoffs')">📦 Cross-Agent Handoffs</button>
    <button class="tab-btn" onclick="switchTab('failures')">🧠 Failure Knowledge Base</button>
    <button class="tab-btn" onclick="switchTab('graph')">🕸️ AST Code Graph</button>
  </nav>

  <main>
    <!-- KPI SUMMARY CARDS -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Workspace Tree Hash</span>
          <span class="kpi-icon">🔑</span>
        </div>
        <div class="kpi-val" id="kpi-fingerprint" style="font-size: 15px; font-family: 'JetBrains Mono', monospace;">Loading...</div>
        <div class="kpi-sub"><span>Canonical Git Tree Object SHA-256</span></div>
      </div>

      <div class="kpi-card emerald">
        <div class="kpi-header">
          <span class="kpi-title">Verified Task Runs</span>
          <span class="kpi-icon">⚡</span>
        </div>
        <div class="kpi-val" id="kpi-runs">0</div>
        <div class="kpi-sub"><span>100% Harness-Executed Proofs</span></div>
      </div>

      <div class="kpi-card indigo">
        <div class="kpi-header">
          <span class="kpi-title">Sealed Handoffs</span>
          <span class="kpi-icon">📦</span>
        </div>
        <div class="kpi-val" id="kpi-handoffs">0</div>
        <div class="kpi-sub"><span>Zero Context Loss Lineage</span></div>
      </div>

      <div class="kpi-card amber">
        <div class="kpi-header">
          <span class="kpi-title">Empirical Failures</span>
          <span class="kpi-icon">🧠</span>
        </div>
        <div class="kpi-val" id="kpi-failures">0</div>
        <div class="kpi-sub"><span>Auto-Synthesized Lessons</span></div>
      </div>
    </div>

    <!-- TAB 1: OVERVIEW -->
    <div id="tab-overview" class="tab-pane active">
      <div class="section-grid">
        <div>
          <div class="panel">
            <div class="panel-header">
              <h3><span>⚙️</span> Harness Kernel 12-State FSM Engine</h3>
              <span class="tag tag-valid">ACTIVE STATE MACHINE</span>
            </div>
            <div class="fsm-stepper">
              <div class="fsm-step passed">RECEIVED</div>
              <div class="fsm-step passed">PLANNED</div>
              <div class="fsm-step passed">AUTHORIZED</div>
              <div class="fsm-step passed">EXECUTING</div>
              <div class="fsm-step passed">VERIFYING</div>
              <div class="fsm-step active">COMPLETED</div>
              <div class="fsm-step">RECOVER</div>
              <div class="fsm-step">BLOCKED</div>
              <div class="fsm-step">PAUSED</div>
              <div class="fsm-step">INTERRUPTED</div>
              <div class="fsm-step">EXPIRED</div>
              <div class="fsm-step">CANCELLED</div>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 10px;">
              Mọi sự chuyển trạng thái được bảo đảm bằng <strong>Append-Only Event Sourcing</strong> trong <code>events.jsonl</code>. Không cho phép in-place state mutation.
            </p>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3><span>🏃</span> Recent Run Executions</h3>
            </div>
            <div class="data-list" id="overview-runs-list">Loading runs...</div>
          </div>
        </div>

        <div>
          <div class="panel">
            <div class="panel-header">
              <h3><span>📦</span> Latest Handoff</h3>
            </div>
            <div id="overview-latest-handoff">Loading latest handoff...</div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3><span>💡</span> Failure Memories</h3>
            </div>
            <div id="overview-latest-failures">Loading failure memories...</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: RUNS & FSM -->
    <div id="tab-runs" class="tab-pane">
      <div class="panel">
        <div class="panel-header">
          <h3><span>🏃</span> Full Execution Runs History</h3>
        </div>
        <div class="data-list" id="runs-full-list">Loading runs...</div>
      </div>
    </div>

    <!-- TAB 3: HANDOFFS -->
    <div id="tab-handoffs" class="tab-pane">
      <div class="panel">
        <div class="panel-header">
          <h3><span>📦</span> Cross-Agent Handoff Lineage & Drift Validator</h3>
        </div>
        <div class="data-list" id="handoffs-full-list">Loading handoffs...</div>
      </div>
    </div>

    <!-- TAB 4: FAILURES -->
    <div id="tab-failures" class="tab-pane">
      <div class="panel">
        <div class="panel-header">
          <h3><span>🧠</span> Empirical Failure Knowledge Base (.harness/knowledge/failures/)</h3>
        </div>
        <input type="text" class="search-input" id="failure-search" placeholder="🔍 Search failure memories by task, symptom, domain, or lesson..." oninput="filterFailures()">
        <div class="data-list" id="failures-full-list">Loading failures...</div>
      </div>
    </div>

    <!-- TAB 5: GRAPH -->
    <div id="tab-graph" class="tab-pane">
      <div class="panel">
        <div class="panel-header">
          <h3><span>🕸️</span> Sub-AST Symbol & Dependency Code Graph</h3>
        </div>
        <div class="code-box" id="graph-full-preview">Loading AST Code Graph...</div>
      </div>
    </div>
  </main>

  <script>
    let globalState = { status: {}, graph: {}, failures: [], handoffs: [] };

    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
      if (activeBtn) activeBtn.classList.add('active');

      const activePane = document.getElementById('tab-' + tabId);
      if (activePane) activePane.classList.add('active');
    }

    async function fetchData() {
      try {
        const [statusRes, graphRes, failuresRes, handoffsRes] = await Promise.all([
          fetch('/api/status').then(r => r.json()),
          fetch('/api/graph').then(r => r.json()),
          fetch('/api/failures').then(r => r.json()),
          fetch('/api/handoffs').then(r => r.json())
        ]);

        globalState = { status: statusRes, graph: graphRes, failures: failuresRes, handoffs: handoffsRes };
        renderDashboard();
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    }

    function renderDashboard() {
      // 1. KPIs
      document.getElementById('kpi-fingerprint').innerText = (globalState.status.workspaceFingerprint || '').slice(0, 20) + '...';
      document.getElementById('kpi-runs').innerText = (globalState.status.runs || []).length;
      document.getElementById('kpi-handoffs').innerText = (globalState.handoffs || []).length;
      document.getElementById('kpi-failures').innerText = (globalState.failures || []).length;

      // 2. Runs Overview
      const runs = globalState.status.runs || [];
      const runsHtml = runs.map(r => \`
        <div class="data-card">
          <div class="data-card-header">
            <span class="data-id">\${r}</span>
            <span class="tag tag-valid">COMPLETED</span>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary);">State committed into <code>.harness/runtime/runs/\${r}/events.jsonl</code></p>
        </div>
      \`).join('') || '<div style="color: var(--text-muted);">No runs recorded yet.</div>';

      document.getElementById('overview-runs-list').innerHTML = runsHtml;
      document.getElementById('runs-full-list').innerHTML = runsHtml;

      // 3. Handoffs
      const handoffs = globalState.handoffs || [];
      const handoffsHtml = handoffs.map(h => \`
        <div class="data-card">
          <div class="data-card-header">
            <span class="data-id">\${h.handoffId}</span>
            <span class="tag \${h.status === 'HANDOFF_VALID' ? 'tag-valid' : 'tag-stale'}">\${h.status || 'VALID'}</span>
          </div>
          <p style="font-size: 14px; font-weight: 600; margin-bottom: 6px;">\${h.summary}</p>
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
            <strong>Next Recommended Action:</strong> \${(h.nextRecommendedActions || []).join(' | ')}
          </div>
          <div class="code-box" style="font-size: 11px;">
Fingerprints:
• Workspace:    \${h.fingerprints?.workspaceFingerprint || 'N/A'}
• Context:      \${h.fingerprints?.contextFingerprint || 'N/A'}
• Verification: \${h.fingerprints?.verificationFingerprint || 'N/A'}
          </div>
        </div>
      \`).join('') || '<div style="color: var(--text-muted);">No handoffs recorded yet.</div>';

      document.getElementById('overview-latest-handoff').innerHTML = handoffsHtml;
      document.getElementById('handoffs-full-list').innerHTML = handoffsHtml;

      // 4. Failures
      renderFailures(globalState.failures || []);

      // 5. Code Graph
      document.getElementById('graph-full-preview').innerText = JSON.stringify({
        totalExtractedSymbols: (globalState.graph.symbols || []).length,
        totalDependencyEdges: (globalState.graph.edges || []).length,
        symbolsCatalog: (globalState.graph.symbols || []).map(s => ({
          name: s.name,
          kind: s.kind,
          file: s.file,
          signature: s.signature
        })),
        dependencyEdges: globalState.graph.edges || []
      }, null, 2);
    }

    function renderFailures(failures) {
      const failuresHtml = failures.map(f => \`
        <div class="data-card">
          <div class="data-card-header">
            <span class="data-id">\${f.id}</span>
            <span class="tag tag-domain">\${f.scope?.domain || 'GENERAL'}</span>
          </div>
          <div style="font-size: 13px; font-weight: 600; color: #f87171; margin-bottom: 4px;">❌ Symptom: \${f.evidence?.observedSymptom || f.task}</div>
          <div style="font-size: 13px; color: #34d399; margin-bottom: 6px;">💡 Lesson: \${f.lesson}</div>
          <div style="font-size: 12px; color: var(--text-muted);">
            <strong>Root Cause:</strong> \${f.rootCause || 'N/A'}
          </div>
        </div>
      \`).join('') || '<div style="color: var(--text-muted);">No empirical failure memories found.</div>';

      document.getElementById('overview-latest-failures').innerHTML = failuresHtml;
      document.getElementById('failures-full-list').innerHTML = failuresHtml;
    }

    function filterFailures() {
      const query = document.getElementById('failure-search').value.toLowerCase();
      const filtered = (globalState.failures || []).filter(f => {
        const text = (f.id + ' ' + f.task + ' ' + f.lesson + ' ' + f.rootCause + ' ' + (f.scope?.domain || '')).toLowerCase();
        return text.includes(query);
      });
      renderFailures(filtered);
    }

    function copyFingerprint() {
      const fp = globalState.status.workspaceFingerprint || '';
      navigator.clipboard.writeText(fp).then(() => {
        alert('Copied Workspace Fingerprint to clipboard:\\n' + fp);
      });
    }

    fetchData();
    setInterval(fetchData, 4000);
  </script>
</body>
</html>`;
}
