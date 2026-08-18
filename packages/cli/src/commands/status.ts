import * as fs from 'node:fs';
import * as path from 'node:path';
import { HandoffValidator, GitWorkspace } from '@dev-harness/infrastructure';
import type { HandoffPackage } from '@dev-harness/spec';

export function runStatus(targetDir: string = process.cwd()): void {
  const harnessRoot = path.join(targetDir, '.harness');
  if (!fs.existsSync(harnessRoot)) {
    console.error('❌ Thư mục .harness chưa được khởi tạo. Hãy chạy `dev-harness init` trước.');
    return;
  }

  const gitWorkspace = new GitWorkspace(targetDir);
  const currentTreeFingerprint = gitWorkspace.getTreeFingerprint();

  console.log('\n📊 DEV-HARNESS WORKSPACE STATUS');
  console.log('====================================');
  console.log(`📁 Thư mục gốc: ${targetDir}`);
  console.log(`🔑 Workspace Fingerprint: ${currentTreeFingerprint.slice(0, 16)}...`);

  // Inspect Runs
  const runsDir = path.join(harnessRoot, 'runtime', 'runs');
  if (fs.existsSync(runsDir)) {
    const runs = fs.readdirSync(runsDir);
    console.log(`\n🏃 Lịch sử Runs (${runs.length}):`);
    for (const runId of runs) {
      const resultPath = path.join(runsDir, runId, 'result.json');
      if (fs.existsSync(resultPath)) {
        const result = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
        console.log(`   • ${runId}: [${result.state}] (${result.createdAt})`);
      } else {
        console.log(`   • ${runId}: [IN_PROGRESS]`);
      }
    }
  }

  // Inspect Handoffs
  const handoffsDir = path.join(harnessRoot, 'runtime', 'handoffs');
  if (fs.existsSync(handoffsDir)) {
    const handoffs = fs.readdirSync(handoffsDir);
    console.log(`\n📦 Gói Bàn Giao Handoffs (${handoffs.length}):`);
    const validator = new HandoffValidator(targetDir);

    for (const handoffId of handoffs) {
      const handoffFile = path.join(handoffsDir, handoffId, 'handoff.json');
      if (fs.existsSync(handoffFile)) {
        const handoff = JSON.parse(fs.readFileSync(handoffFile, 'utf8')) as HandoffPackage;
        const validation = validator.validate(handoff);
        const statusBadge = validation.isValid ? '✅ VALID' : '⚠️ STALE (Code đã bị sửa ngoài)';
        console.log(`   • ${handoffId}: ${statusBadge}`);
        console.log(`     └ Tóm tắt: ${handoff.summary}`);
        console.log(`     └ Hành động tiếp theo: ${handoff.nextRecommendedActions.join(' | ')}`);
      }
    }
  }
  console.log('');
}
