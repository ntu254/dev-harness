import { runInit } from './commands/init.js';
import { runStatus } from './commands/status.js';
import { runTask } from './commands/run.js';
import { McpServer } from '@dev-harness/mcp-server';
import { HttpServer } from '@dev-harness/ui';

export async function main(argv: string[] = process.argv.slice(2)): Promise<void> {
  const command = argv[0];

  switch (command) {
    case 'init':
      runInit();
      break;

    case 'status':
      runStatus();
      break;

    case 'mcp': {
      const server = new McpServer(process.cwd());
      server.startStdio();
      break;
    }

    case 'ui': {
      let port = 4000;
      const portFlagIdx = argv.indexOf('--port');
      if (portFlagIdx !== -1 && argv[portFlagIdx + 1]) {
        port = parseInt(argv[portFlagIdx + 1], 10) || 4000;
      }
      const server = new HttpServer({ port, workspaceRoot: process.cwd() });
      const url = await server.start();
      console.log(`\n🌐 DEV-HARNESS v2.0 Web Observer Dashboard đang chạy tại:`);
      console.log(`   👉 ${url}\n`);
      console.log('Nhấn Ctrl+C để dừng server.');
      break;
    }

    case 'run': {
      const intent = argv[1];
      if (!intent) {
        console.error('❌ Hãy chỉ định mục tiêu task: `dev-harness run "<mục tiêu>"`');
        process.exit(1);
      }
      let agent = 'claude-code';
      const agentFlagIdx = argv.indexOf('--agent');
      if (agentFlagIdx !== -1 && argv[agentFlagIdx + 1]) {
        agent = argv[agentFlagIdx + 1];
      }

      await runTask({ intent, agent });
      break;
    }

    case 'help':
    case '--help':
    case '-h':
    default:
      console.log(`
🏛️  DEV-HARNESS CLI v2.0.0-spec
Portable Runtime & Workspace Specification for AI Software Agents

CÁC LỆNH SỬ DỤNG:
  dev-harness init                     Khởi tạo cấu trúc .harness/ trong repository hiện tại
  dev-harness status                   Kiểm tra lịch sử runs, checkpoints và tính hợp lệ của handoffs
  dev-harness mcp                      Khởi động Model Context Protocol (MCP) Server qua stdio
  dev-harness ui [--port 4000]         Khởi động Web Dashboard quan sát thời gian thực
  dev-harness run "<mục tiêu>"         Thực thi tác vụ có kiểm chứng qua Harness Kernel
      [--agent claude-code|cursor]     Chỉ định AI Agent Adapter
  dev-harness help                     Hiển thị trợ giúp này
`);
      break;
  }
}

export * from './commands/init.js';
export * from './commands/status.js';
export * from './commands/run.js';
