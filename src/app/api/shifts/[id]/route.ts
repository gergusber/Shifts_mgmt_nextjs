import { NextRequest, NextResponse } from 'next/server';
import { ShiftService } from '@/services/ShiftService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;

    const shift = await ShiftService.getShiftById(id, userId);

    if (!shift) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }

    const shiftWithAppliedFlag = {
      ...shift,
      userHasApplied:
        userId && shift.applications && shift.applications.length > 0,
    };

    return NextResponse.json(shiftWithAppliedFlag);
  } catch (error) {
    console.error('Error fetching shift:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shift' },
      { status: 500 }
    );
  }
}
