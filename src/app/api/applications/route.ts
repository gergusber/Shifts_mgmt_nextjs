import { NextRequest, NextResponse } from 'next/server';
import { ApplicationService } from '@/services/ApplicationService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const applications = await ApplicationService.getApplicationsByUserId(userId);
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch applications';
    const status = message === 'userId is required' ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const application = await ApplicationService.createApplication(body);
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    const message = error instanceof Error ? error.message : 'Failed to create application';

    // Map specific error messages to status codes
    // TODO: Lets remove this once we have a proper error handling system to get the status code from the error

    let status = 500;
    if (message === 'userId and shiftId are required') status = 400;
    else if (message === 'You have already applied to this shift') status = 400;
    else if (message === 'Shift not found') status = 404;
    else if (message === 'This shift is no longer accepting applications') status = 400;

    return NextResponse.json({ error: message }, { status });
  }
}
