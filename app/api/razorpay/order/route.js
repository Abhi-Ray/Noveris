import { NextResponse } from 'next/server';

// Server-side price mapping to prevent client-side tampering
const priceMap = {
  '1 month': 199,
  '2 months': 499,
  '3 months': 999,
  '6 months': 1999,
};

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const duration = typeof body?.duration === 'string' ? body.duration : '';

    const amount = priceMap[duration];
    if (!amount) {
      return new NextResponse(JSON.stringify({ message: 'Invalid duration' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!keyId || !keySecret || !publicKeyId) {
      return new NextResponse(JSON.stringify({ message: 'Razorpay keys are not configured on the server' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const payload = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `vv_${Date.now()}`,
      payment_capture: 1,
      notes: { duration },
    };

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    // Add a timeout to protect server resources
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const resp = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return new NextResponse(
        JSON.stringify({ message: data?.error?.description || 'Failed to create Razorpay order' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        orderId: data.id,
        amount: data.amount,
        currency: data.currency,
        keyId: publicKeyId,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('Order creation error:', err);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
}
