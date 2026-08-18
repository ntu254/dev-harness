import { runInit } from './commands/init.js';
import { runStatus } from './commands/status.js';
import { runTask } from './commands/run.js';

export async function main(argv: string[] = process.argv.slice(2)): Promise<void> {
  const command = argv[0];

  switch (command) {
    case 'init':
      runInit();
      break;

    case 'status':
      runStatus();
      break;

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
🏛️  DEV-HARNESS CLI v1.0.0-spec
Portable Runtime & Workspace Specification for AI Software Agents

CÁC LỆNH SỬ DỤNG:
  dev-harness init                     Khởi tạo cấu trúc .harness/ trong repository hiện tại
  dev-harness status                   Kiểm tra lịch sử runs, checkpoints và tính hợp lệ của handoffs
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
