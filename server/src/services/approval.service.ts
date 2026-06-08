import { prisma } from '../lib/db';
import { ApprovalResponse } from '../types';

export class ApprovalService {
  static async approveApproval(id: string, approvedBy: string): Promise<ApprovalResponse> {
    const approval = await prisma.approval.update({
      where: { id },
      data: {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy,
      },
    });

    return {
      id: approval.id,
      forecastId: approval.forecastId,
      actions: approval.actions as any[],
      status: approval.status,
      approvedBy: approval.approvedBy,
      approvedAt: approval.approvedAt?.toISOString() || null,
      createdAt: approval.createdAt.toISOString(),
    };
  }

  static async getApprovalById(id: string): Promise<ApprovalResponse | null> {
    const approval = await prisma.approval.findUnique({
      where: { id },
      include: { forecast: true },
    });

    if (!approval) return null;

    return {
      id: approval.id,
      forecastId: approval.forecastId,
      actions: approval.actions as any[],
      status: approval.status,
      approvedBy: approval.approvedBy,
      approvedAt: approval.approvedAt?.toISOString() || null,
      createdAt: approval.createdAt.toISOString(),
    };
  }
}