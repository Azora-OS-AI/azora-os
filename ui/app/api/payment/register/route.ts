/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

/**
 * POST /api/payment/register
 * Student registration with payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, paymentProof, amount } = body

    // Validate input
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create student account
    const { data: student, error: studentError } = await supabase
      .from('users')
      .insert([
        {
          email,
          user_type: 'student',
          metadata: {
            name,
            phone,
            payment_amount: amount || 500,
            payment_status: 'pending',
            payment_proof: paymentProof,
            registration_date: new Date().toISOString(),
            access_expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months
            azr_balance: 0,
            total_earned: 0
          }
        }
      ])
      .select()
      .single()

    if (studentError) {
      console.error('Student creation error:', studentError)
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    }

    // Send welcome email (placeholder)
    console.log(`Welcome email sent to ${email}`)

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name,
        email,
        accessExpires: student.metadata.access_expires
      },
      message: 'Registration successful! Check your email for login details.'
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
