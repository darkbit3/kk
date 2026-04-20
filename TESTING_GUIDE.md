# Integration Testing Guide

## Manual Testing Procedures

### Test 1: Game Start Flow
**Objective**: Verify that starting a game triggers API call and returns correct data

**Steps**:
1. Open the cashier page (`/`)
2. Select numbers from the 1-400 grid (or click "1-400" button to select all)
3. Confirm amount is set to 10 (default)
4. Set percentage to desired value (e.g., 20)
5. Click "Play" button
6. **Expected**: 
   - API call is made to `/api/start-game`
   - Game ID increments
   - Payout and balance are calculated correctly
   - Page redirects to `/display.html`
   - Data is stored in localStorage

**Verification**:
```javascript
// Open browser console and check:
localStorage.getItem('currentGameId')      // Should return game ID
localStorage.getItem('gamePayout')          // Should return payout value
localStorage.getItem('gameBalance')         // Should return balance value
```

---

### Test 2: Calculate Payout
**Objective**: Verify payout calculation formula

**Test Case 1**:
- Amount: 10
- Total Numbers: 50
- Percentage: 20
- Expected Payout: (10 × 50 × 20) / 100 = **100**

**Test Case 2**:
- Amount: 10
- Total Numbers: 100
- Percentage: 50
- Expected Payout: (10 × 100 × 50) / 100 = **500**

**Test Case 3**:
- Amount: 10
- Total Numbers: 400
- Percentage: 100
- Expected Payout: (10 × 400 × 100) / 100 = **4,000**

**Verification**:
1. Make the selections above
2. Click "Play"
3. Check localStorage or API response
4. Verify the payout matches the calculation

---

### Test 3: Calculate Balance
**Objective**: Verify balance calculation formula

**Test Case 1**:
- Amount: 10
- Total Numbers: 50
- Percentage: 20
- Expected Balance: (10 × 50 × 80) / 100 = **400**

**Test Case 2**:
- Amount: 10
- Total Numbers: 100
- Percentage: 50
- Expected Balance: (10 × 100 × 50) / 100 = **500**

**Test Case 3**:
- Amount: 10
- Total Numbers: 400
- Percentage: 0
- Expected Balance: (10 × 400 × 100) / 100 = **4,000**

**Verification**:
1. Make the selections above
2. Click "Play"
3. Verify balance = (amount × total × (100 - percentage)) / 100

---

### Test 4: API Response Format
**Objective**: Verify API returns correct JSON structure

**Making Request**:
```javascript
const response = await fetch('/api/start-game', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 10,
    total: 50,
    cards: [1, 2, 3, 4, 5],
    randomNumbers: [1, 10, 20, 30, 40],
    percentage: 20
  })
});
const data = await response.json();
console.log(data);
```

**Expected Response**:
```json
{
  "status": "success",
  "gameId": 1,
  "payout": 100,
  "balance": 400,
  "message": "Game started successfully"
}
```

---

### Test 5: Card Validation
**Objective**: Test fetch-card API

**Making Request**:
```javascript
const response = await fetch('/api/fetch-card', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cardId: '123' })
});
const data = await response.json();
console.log(data);
```

**Test Cases**:
1. **Valid Card**: Card '123'
   - Expected: `{ success: false, message: "ካርቴላዉ አልተመዘገበም." }`
   
2. **Empty ID**: ''
   - Expected: `{ success: false, message: "Card ID is required." }`

---

### Test 6: Block Card
**Objective**: Test block-card API

**Making Request**:
```javascript
const response = await fetch('/api/block-card', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: '123' })
});
const data = await response.json();
console.log(data);
```

**Test Cases**:
1. **Valid Block**: Card ID '123'
   - Expected: `{ success: true, message: "Card 123 has been blocked.", remainingCards: 499 }`

2. **Invalid ID**: ID '999' (out of range)
   - Expected: `{ success: false, error: "Invalid Card ID (must be between 1 and 500)" }`

3. **Already Blocked**: Block same card twice
   - Expected: `{ success: false, error: "Card ID not found or already blocked." }`

---

### Test 7: Game State Retrieval
**Objective**: Test game-state API

**Get All Games**:
```javascript
const response = await fetch('/api/game-state');
const data = await response.json();
console.log(data);
```

**Expected Response**:
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

**Get Specific Game**:
```javascript
const response = await fetch('/api/game-state?gameId=1');
const data = await response.json();
console.log(data);
```

---

### Test 8: UI Responsiveness
**Objective**: Verify UI works on different screen sizes

**Desktop (1920x1080)**:
- All elements properly spaced
- Text is readable
- Buttons are clickable
- Grid displays correctly

**Tablet (768x1024)**:
- Layout adapts to width
- Touch-friendly button sizes
- Text remains readable
- No overflow issues

**Mobile (375x667)**:
- Single column layout
- Large touch targets
- Text scales appropriately
- Navigation buttons accessible

---

### Test 9: Navigation
**Objective**: Test navigation between pages

1. **From Cashier to Display**:
   - Click "Play" → Should redirect to `/display.html`
   - Data should be available in localStorage

2. **Header Navigation**:
   - Click "Report" button → Should go to `/report.html`
   - Click "Account" button → Should go to `/account.html`
   - Both pages should have "Back" or navigation to return

---

### Test 10: Error Handling
**Objective**: Verify error messages display correctly

**Test Invalid Request**:
```javascript
const response = await fetch('/api/start-game', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // Missing required fields
    amount: 10
  })
});
const data = await response.json();
```

**Expected**:
- HTTP 400 status
- Error message: `{ status: "error", message: "Invalid data." }`
- User sees alert: "Error starting game: Invalid data."

---

## Automated Testing (Optional)

### Using Browser DevTools Console

**Test Game Start**:
```javascript
async function testGameStart() {
  const response = await fetch('/api/start-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 10,
      total: 50,
      cards: [1, 2, 3, 4, 5],
      randomNumbers: [1, 10, 20, 30, 40],
      percentage: 20
    })
  });
  const data = await response.json();
  
  if (data.status === 'success' && 
      data.payout === 100 &&
      data.balance === 400) {
    console.log('✅ Game Start Test PASSED');
  } else {
    console.log('❌ Game Start Test FAILED');
  }
  
  return data;
}

testGameStart();
```

**Test Calculations**:
```javascript
function testCalculations() {
  const testCases = [
    { amount: 10, total: 50, pct: 20, expectedPayout: 100, expectedBalance: 400 },
    { amount: 10, total: 100, pct: 50, expectedPayout: 500, expectedBalance: 500 },
    { amount: 10, total: 400, pct: 100, expectedPayout: 4000, expectedBalance: 0 }
  ];
  
  testCases.forEach((tc, idx) => {
    const payout = (tc.amount * tc.total * tc.pct) / 100;
    const balance = (tc.amount * tc.total * (100 - tc.pct)) / 100;
    
    if (payout === tc.expectedPayout && balance === tc.expectedBalance) {
      console.log(`✅ Test Case ${idx + 1} PASSED`);
    } else {
      console.log(`❌ Test Case ${idx + 1} FAILED`);
      console.log(`  Expected: payout=${tc.expectedPayout}, balance=${tc.expectedBalance}`);
      console.log(`  Got: payout=${payout}, balance=${balance}`);
    }
  });
}

testCalculations();
```

---

## Performance Testing

### API Response Time
```javascript
async function testAPIPerformance() {
  const startTime = performance.now();
  
  const response = await fetch('/api/start-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 10,
      total: 50,
      cards: [1, 2, 3, 4, 5],
      randomNumbers: [1, 10, 20, 30, 40],
      percentage: 20
    })
  });
  
  const endTime = performance.now();
  const responseTime = endTime - startTime;
  
  console.log(`API Response Time: ${responseTime.toFixed(2)}ms`);
  
  if (responseTime < 100) {
    console.log('✅ Response time is excellent');
  } else if (responseTime < 500) {
    console.log('⚠️ Response time is acceptable');
  } else {
    console.log('❌ Response time needs optimization');
  }
}

testAPIPerformance();
```

---

## Integration Checklist

- [ ] Game start flow works end-to-end
- [ ] Payout calculation is correct
- [ ] Balance calculation is correct
- [ ] Game ID increments properly
- [ ] Data persists in localStorage
- [ ] Card validation works
- [ ] Card blocking works
- [ ] Game state retrieval works
- [ ] UI is responsive on all devices
- [ ] Navigation between pages works
- [ ] Error messages display correctly
- [ ] API response times are acceptable
- [ ] All required fields are validated

---

## Troubleshooting

### Problem: API returns 400 Bad Request
**Solution**: Check that all required fields are included:
- `amount` (number)
- `total` (number)
- `cards` (array)
- `randomNumbers` (array)
- `percentage` (number)

### Problem: Game data not in localStorage
**Solution**: 
1. Check browser console for errors
2. Verify API response was successful
3. Check if `handleStartGame` function is being called

### Problem: Calculations are wrong
**Solution**:
1. Verify the formula: Payout = (amount × total × percentage) / 100
2. Check percentage value (should be 0-100)
3. Ensure all inputs are numbers, not strings

### Problem: Pages not loading correctly
**Solution**:
1. Check if files exist in `/public` directory
2. Verify file paths in navigation links
3. Check browser console for 404 errors

---

## Success Criteria

✅ All APIs respond with correct HTTP status codes
✅ All calculations match expected values
✅ Game data persists and can be retrieved
✅ UI displays correctly on all devices
✅ Navigation works between all pages
✅ Error handling provides clear user feedback
✅ API response times are under 500ms
✅ No console errors or warnings
