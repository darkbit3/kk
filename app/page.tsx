'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CashierPage() {
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [selectedBet, setSelectedBet] = useState<number | null>(10);
  const [percentage, setPercentage] = useState(20);
  const [showCounter, setShowCounter] = useState(false);

  const totalNumbers = 400;

  const handleNumberToggle = (num: number) => {
    const newSelected = new Set(selectedNumbers);
    if (newSelected.has(num)) {
      newSelected.delete(num);
    } else {
      newSelected.add(num);
    }
    setSelectedNumbers(newSelected);
  };

  const handleStartGame = async () => {
    try {
      const randomNumbers = Array.from({ length: selectedNumbers.size }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
      
      const gameData = {
        amount: selectedBet || 10,
        total: selectedNumbers.size,
        cards: Array.from(selectedNumbers).sort((a, b) => a - b),
        randomNumbers,
        percentage,
      };

      const response = await fetch('/api/start-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        console.log('[v0] Game started:', result);
        // Store game ID in localStorage for display page
        localStorage.setItem('currentGameId', String(result.gameId));
        localStorage.setItem('gamePayout', String(result.payout));
        localStorage.setItem('gameBalance', String(result.balance));
        window.location.href = '/display.html';
      } else {
        alert('Error starting game: ' + result.message);
      }
    } catch (error) {
      console.error('[v0] Error starting game:', error);
      alert('Error starting game. Please try again.');
    }
  };

  const increasePercentage = () => {
    setPercentage(Math.min(100, percentage + 5));
  };

  const decreasePercentage = () => {
    setPercentage(Math.max(0, percentage - 5));
  };

  const toggleEyeIcon = () => {
    setShowCounter(!showCounter);
  };

  const selectAll = () => {
    if (selectedNumbers.size === totalNumbers) {
      setSelectedNumbers(new Set());
    } else {
      setSelectedNumbers(new Set(Array.from({ length: totalNumbers }, (_, i) => i + 1)));
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }

        header {
          background-color: brown;
          color: white;
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        h1 {
          margin: 0;
          font-size: 24px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        nav {
          margin-left: 20px;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        nav a {
          color: white;
          text-decoration: none;
          margin-left: 0;
          font-size: 14px;
          padding: 8px 16px;
          border: 1px solid white;
          border-radius: 4px;
          background-color: transparent;
          transition: background-color 0.3s, color 0.3s;
          display: inline-block;
        }

        nav a:hover {
          text-decoration: none;
          background-color: white;
          color: brown;
        }

        .percentage-control {
          display: flex;
          gap: 15px;
          align-items: center;
          margin: 0 20px;
        }

        .percentage-control label {
          color: white;
          margin-right: 5px;
          font-size: 14px;
        }

        .percentage-control button {
          padding: 5px 10px;
          border: none;
          border-radius: 3px;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }

        .decrease-btn {
          background-color: #d9534f;
        }

        .increase-btn {
          background-color: #5cb85c;
        }

        .percentage-control input {
          width: 60px;
          padding: 5px;
          border-radius: 3px;
          border: 1px solid #ccc;
          text-align: center;
        }



        #eyeIcon {
          cursor: pointer;
          font-size: 1.5em;
          transition: transform 0.2s ease;
        }

        #eyeIcon:hover {
          transform: scale(1.2);
        }

        #userCounter {
          font-size: 2em;
          font-weight: bold;
          color: #007BFF;
        }

        .container {
          position: relative;
          width: 100%;
          max-width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: stretch;
          gap: 10px;
          padding: 15px;
          background-color: #fff;
          border-bottom: 1px solid #ddd;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          min-height: auto;
          box-sizing: border-box;
        }

        .box {
          flex: 1 1 auto;
          min-width: 150px;
          min-height: 150px;
          padding: 12px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;
        }

        .box.amount-box {
          flex: 1 1 auto;
          min-width: 200px;
        }

        .box.amount-box h2 {
          font-size: 14px;
          margin-bottom: 8px;
        }

        .box.amount-box .value {
          font-size: 24px;
        }

        .bet-buttons-row {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          justify-content: center;
          margin-top: 10px;
        }

        .box h2 {
          font-size: 18px;
          color: #333;
          margin-bottom: 10px;
        }

        .box .value {
          font-size: 40px;
          color: #000;
          font-weight: bold;
        }

        .warning {
          background-color: #e74c3c;
          color: white;
        }

        .warning .value {
          font-weight: bold;
          font-size: 22px;
        }

        .button-container {
          display: flex;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background-color: #f0f0f0;
          padding: 5px 8px;
          height: 42px;
          align-items: center;
          text-align: center;
        }

        .color-button {
          flex: 1 1 0;
          padding: 6px 14px;
          font-size: 14px;
          height: 32px;
          line-height: 32px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: white;
          min-width: 90px;
          box-sizing: border-box;
          text-align: center;
        }

        .black { background-color: black; }
        .blue { background-color: blue; }
        .green { background-color: green; }
        .yellow { background-color: yellow; color: black; }

        .number-button {
          padding: 6px 8px;
          font-size: 14px;
          border: 1px solid #007BFF;
          border-radius: 4px;
          background-color: black;
          color: white;
          font-weight: bold;
          transition: background-color 0.3s, transform 0.2s;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          cursor: pointer;
        }

        .number-button:hover {
          background-color: #007BFF;
          color: white;
          transform: scale(1.02);
        }

        .number-button.selected {
          background-color: white;
          color: black;
          border-color: #0056b3;
        }

        .button-1-400 {
          display: grid;
          grid-template-columns: repeat(20, 1fr);
          gap: 2px;
          margin: 20px auto;
          width: 95%;
          max-width: 1200px;
          padding: 7px;
          box-sizing: border-box;
          max-height: 600px;
          overflow-y: auto;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .start-game-button {
          padding: 12px 20px;
          font-size: 16px;
          border: 2px solid #007BFF;
          border-radius: 5px;
          background-color: #28a745;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
          margin: 10px 5px;
          display: inline-block;
        }

        .start-game-button:hover {
          background-color: #218838;
        }

        .common-button {
          padding: 12px 20px;
          font-size: 16px;
          border: 2px solid #007BFF;
          border-radius: 5px;
          background-color: gold;
          color: white;
          font-weight: bold;
          transition: background-color 0.3s;
          cursor: pointer;
          margin: 10px 5px;
        }

        .common-button:hover {
          background-color: #007BFF;
          color: white;
        }

        .bet-button {
          padding: 6px 12px;
          margin: 3px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f0f0f0;
          cursor: pointer;
          transition: transform 0.2s;
          font-size: 12px;
          font-weight: bold;
        }

        .bet-button.selected {
          background-color: gold;
          color: white;
          transform: scale(1.05);
        }

        .section {
          margin: 20px;
          text-align: center;
        }

        .section h3 {
          color: #333;
          margin-bottom: 15px;
          font-size: 18px;
        }

        .action-buttons {
          padding: 20px;
          text-align: center;
          margin-bottom: 120px;
        }
      `}</style>

      <header>
        <h1>Arada bingo</h1>
        <div className="user-info">
          <span
            id="userCounter"
            style={{ display: showCounter ? 'inline-block' : 'none' }}
          >
            {selectedNumbers.size}
          </span>
          <span
            id="eyeIcon"
            onClick={toggleEyeIcon}
          >
            👁️
          </span>
          <nav>
            <Link href="/report.html">Report</Link>
            <Link href="/account.html">Account</Link>
          </nav>
        </div>
      </header>

      {/* Color Selection Container */}
      <div className="button-container">
        <button className="color-button black">Black</button>
        <button className="color-button blue">Blue</button>
        <button className="color-button green">Green</button>
        <button className="color-button yellow">Yellow</button>
      </div>

      {/* Amount, Game ID, and Wallet Warning Container */}
      <div className="container">
        <div className="box amount-box">
          <div>
            <h2>Select Bet Amount:</h2>
            <div className="bet-buttons-row">
              {[10, 20, 25, 50, 75, 100].map((amount) => (
                <button
                  key={amount}
                  className={`bet-button ${selectedBet === amount ? 'selected' : ''}`}
                  onClick={() => setSelectedBet(amount)}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>
          <div className="value" style={{ marginTop: '10px' }}>Amount: ${selectedBet || 'Select'}</div>
        </div>
        <div className="box">
          <h2>Game ID</h2>
          <div className="value">G-001</div>
        </div>
        <div className={`box ${selectedBet === null ? 'warning' : ''}`}>
          <h2>Wallet</h2>
          <div className="value" style={{ fontSize: '18px' }}>
            {selectedBet === null ? '⚠️ Warning' : '✓ Ready'}
          </div>
        </div>
      </div>

      {/* Number Selection Grid */}
      <div className="section">
        <h3>Select Numbers (1-400):</h3>
        <div className="button-1-400">
          {Array.from({ length: totalNumbers }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`number-button ${selectedNumbers.has(num) ? 'selected' : ''}`}
              onClick={() => handleNumberToggle(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="start-game-button"
          onClick={handleStartGame}
        >
          Start Game
        </button>
        <button
          className="common-button"
          onClick={selectAll}
        >
          {selectedNumbers.size === totalNumbers ? 'Deselect All' : 'Select All'}
        </button>
        <button
          className="common-button"
          onClick={() => setSelectedNumbers(new Set())}
        >
          Clear
        </button>
      </div>
    </>
  );
}
