import { NextResponse } from 'next/server';
import { appStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    console.log('Fetching app with ID:', id);
    
    const app = appStore.find(app => app.id === id);
    
    if (!app) {
      console.log('App not found');
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }

    console.log('Found app:', app);
    return NextResponse.json(app);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 