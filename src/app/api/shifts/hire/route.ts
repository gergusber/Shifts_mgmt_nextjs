import { NextRequest, NextResponse } from 'next/server';
import { ShiftService } from '@/services/ShiftService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await ShiftService.hireProvider(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error hiring provider:', error);
    const message = error instanceof Error ? error.message : 'Failed to hire provider';

    // Map specific error messages to status codes 
    // TODO: Lets remove this once we have a proper error handling system to get the status code from the error
    let status = 500;
    if (message === 'applicationId and shiftId are required') status = 400;
    else if (message === 'Application not found') status = 404;
    else if (message === 'Application does not belong to this shift') status = 400;
    else if (message === 'Shift is already filled') status = 400;

    return NextResponse.json({ error: message }, { status });
  }
}
