/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    const countryCode = params.country;
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier') || 'starter';
    const isStudent = searchParams.get('isStudent') === 'true';
    const servicesParam = searchParams.get('services');
    const services = servicesParam ? JSON.parse(servicesParam) : {};

    // Forward to subscription service
    const subscriptionServiceUrl = process.env.SUBSCRIPTION_SERVICE_URL || 'http://localhost:4129';
    const response = await fetch(
      `${subscriptionServiceUrl}/api/subscription/pricing/country/${countryCode}?tier=${tier}&isStudent=${isStudent}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting country pricing:', error);
    return NextResponse.json(
      { error: 'Failed to get country pricing' },
      { status: 500 }
    );
  }
}


