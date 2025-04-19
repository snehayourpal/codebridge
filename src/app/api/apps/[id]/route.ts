import { NextResponse } from 'next/server';
import { appStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('GET request for app:', id);

    const app = appStore.find(app => app.id === id);
    
    if (!app) {
      console.log('App not found:', id);
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(app);
  } catch (error) {
    console.error('Error fetching app:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string | Promise<string> } }
) {
  try {
    const id = await Promise.resolve(params.id);
    const body = await request.json();
    
    console.log('PUT request for app:', id);
    console.log('Update data:', body);

    const appIndex = appStore.findIndex(app => app.id === id);
    
    if (appIndex === -1) {
      console.log('App not found:', id);
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }

    // Update the app
    appStore[appIndex] = {
      ...appStore[appIndex],
      ...body
    };

    return NextResponse.json(appStore[appIndex]);
  } catch (error) {
    console.error('Error updating app:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
