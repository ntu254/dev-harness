export function getDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DEV-HARNESS v2.0 - Real-Time Observer Dashboard</title>
  <style>
    :root {
      --bg: #090d16;
      --card: #121826;
      --card-border: #1e293b;
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.2);
      --success: #22c55e;
      --warning: #eab308;
      --danger: #ef4444;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 24px;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 24px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand h1 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      background: rgba(56, 189, 248, 0.1);
      color: var(--accent);
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    }
    .card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .card-value {
      font-size: 28px;
      font-weight: 700;
    }
    .timeline {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .timeline-node {
      padding: 6px 12px;
      background: #1e293b;
      border-radius: 6px;
      font-size: 12px;
      font-family: monospace;
      border: 1px solid #334155;
    }
    .timeline-node.active {
      background: #0284c7;
      border-color: #38bdf8;
      color: #fff;
      box-shadow: 0 0 10px var(--accent-glow);
    }
    .list {
      list-style: none;
      margin-top: 10px;
    }
    .list-item {
      padding: 12px;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .list-item:last-child { border-bottom: none; }
    .status-valid { color: var(--success); }
    .status-stale { color: var(--warning); }
    pre {
      background: #0f172a;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      overflow-x: auto;
      border: 1px solid #1e293b;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span style="font-size: 32px;">🏛️</span>
      <div>
        <h1>DEV-HARNESS v2.0</h1>
        <p style="font-size: 13px; color: var(--text-muted);">The Distributed & Autonomous Multi-Agent Runtime</p>
      </div>
    </div>
    <div>
      <span class="badge" id="live-badge">● LIVE OBSERVER ACTIVE</span>
    </div>
  </header>

  <div class="grid">
    <div class="card">
      <div class="card-title">Workspace Tree Fingerprint</div>
      <div class="card-value" id="workspace-fingerprint" style="font-size: 16px; font-family: monospace;">Loading...</div>
    </div>
    <div class="card">
      <div class="card-title">Completed Runs</div>
      <div class="card-value" id="runs-count">0</div>
    </div>
    <div class="card">
      <div class="card-title">Sealed Handoffs</div>
      <div class="card-value" id="handoffs-count">0</div>
    </div>
    <div class="card">
      <div class="card-title">Failure Memories</div>
      <div class="card-value" id="failures-count">0</div>
    </div>
  </div>

  <div class="grid" style="grid-template-columns: 2fr 1fr;">
    <div class="card">
      <div class="card-title">Harness Kernel 12-State FSM Lifecycle</div>
      <div class="timeline" id="fsm-timeline">
        <div class="timeline-node active">RECEIVED</div>
        <div class="timeline-node active">PLANNED</div>
        <div class="timeline-node active">AUTHORIZED</div>
        <div class="timeline-node active">EXECUTING</div>
        <div class="timeline-node active">VERIFYING</div>
        <div class="timeline-node active">COMPLETED</div>
        <div class="timeline-node">RECOVER</div>
        <div class="timeline-node">BLOCKED</div>
        <div class="timeline-node">PAUSED</div>
        <div class="timeline-node">INTERRUPTED</div>
        <div class="timeline-node">EXPIRED</div>
        <div class="timeline-node">CANCELLED</div>
      </div>
      <div style="margin-top: 20px;">
        <div class="card-title">Live Code Graph Neighborhood</div>
        <pre id="graph-preview">Loading AST Symbol Graph...</pre>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Latest Cross-Agent Handoffs</div>
      <ul class="list" id="handoffs-list">
        <li class="list-item">Loading handoffs...</li>
      </ul>
      <div style="margin-top: 20px;">
        <div class="card-title">Empirical Failure Memories</div>
        <ul class="list" id="failures-list">
          <li class="list-item">Loading memories...</li>
        </ul>
      </div>
    </div>
  </div>

  <script>
    async function loadData() {
      try {
        const [statusRes, graphRes, failuresRes, handoffsRes] = await Promise.all([
          fetch('/api/status').then(r => r.json()),
          fetch('/api/graph').then(r => r.json()),
          fetch('/api/failures').then(r => r.json()),
          fetch('/api/handoffs').then(r => r.json())
        ]);

        document.getElementById('workspace-fingerprint').innerText = statusRes.workspaceFingerprint || 'N/A';
        document.getElementById('runs-count').innerText = (statusRes.runs || []).length;
        document.getElementById('handoffs-count').innerText = (handoffsRes || []).length;
        document.getElementById('failures-count').innerText = (failuresRes || []).length;

        // Render Graph Preview
        document.getElementById('graph-preview').innerText = JSON.stringify({
          totalSymbols: (graphRes.symbols || []).length,
          totalEdges: (graphRes.edges || []).length,
          sampleSymbols: (graphRes.symbols || []).slice(0, 5).map(s => s.name + ' (' + s.kind + ')')
        }, null, 2);

        // Render Handoffs
        const handoffsList = document.getElementById('handoffs-list');
        handoffsList.innerHTML = (handoffsRes || []).map(h => 
          \`<li class="list-item">
            <div>
              <strong>\${h.handoffId}</strong>
              <div style="font-size: 12px; color: var(--text-muted);">\${h.summary}</div>
            </div>
            <span class="badge">\${h.status || 'VALID'}</span>
          </li>\`
        ).join('') || '<li class="list-item">No handoffs yet</li>';

        // Render Failures
        const failuresList = document.getElementById('failures-list');
        failuresList.innerHTML = (failuresRes || []).map(f => 
          \`<li class="list-item">
            <div>
              <strong>\${f.id}</strong> (\${f.scope?.domain || 'general'})
              <div style="font-size: 12px; color: var(--text-muted);">\${f.lesson}</div>
            </div>
          </li>\`
        ).join('') || '<li class="list-item">No failures recorded</li>';

      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }

    loadData();
    setInterval(loadData, 5000);
  </script>
</body>
</html>`;
}
