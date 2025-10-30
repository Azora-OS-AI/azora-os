/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import { NextRequest, NextResponse } from 'next/server'
import { elaraIntegration } from '@/genome/elara-integration'

/**
 * Elara Educational AI Route
 * 
 * POST /api/elara/education - Get educational help from Elara
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, context = {} } = body

    if (!question) {
      return NextResponse.json(
        { error: 'Question required' },
        { status: 400 }
      )
    }

    const response = await elaraIntegration.getEducationalHelp(question, context)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Elara Education API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
