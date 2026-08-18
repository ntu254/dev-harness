import { JsonRpcHandler, type JsonRpcRequest, type JsonRpcResponse } from '../protocol/JsonRpc.js';
import { ToolRegistry } from '../tools/ToolRegistry.js';
import { ResourceRegistry } from '../resources/ResourceRegistry.js';

export class McpServer {
  private readonly toolRegistry: ToolRegistry;
  private readonly resourceRegistry: ResourceRegistry;

  constructor(workspaceRoot: string = process.cwd()) {
    this.toolRegistry = new ToolRegistry(workspaceRoot);
    this.resourceRegistry = new ResourceRegistry(workspaceRoot);
  }

  public async handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    const { id = null, method, params } = request;

    switch (method) {
      case 'initialize':
        return JsonRpcHandler.createSuccessResponse(id, {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'dev-harness-mcp-server',
            version: '2.0.0-spec',
          },
          capabilities: {
            tools: {},
            resources: {},
          },
        });

      case 'tools/list':
        return JsonRpcHandler.createSuccessResponse(id, {
          tools: this.toolRegistry.listTools(),
        });

      case 'tools/call': {
        const { name, arguments: args } = params || {};
        if (!name) {
          return JsonRpcHandler.createErrorResponse(id, -32602, 'Missing tool name');
        }
        const result = await this.toolRegistry.callTool(name, args);
        return JsonRpcHandler.createSuccessResponse(id, result);
      }

      case 'resources/list':
        return JsonRpcHandler.createSuccessResponse(id, {
          resources: this.resourceRegistry.listResources(),
        });

      case 'resources/read': {
        const { uri } = params || {};
        if (!uri) {
          return JsonRpcHandler.createErrorResponse(id, -32602, 'Missing resource URI');
        }
        const content = this.resourceRegistry.readResource(uri);
        if (!content) {
          return JsonRpcHandler.createErrorResponse(id, -32602, `Resource not found: ${uri}`);
        }
        return JsonRpcHandler.createSuccessResponse(id, { contents: [content] });
      }

      default:
        return JsonRpcHandler.createErrorResponse(id, -32601, `Method not found: ${method}`);
    }
  }

  public startStdio(): void {
    process.stdin.setEncoding('utf8');
    let buffer = '';

    process.stdin.on('data', async (chunk: string) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const request = JSON.parse(line) as JsonRpcRequest;
          const response = await this.handleRequest(request);
          process.stdout.write(JSON.stringify(response) + '\n');
        } catch (err: any) {
          const errResp = JsonRpcHandler.createErrorResponse(null, -32700, `Parse error: ${err.message}`);
          process.stdout.write(JSON.stringify(errResp) + '\n');
        }
      }
    });
  }
}
