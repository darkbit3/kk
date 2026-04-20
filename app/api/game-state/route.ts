import { NextRequest, NextResponse } from 'next/server';

// In-memory game state storage
const gameStateStorage = {
  currentGameId: 0,
  games: [] as any[],
  totalPayout: 0,
  totalBalance: 0,
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const gameId = searchParams.get('gameId');

    if (gameId) {
      const game = gameStateStorage.games.find(
        (g) => g.id === parseInt(gameId)
      );
      if (game) {
        return NextResponse.json(
          { status: 'success', game },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { status: 'error', message: 'Game not found.' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        status: 'success',
        currentGameId: gameStateStorage.currentGameId,
        totalGames: gameStateStorage.games.length,
        totalPayout: gameStateStorage.totalPayout,
        totalBalance: gameStateStorage.totalBalance,
        recentGames: gameStateStorage.games.slice(-10),
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newGame = {
      id: gameStateStorage.currentGameId + 1,
      ...data,
      timestamp: new Date().toISOString(),
    };

    gameStateStorage.games.push(newGame);
    gameStateStorage.currentGameId = newGame.id;

    if (data.payout) {
      gameStateStorage.totalPayout += data.payout;
    }
    if (data.balance) {
      gameStateStorage.totalBalance += data.balance;
    }

    return NextResponse.json(
      {
        status: 'success',
        gameId: newGame.id,
        message: 'Game state saved successfully.',
      },
      { status: 201 }
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
