import { NextRequest, NextResponse } from 'next/server';
import { ShiftService } from '@/services/ShiftService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;
    const status = searchParams.get('status') || undefined;

    const shifts = await ShiftService.getShifts({ userId, status });
    return NextResponse.json(shifts);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shifts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const shift = await ShiftService.createShift(body);
    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error('Error creating shift:', error);
    const message = error instanceof Error ? error.message : 'Failed to create shift';
    const status = message === 'Missing required fields' ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
