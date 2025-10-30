/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { NextRequest, NextResponse } from 'next/server'
import { elaraIntegration } from '@/genome/elara-integration'

/**
 * Elara Constitutional Compliance Route
 * 
 * POST /api/elara/compliance - Validate Constitutional compliance
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, context = {} } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      )
    }

    const response = await elaraIntegration.validateConstitutionalCompliance(action, context)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Elara Compliance API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
