import { NextRequest, NextResponse } from 'next/server';
import { ApplicationService } from '@/services/ApplicationService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 }
      );
    }

    const updatedApplication = await ApplicationService.updateApplication({
      id,
      status,
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    const message = error instanceof Error ? error.message : 'Failed to update application';
    const status =
      message === 'id and status are required' ? 400 :
      message === 'Application not found' ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ApplicationService.deleteApplication(id);
    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
        // TODO: Lets remove this once we have a proper error handling system to get the status code from the error

    const message = error instanceof Error ? error.message : 'Failed to delete application';
    const status =
      message === 'id is required' ? 400 :
      message === 'Application not found' ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
