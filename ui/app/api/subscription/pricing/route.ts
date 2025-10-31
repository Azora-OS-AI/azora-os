/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// Import pricing config
const pricingConfigPath = path.join(process.cwd(), 'ui', 'lib', 'services', 'pricingConfig.js');
const pricingConfig = require(pricingConfigPath);

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      platformTiers: pricingConfig.platformTiers,
      services: pricingConfig.getAllServices(),
      message: 'Use /api/subscription/pricing/:service to get specific service pricing'
    });
  } catch (error) {
    console.error('Error getting pricing:', error);
    return NextResponse.json(
      { error: 'Failed to get pricing information' },
      { status: 500 }
    );
  }
}


