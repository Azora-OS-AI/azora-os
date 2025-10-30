/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { NextRequest, NextResponse } from 'next/server'
import { elaraIntegration } from '@/genome/elara-integration'

/**
 * Elara AI API Route
 * 
 * POST /api/elara - Ask Elara AI a question
 * GET /api/elara/status - Get Elara AI status
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { input, context = {} } = body

    if (!input) {
      return NextResponse.json(
        { error: 'Input required' },
        { status: 400 }
      )
    }

    const response = await elaraIntegration.askElara(input, context)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Elara API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const status = elaraIntegration.getStatus()
    return NextResponse.json(status)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
