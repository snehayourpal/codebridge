import { NextResponse } from 'next/server';
import { appStore } from '@/lib/store';

export async function GET() {
  return NextResponse.json(appStore);
}

export async function POST(request: Request) {
  try {
    const app = await request.json();
    appStore.push(app);
    return NextResponse.json(app);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create app' },
      { status: 500 }
    );
  }
} 