
const MCP_SERVER_URL = process.env.FIVETRAN_MCP_URL || 'http://localhost:8000';

export class FivetranService {
  static async checkSyncStatus(connectorId: string): Promise<{
    connectorId: string;
    lastSync: string | null;
    status: string;
    isFresh: boolean;
  }> {
    try {
      const response = await fetch(`${MCP_SERVER_URL}/mcp/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'check_sync_status',
          arguments: { connector_id: connectorId }
        }),
      });

      const result = await response.json() as {
        content?: Array<{ type: string; text: string }>;
      };

      const text = result.content?.[0]?.text;
      const parsed = text ? JSON.parse(text) as {
        synced_at?: string;
        status?: string;
      } : {};
      const lastSync: string | null = parsed.synced_at ?? null;

      return {
        connectorId,
        lastSync,
        status: parsed.status || 'unknown',
        isFresh: this.isFresh(lastSync),
      };
    } catch (error) {
      console.error(`[Fivetran check_sync_status error for ${connectorId}]`, error);
      return {
        connectorId,
        lastSync: null,
        status: 'error',
        isFresh: false,
      };
    }
  }

  static async triggerSync(connectorId: string): Promise<{
    requestId: string;
    approvalRequired: boolean;
    approvalUrl?: string;
  }> {
    try {
      const response = await fetch(`${MCP_SERVER_URL}/mcp/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'trigger_sync',
          arguments: { connector_id: connectorId }
        }),
      });

      const result = await response.json() as {
        content?: Array<{ type: string; text: string }>;
      };

      const text = result.content?.[0]?.text;
      const parsed = text ? JSON.parse(text) as {
        request_id?: string;
        requires_approval?: boolean;
        approval_url?: string;
      } : {};

      return {
        requestId: parsed.request_id || `req_${Date.now()}`,
        approvalRequired: parsed.requires_approval || false,
        approvalUrl: parsed.approval_url,
      };
    } catch (error) {
      console.error(`[Fivetran trigger_sync error for ${connectorId}]`, error);
      throw new Error('Failed to trigger sync');
    }
  }
  static async checkAllSyncs(connectorIds: string[]): Promise<{
    results: Array<{
      connectorId: string;
      lastSync: string | null;
      status: string;
      isFresh: boolean;
    }>;
    allFresh: boolean;
  }> {
    const results = await Promise.all(
      connectorIds.map(id => this.checkSyncStatus(id))
    );

    return {
      results,
      allFresh: results.every(r => r.isFresh),
    };
  }

  private static isFresh(lastSync: string | null): boolean {
    if (!lastSync) return false;
    const syncTime = new Date(lastSync);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return syncTime > oneHourAgo;
  }
}