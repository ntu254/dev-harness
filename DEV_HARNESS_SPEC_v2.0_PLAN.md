# 🏛️ DEV-HARNESS v2.0: ARCHITECTURAL SPECIFICATION & ROADMAP
**Đặc tả Kiến Trúc & Kế Hoạch Triển Khai Bản v2.0**  
*The Distributed, Autonomous & Multi-Agent Runtime Specification for AI Software Engineering*

---

## 1. TẦM NHÌN & BƯỚC NHẢY VỌT TỪ v1.0 LÊN v2.0

Nếu **DEV-HARNESS v1.0** giải quyết bài toán:
> *"Một AI Agent đơn lẻ (hoặc tuần tự từng Agent) làm việc an toàn, có kiểm chứng và bàn giao trạng thái trên một máy cục bộ"*

Thì **DEV-HARNESS v2.0** nâng tầm thành:
> *"Một hạ tầng điều phối đa Agent song song (Multi-Agent Swarm), tự động tổng hợp tri thức lỗi (Auto-Failure Synthesis), microVM sandbox phân tán, định tuyến mô hình thông minh (Model Router) và giao diện quan sát thời gian thực (Real-time Observer UI/TUI) kết nối chuẩn MCP."*

```
                                    ┌──────────────────────────────────────────────────────────┐
                                    │                AI AGENT SWARM (CONCURRENT)               │
                                    │                                                          │
                                    │  Coder Agent  │ Architect Agent │ Reviewer │ Tester Agent │
                                    └─────────────────────────────┬────────────────────────────┘
                                                                  │ (Bi-directional MCP Protocol)
                                                                  ▼
                                    ┌──────────────────────────────────────────────────────────┐
                                    │             DEV-HARNESS v2.0 DISTRIBUTED KERNEL          │
                                    │                                                          │
                                    │ • Multi-Worktree Isolation & 3-Way Semantic Merge        │
                                    │ • Dynamic Model Router (Cost vs Capability Optimizer)   │
                                    │ • Active Hybrid Knowledge Graph (Sub-AST + Vector Index) │
                                    │ • Automated Failure Synthesizer (Auto FAIL-XXX on Crash) │
                                    │ • Distributed Sandbox Fleet (Local / MicroVM / gVisor)   │
                                    │ • Event Stream WebSocket Server (TUI & Web Dashboard)    │
                                    └─────────────────────────────┬────────────────────────────┘
                                                                  │
                 ┌────────────────────────────────────────────────┼────────────────────────────────────────────────┐
                 ▼                                                ▼                                                ▼
  ┌───────────────────────────────┐                ┌───────────────────────────────┐                ┌───────────────────────────────┐
  │     ACTIVE KNOWLEDGE GRAPH    │                │       MICROVM SANDBOX FLEET   │                │     REAL-TIME OBSERVER UI     │
  │                               │                │                               │                │                               │
  │ Tree-sitter Sub-AST Parser    │                │ MicroVM / Firecracker / gVisor│                │ Web Dashboard (Vite + React)  │
  │ SQLite-Vec / Hybrid Search    │                │ <500ms Copy-on-Write Snaps    │                │ Terminal UI (Interactive TUI) │
  │ Auto-Generated FAIL-XXX Memory│                │ Network Egress TLS Proxy      │                │ 3D Code Graph & Event Replay  │
  └───────────────────────────────┘                └───────────────────────────────┘                └───────────────────────────────┘
```

---

## 2. SÁU TRỤ CỘT ĐỘT PHÁ CỦA DEV-HARNESS v2.0

### 🏛️ Trụ Cột 1: Multi-Agent Swarm & Git Worktree Isolation
* **Thách thức v1.0:** Các agent chỉ có thể chạy tuần tự (Agent 1 xong $\rightarrow$ tạo Handoff $\rightarrow$ Agent 2 tiếp quản).
* **Giải pháp v2.0:**
  * **Worktree Concurrency:** Kernel khởi tạo các Git Worktrees cô lập trong `.harness/runtime/worktrees/RUN-XXX-worker/`. Mỗi Worker Agent (ví dụ: Frontend Agent, Backend Agent, Database Agent) chạy hoàn toàn song song trong sandbox riêng.
  * **3-Way Semantic Merge Resolver:** Khi các Worker hoàn thành, Kernel tiến hành hợp nhất nhánh tự động với thuật toán giải quyết xung đột dựa trên AST.
  * **Consensus & Peer-Review Gate:** Agent Reviewer tự động kiểm tra diff của Agent Coder trước khi Kernel cho phép commit vào branch chính.

---

### 🧠 Trụ Cột 2: Semantic Knowledge Graph & Auto-Failure Synthesizer
* **Thách thức v1.0:** File `FAIL-XXX.json` phải tạo thủ công hoặc đối chiếu bằng so khớp chuỗi domain.
* **Giải pháp v2.0:**
  * **Tree-sitter AST Graph:** Quét toàn bộ repository thành đồ thị các symbol (Classes, Functions, Call Graph, Import Graph) lưu trong SQLite nhúng (`@dev-harness/graph`).
  * **SQLite-Vec Hybrid Index:** Tìm kiếm ngữ cảnh và bài học lỗi theo vector embedding cục bộ (không gửi code ra ngoài).
  * **Auto-Failure Ingestion:** Khi một Run thất bại (test fail hoặc sandbox crash), Kernel tự động phân tích stack trace, so khớp diff và sinh tệp `.harness/knowledge/failures/FAIL-XXX.json` mới kèm giả thuyết thất bại (`failedHypothesis`) và bài học (`lesson`).

---

### ⚡ Trụ Cột 3: MicroVM & Distributed Sandbox Fleet
* **Thách thức v1.0:** Docker CLI và Process isolation phụ thuộc vào máy host, thời gian khởi động lâu hơn.
* **Giải pháp v2.0:**
  * Hỗ trợ **MicroVMs (Firecracker / gVisor / Cloud Sandboxes)** với thời gian khởi động <500ms.
  * **Copy-on-Write (CoW) Instant Snapshots:** Bản chụp checkpoint `CP-XXX` hoàn tất trong vài mili-giây bằng kỹ thuật CoW overlay.
  * Hỗ trợ Remote Sandboxes (chạy code nặng trên remote server thông qua kết nối mã hóa mTLS/gRPC).

---

### 🌐 Trụ Cột 4: Model Router & Local LLM Support
* **Thách thức v1.0:** Chưa có cơ chế tối ưu chi phí và chọn model linh hoạt.
* **Giải pháp v2.0:**
  * **Dynamic Cost & Capability Router:**
    * *Tác vụ phân tích/lập kế hoạch context:* Điều hướng sang model nhẹ, nhanh (Claude 3.5 Haiku, DeepSeek-V3, Qwen 2.5 Coder).
    * *Tác vụ viết logic phức tạp / giải quyết bug khó:* Điều hướng sang model suy luận sâu (Claude 3.7 Sonnet Thinking, OpenAI o3-mini, DeepSeek-R1).
  * **Local LLM Engine:** Adapter tương thích 100% với Ollama / vLLM chạy hoàn toàn offline trên GPU nội bộ.

---

### 🔌 Trụ Cột 5: Native Model Context Protocol (MCP) Server & Client
* **Thách thức v1.0:** Tích hợp qua CLI wrapper hoặc file skills cục bộ.
* **Giải pháp v2.0:**
  * **DEV-HARNESS MCP Server (`dev-harness mcp`):** Cung cấp bộ công cụ chuẩn MCP (Model Context Protocol) theo JSON-RPC qua stdio/SSE.
  * Mọi công cụ AI hỗ trợ MCP (Claude Desktop, Cursor, Antigravity, Zed, VS Code) có thể kết nối ngay lập tức chỉ với 1 dòng cấu hình trong `mcp_config.json`:
    ```json
    {
      "mcpServers": {
        "dev-harness": {
          "command": "npx",
          "args": ["dev-harness", "mcp"]
        }
      }
    }
    ```

---

### 📊 Trụ Cột 6: Real-Time Observer UI & Interactive Terminal TUI
* **Thách thức v1.0:** Quan sát qua log text trong terminal.
* **Giải pháp v2.0:**
  * **Terminal TUI (Interactive Ink/Blessed):** Giao diện terminal đồ họa trực tiếp hiển thị timeline State Machine, thanh tiến trình token, và cây handoff.
  * **Web Dashboard (`dev-harness ui`):** Giao diện Web cục bộ (React + Vite + WebSockets) trực quan hóa:
    * Đồ thị mã nguồn 3D (Sub-AST Graph Explorer).
    * Bảng theo dõi các AI Agent đang chạy song song.
    * Trình phát lại (Replay Player) từng bước chạy kèm log terminal và diff.

---

## 3. CẤU TRÚC MONOREPO v2.0

```
packages/
├── spec/                         # [Core Spec v2.0] Contracts mở rộng cho Swarm, MCP, Graph
├── kernel/                       # [Kernel v2.0] Multi-worktree coordinator, Router, Auto-fail
│
├── graph/                        # [NEW - v2.0] Tree-sitter Sub-AST Parser & SQLite-Vec Index
├── router/                       # [NEW - v2.0] Dynamic Model Routing (Cost & Reasoning Opt)
├── mcp-server/                   # [NEW - v2.0] Official DEV-HARNESS Model Context Protocol Server
├── ui/                           # [NEW - v2.0] Real-time Web Dashboard (React + WebSockets)
├── tui/                          # [NEW - v2.0] Interactive Terminal UI (Ink / Blessed)
│
├── infrastructure/               # [v2.0] Git Worktree Swarm Manager, SQLite RunStore
├── sandbox/                      # [v2.0] MicroVM (Firecracker/gVisor) & Remote Sandbox Providers
├── security/                     # [v2.0] RBAC Tool Permissions, Network Proxy with TLS audit
├── verifier/                     # [v2.0] Visual Diff Verifier, Mutation Testing Verifier
├── adapters/                     # [v2.0] Ollama, vLLM, DeepSeek-R1, Claude 3.7 Sonnet, OpenAI o3
└── cli/                          # [v2.0] CLI commands: init, run, swarm, status, mcp, ui, replay
```

---

## 4. LỘ TRÌNH TRIỂN KHAI 5 GIAI ĐOẠN (v2.0 ROADMAP)

### 📍 Giai Đoạn 1: Đồ Thị Mã Nguồn & Tự Động Tổng Hợp Tri Thức Lỗi (`@dev-harness/graph`)
* Tích hợp parser Tree-sitter cho TypeScript, Python, Go, Rust.
* Xây dựng SQLite-Vec index cục bộ cho Code Graph & Failure Memory.
* Tự động sinh `FAIL-XXX.json` khi bài test chạy fail trong sandbox.

### 📍 Giai Đoạn 2: Model Context Protocol Native Server (`@dev-harness/mcp-server`)
* Triển khai MCP JSON-RPC Server qua stdio và SSE.
* Expose các tools: `harness_get_context`, `harness_run_verifier`, `harness_create_checkpoint`, `harness_handoff`, `harness_query_failures`.
* Kết nối trực tiếp vào Google Antigravity, Cursor và Claude Desktop.

### 📍 Giai Đoạn 3: Multi-Agent Swarm & Git Worktree Concurrency
* Xây dựng `WorktreeManager` cho phép 2+ Agent code đồng thời trên 2 task độc lập.
* Xây dựng `ConsensusEngine` hỗ trợ kịch bản Coder $\leftrightarrow$ Reviewer.
* Tự động hợp nhất 3-way merge và kích hoạt Verifier trên nhánh chính.

### 📍 Giai Đoạn 4: Dynamic Model Router & Local LLM Adapters (`@dev-harness/router`)
* Xây dựng bộ định tuyến tác vụ dựa trên độ phức tạp và ngân sách token.
* Tích hợp Adapter cho Ollama và vLLM (DeepSeek R1/V3, Qwen 2.5 Coder).

### 📍 Giai Đoạn 5: Web Dashboard & Interactive Terminal UI (`@dev-harness/ui` & `tui`)
* Dựng WebSocket event bridge từ Kernel.
* Xây dựng giao diện Web trực quan hóa State Machine, Graph và Timeline replay.
* Xây dựng giao diện dòng lệnh tương tác (TUI) bằng Ink.
