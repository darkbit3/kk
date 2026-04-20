import { NextRequest, NextResponse } from 'next/server';

// Store data in memory (for demo purposes)
// In production, use a database like Supabase, PostgreSQL, or MongoDB
const gameState = {
  gameId: 0,
  amount: 10,
  total: 0,
  cards: [] as number[],
  randomNumbers: [] as number[],
  payout: 0,
  balance: 0,
  percentage: 20,
  lastUpdated: new Date(),
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate incoming data
    const requiredKeys = ['amount', 'total', 'cards', 'randomNumbers'];
    if (!data || !requiredKeys.every((key) => key in data)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid data.' },
        { status: 400 }
      );
    }

    // Update game state
    gameState.amount = data.amount;
    gameState.total = data.total;
    gameState.cards = data.cards;
    gameState.randomNumbers = data.randomNumbers;
    gameState.percentage = data.percentage || 20;
    gameState.lastUpdated = new Date();

    // Increment game ID
    gameState.gameId += 1;

    // Calculate payout and balance
    const payout = calculatePayout(data.amount, data.total, gameState.percentage);
    const balance = calculateBalance(data.amount, data.total, gameState.percentage);

    gameState.payout = payout;
    gameState.balance = balance;

    return NextResponse.json(
      {
        status: 'success',
        gameId: gameState.gameId,
        payout,
        balance,
        message: 'Game started successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}

function calculatePayout(
  amount: number,
  total: number,
  percentage: number
): number {
  return (amount * total * percentage) / 100;
}

function calculateBalance(
  amount: number,
  total: number,
  percentage: number
): number {
  return (amount * total * (100 - percentage)) / 100;
}

export async function GET() {
  return NextResponse.json({
    status: 'success',
    gameState,
  });
}
