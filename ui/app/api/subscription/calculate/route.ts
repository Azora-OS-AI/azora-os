/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const subscriptionServicePath = path.join(process.cwd(), 'ui', 'lib', 'services', 'subscription.js');
// Note: This is a proxy to the subscription service
// In production, you might want to import the functions directly

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward to subscription service
    const subscriptionServiceUrl = process.env.SUBSCRIPTION_SERVICE_URL || 'http://localhost:4129';
    const response = await fetch(`${subscriptionServiceUrl}/api/subscription/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calculating pricing:', error);
    return NextResponse.json(
      { error: 'Failed to calculate pricing' },
      { status: 500 }
    );
  }
}


