import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, page_path, metadata } = body;

    if (!event_type || !page_path) {
      return NextResponse.json(
        { error: 'event_type and page_path are required' },
        { status: 400 }
      );
    }

    // In production, this would store in Supabase
    // For now, just log and return success
    console.log('Analytics event:', { event_type, page_path, metadata });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
