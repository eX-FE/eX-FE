import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5050';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path ? `/${params.path.join('/')}` : '';
    
    // Extract authorization header
    const authorization = request.headers.get('authorization');
    
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    if (authorization) {
      headers.Authorization = authorization;
    }

    const response = await fetch(`${BACKEND_URL}/push${path}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Push notification proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path ? `/${params.path.join('/')}` : '';
    
    // Extract authorization header and body
    const authorization = request.headers.get('authorization');
    const body = await request.text();
    
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    if (authorization) {
      headers.Authorization = authorization;
    }

    const response = await fetch(`${BACKEND_URL}/push${path}`, {
      method: 'POST',
      headers,
      body,
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Push notification proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
