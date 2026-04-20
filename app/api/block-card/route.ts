import { NextRequest, NextResponse } from 'next/server';

// In-memory card storage (replace with database in production)
let availableCards = new Set(
  Array.from({ length: 500 }, (_, i) => String(i + 1))
);

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Card ID is required.' },
        { status: 400 }
      );
    }

    const cardId = String(id).trim();
    const cardIdNum = parseInt(cardId);

    if (isNaN(cardIdNum) || cardIdNum < 1 || cardIdNum > 500) {
      return NextResponse.json(
        { success: false, error: 'Invalid Card ID (must be between 1 and 500)' },
        { status: 400 }
      );
    }

    if (availableCards.has(cardId)) {
      availableCards.delete(cardId);
      return NextResponse.json(
        {
          success: true,
          message: `Card ${cardId} has been blocked.`,
          remainingCards: availableCards.size,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Card ID not found or already blocked.' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'success',
    totalCards: 500,
    availableCards: availableCards.size,
    blockedCards: 500 - availableCards.size,
  });
}
