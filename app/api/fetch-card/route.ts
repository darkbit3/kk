import { NextRequest, NextResponse } from 'next/server';

// In-memory card storage (replace with database in production)
let registeredCards = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { cardId } = await request.json();

    if (!cardId) {
      return NextResponse.json(
        { success: false, message: 'Card ID is required.' },
        { status: 400 }
      );
    }

    const cleanCardId = String(cardId).trim();

    if (registeredCards.has(cleanCardId)) {
      return NextResponse.json(
        { success: true, message: 'ካርቴላዉ ተመዝግቧል.' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'ካርቴላዉ አልተመዘገበም.' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'success',
    registeredCards: Array.from(registeredCards),
  });
}
