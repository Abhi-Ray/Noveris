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

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save reset token to database
    await dbHelpers.createPasswordResetToken(email, resetToken, expiresAt)

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

    // Send reset email
    const transporter = createTransporter()
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
      to: email,
      subject: 'Password Reset Request - Noveris',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Noveris</h1>
          
          </div>
          
          <!-- Main Content -->
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">You requested a password reset for your <strong>Noveris</strong> account.</p>
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #007bff; font-size: 14px; word-break: break-all;">${resetUrl}</p>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">This link will expire in 1 hour.</p>
          </div>
          
          <!-- Security Notice -->
          <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.
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
      message: 'Password reset email sent successfully',
      email: email
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to send password reset email. Please try again.' },
      { status: 500 }
    )
  }
}
