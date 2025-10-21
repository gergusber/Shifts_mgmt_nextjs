import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        shift: true,
      },
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
