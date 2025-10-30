/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { NextRequest, NextResponse } from 'next/server'
import { elaraIntegration } from '@/genome/elara-integration'

/**
 * Elara Strategic Recommendation Route
 * 
 * POST /api/elara/recommend - Get strategic recommendations from Elara
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { decision, context = {} } = body

    if (!decision) {
      return NextResponse.json(
        { error: 'Decision required' },
        { status: 400 }
      )
    }

    const response = await elaraIntegration.getStrategicRecommendation(decision, context)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Elara Recommendation API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
