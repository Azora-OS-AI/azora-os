/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class AuditService {
  static async log(eventType: string, details: any, userId?: string) {
    await prisma.auditLog.create({
      data: {
        eventType: eventType,
        details,
        userId,
      },
    });
  }
}

export class ABTestService {
  static async assignVariant(userId: string): Promise<string> {
    let abTest = await prisma.aBTest.findFirst({ where: { userId } });
    if (!abTest) {
      const variant = Math.random() > 0.5 ? "A" : "B";
      abTest = await prisma.aBTest.create({
        data: { userId, variant },
      });
      await AuditService.log('ASSIGN_VARIANT', { userId, variant }, userId);
    }
    return abTest.variant;
  }

  static async recordResult(userId: string, result: string, metadata?: any) {
    const abTest = await prisma.aBTest.findFirst({ where: { userId } });
    if (abTest) {
      await prisma.aBTest.update({
        where: { id: abTest.id },
        data: { result, metadata },
      });
      await AuditService.log('RECORD_RESULT', { userId, result, metadata }, userId);
    }
  }
}
