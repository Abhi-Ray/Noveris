import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = typeof body?.orderId === 'string' ? body.orderId : '';
    const paymentId = typeof body?.paymentId === 'string' ? body.paymentId : '';
    const signature = typeof body?.signature === 'string' ? body.signature : '';

    if (!orderId || !paymentId || !signature) {
      return new NextResponse(JSON.stringify({ message: 'Missing payment verification data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return new NextResponse(JSON.stringify({ message: 'Razorpay secret not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const bodyToSign = `${orderId}|${paymentId}`;
    const expectedSignatureHex = crypto
      .createHmac('sha256', keySecret)
      .update(bodyToSign)
      .digest('hex');

    // timing-safe compare
    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedSignatureHex, 'hex');

    const verified = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);

    if (!verified) {
      return new NextResponse(
        JSON.stringify({ verified: false, message: 'Signature verification failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
      );
    }

    return new NextResponse(JSON.stringify({ verified: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('Verification error:', err);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
}
