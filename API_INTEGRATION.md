# Backend API Integration Documentation

## Overview
The frontend is now fully integrated with Next.js API routes that handle game logic, card management, and game state tracking.

## API Endpoints

### 1. Start Game
**Endpoint:** `POST /api/start-game`

**Request Body:**
```json
{
  "amount": 10,
  "total": 50,
  "cards": [1, 2, 3, ...],
  "randomNumbers": [1, 5, 10, ...],
  "percentage": 20
}
```

**Response:**
```json
{
  "status": "success",
  "gameId": 1,
  "payout": 5000,
  "balance": 20000,
  "message": "Game started successfully"
}
```

**Description:** Starts a new game with the specified amount, card selections, and percentage. Returns game ID, calculated payout, and balance.

---

### 2. Fetch Card
**Endpoint:** `POST /api/fetch-card`

**Request Body:**
```json
{
  "cardId": "123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "ካርቴላዉ ተመዝግቧል."
}
```

**Description:** Validates if a card ID is registered in the system. Returns success message in Amharic if card is found.

---

### 3. Block Card
**Endpoint:** `POST /api/block-card`

**Request Body:**
```json
{
  "id": "123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Card 123 has been blocked.",
  "remainingCards": 499
}
```

**Description:** Blocks/removes a card ID from available cards. Card ID must be between 1 and 500.

---

### 4. Get Game State
**Endpoint:** `GET /api/game-state`

**Query Parameters:**
- `gameId` (optional): Fetch specific game data

**Response (All Games):**
```json
{
  "status": "success",
  "currentGameId": 5,
  "totalGames": 5,
  "totalPayout": 25000,
  "totalBalance": 100000,
  "recentGames": [...]
}
```

**Response (Specific Game):**
```json
{
  "status": "success",
  "game": {
    "id": 1,
    "amount": 10,
    "total": 50,
    "payout": 5000,
    "timestamp": "2024-04-20T10:30:00Z"
  }
}
```

**Description:** Retrieves game state information. Can fetch all games or a specific game by ID.

---

## Frontend Integration Points

### 1. Cashier Page (`/` and `/cashier.html`)
- **Action:** User selects numbers, amount, and sets percentage
- **API Call:** `POST /api/start-game` when "Play" button is clicked
- **Data Passed:** Selected numbers, amount, percentage
- **Data Received:** Game ID, payout, balance

### 2. Report Page (`/report.html`)
- **Data Source:** Game state from `/api/game-state`
- **Displays:** Total payout, total balance, game statistics
- **Functionality:** Real-time updates of game metrics

### 3. Account Page (`/account.html`)
- **Data Source:** Game state and player information
- **Displays:** Account info, game history, settings
- **Functionality:** User account management

---

## Data Flow

```
User Input (Cashier)
    ↓
handleStartGame() function
    ↓
POST /api/start-game
    ↓
Backend calculates payout & balance
    ↓
Response with gameId, payout, balance
    ↓
Store in localStorage
    ↓
Redirect to /display.html
    ↓
Display page reads from localStorage
```

---

## Error Handling

All endpoints return standard error responses:

```json
{
  "status": "error",
  "message": "Description of error"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad request (invalid data)
- `404` - Not found
- `500` - Server error

---

## Key Functions

### calculatePayout(amount, total, percentage)
Calculates the payout using: `(amount × total × percentage) / 100`

### calculateBalance(amount, total, percentage)
Calculates the balance using: `(amount × total × (100 - percentage)) / 100`

---

## Database Integration (Future)

To connect to a real database (Supabase, PostgreSQL, etc.):

1. Replace in-memory storage in each route with database queries
2. Update game state storage from object to database table
3. Implement RLS (Row Level Security) for Supabase
4. Add proper indexing for performance

Example for Supabase integration:
```typescript
// In /api/start-game/route.ts
const { data, error } = await supabase
  .from('games')
  .insert([gameData])
  .select();
```

---

## Testing the API

### Using cURL:
```bash
curl -X POST http://localhost:3000/api/start-game \
  -H "Content-Type: application/json" \
  -d '{"amount":10,"total":50,"cards":[1,2,3],"randomNumbers":[1,5,10],"percentage":20}'
```

### Using JavaScript:
```javascript
const response = await fetch('/api/start-game', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 10,
    total: 50,
    cards: [1, 2, 3],
    randomNumbers: [1, 5, 10],
    percentage: 20
  })
});
const data = await response.json();
console.log(data);
```

---

## Status: ✅ FULLY INTEGRATED

All backend APIs are integrated with the frontend. The system is ready for:
- Game start and tracking
- Card validation and blocking
- Game state management
- Payout and balance calculations
- Real-time data synchronization
