import { NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/db-utils'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await dbHelpers.findUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save OTP to database
    await dbHelpers.createOTP(email, otpCode, expiresAt)

    // Send OTP email
    const transporter = createTransporter()
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
      to: email,
      subject: 'Your Login Code',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Noveris</h1>
          <p style="color: #ccc; font-size: 14px; margin: 5px 0 0;">Secure Login Verification</p>
        </div>
        
        <!-- OTP Section -->
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Your one-time password (OTP) for <strong>Noveris</strong> is:
          </p>
          <div style="font-size: 48px; font-weight: bold; color: #007bff; background: white; padding: 20px; border-radius: 8px; border: 2px dashed #007bff; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
        
        <!-- Security Notice -->
        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>Security Notice:</strong> If you didn't request this code, please ignore this email and consider changing your password.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 25px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Noveris. All rights reserved.</p>
          <p style="margin: 2px 0;">Delivering AI tools, Automation, and Agentic solutions for the future.</p>
          <a href="https://noveris.vectriumventures.in" style="color: #007bff; text-decoration: none;">Visit our website</a>
        </div>
        
      </div>
    `
    })

    return NextResponse.json({ 
      message: 'OTP sent successfully',
      email: email
    })

  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}