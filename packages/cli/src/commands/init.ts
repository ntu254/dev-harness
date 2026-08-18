import * as fs from 'node:fs';
import * as path from 'node:path';

export function runInit(targetDir: string = process.cwd()): void {
  const harnessRoot = path.join(targetDir, '.harness');
  const specDir = path.join(harnessRoot, 'spec');
  const knowledgeDir = path.join(harnessRoot, 'knowledge');
  const runtimeDir = path.join(harnessRoot, 'runtime');

  console.log(`\n🏛️  Khởi tạo DEV-HARNESS Workspace tại: ${targetDir}`);

  // Create directories
  fs.mkdirSync(path.join(specDir, 'policies'), { recursive: true });
  fs.mkdirSync(path.join(specDir, 'skills'), { recursive: true });
  fs.mkdirSync(path.join(specDir, 'verifiers'), { recursive: true });

  fs.mkdirSync(path.join(knowledgeDir, 'decisions'), { recursive: true });
  fs.mkdirSync(path.join(knowledgeDir, 'failures'), { recursive: true });
  fs.mkdirSync(path.join(knowledgeDir, 'graph'), { recursive: true });

  fs.mkdirSync(path.join(runtimeDir, 'runs'), { recursive: true });
  fs.mkdirSync(path.join(runtimeDir, 'handoffs'), { recursive: true });
  fs.mkdirSync(path.join(runtimeDir, 'checkpoints'), { recursive: true });

  // 1. manifest.json
  const manifest = {
    name: 'dev-harness-workspace',
    version: '1.0.0-spec',
    engine: '>=1.0.0',
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(harnessRoot, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  // 2. spec/environment.json
  const envSpec = {
    baseImage: 'node:20-alpine',
    toolchains: {
      node: '>=20.0.0',
      typescript: '>=5.0.0',
    },
    resourceLimits: {
      cpuCores: 2,
      memoryMb: 2048,
      timeoutSeconds: 30,
    },
    networkAllowlist: ['registry.npmjs.org', 'pypi.org', 'github.com'],
  };
  fs.writeFileSync(path.join(specDir, 'environment.json'), JSON.stringify(envSpec, null, 2), 'utf8');

  // 3. spec/policies/default-policy.json
  const defaultPolicy = {
    id: 'default-tdd-policy',
    description: 'Enforce TDD for features and regression tests for bugfixes',
    scope: { paths: ['src/**'] },
    enforcedStrategy: 'tdd_red_green',
  };
  fs.writeFileSync(path.join(specDir, 'policies', 'default-policy.json'), JSON.stringify(defaultPolicy, null, 2), 'utf8');

  // 4. knowledge/decisions/ADR-001.md
  const sampleAdr = `# ADR-001: Initial Architecture Setup\n\n**Status:** Accepted\n\n## Context\nKhởi tạo workspace với DEV-HARNESS runtime specification.\n\n## Decision\nSử dụng kiến trúc modular, tách biệt Portable spec và Ephemeral runtime.\n`;
  fs.writeFileSync(path.join(knowledgeDir, 'decisions', 'ADR-001-init.md'), sampleAdr, 'utf8');

  // 5. Update or create .gitignore for .harness/runtime
  const gitignorePath = path.join(targetDir, '.gitignore');
  const ignoreRule = '\n# DEV-HARNESS Ephemeral Runtime\n.harness/runtime/\n';
  if (fs.existsSync(gitignorePath)) {
    const existing = fs.readFileSync(gitignorePath, 'utf8');
    if (!existing.includes('.harness/runtime')) {
      fs.appendFileSync(gitignorePath, ignoreRule, 'utf8');
    }
  } else {
    fs.writeFileSync(gitignorePath, ignoreRule.trimStart(), 'utf8');
  }

  console.log('✅ Đã tạo cấu trúc .harness/ thành công:');
  console.log('   ├── .harness/manifest.json');
  console.log('   ├── .harness/spec/ (environment.json, policies/, skills/, verifiers/)');
  console.log('   ├── .harness/knowledge/ (decisions/, failures/, graph/)');
  console.log('   └── .harness/runtime/ (runs/, handoffs/, checkpoints/ -> .gitignored)\n');
}
