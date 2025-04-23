# Bitcoin Premium Trading Tracker

A Next.js application to track Bitcoin trades, with a focus on harvesting premium gains and strategic reinvestment.

## Features

-   Track sell trades with premium calculation
-   Record reinvestments separately
-   Import trade data from JSON files
-   Summary metrics calculation
-   Persistent data storage using localStorage

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1. Clone the repository or create a new Next.js project:

```bash
npx create-next-app bitcoin-tracker --typescript
cd bitcoin-tracker
```

2. Install dependencies:

```bash
npm install zustand
# or
yarn add zustand
```

3. Copy the provided files into your project structure.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Sell Trades

1. Click "Add Sell Trade"
2. Fill in the trade details:
    - Date
    - Sats Sold
    - BTC Price (USD)
    - USD Received
    - Cost Basis (USD)
    - Notes
3. The Premium Gain will be calculated automatically

### Adding Reinvestment Trades

1. Click "Add Reinvestment"
2. Fill in the reinvestment details:
    - Date
    - Reinvest Amount (USD)
    - BTC Price (USD)
    - Select whether it's from the profit pool
    - Notes
3. The Sats Bought will be calculated automatically

### Importing JSON

1. Click "Import JSON"
2. Upload a JSON file or paste JSON content in the format:

```json
{
    "coordinator": "Temple of Sats",
    "order_id": 43397,
    "currency": "USD",
    "maker": {
        "trade_fee_percent": 0.00025,
        "bond_size_sats": 9837,
        "bond_size_percent": 3,
        "is_buyer": false,
        "sent_sats": 324608,
        "received_fiat": 300,
        "trade_fee_sats": 81
    },
    "taker": {
        "trade_fee_percent": 0.00175,
        "bond_size_sats": 9735,
        "bond_size_percent": 3,
        "is_buyer": true,
        "sent_fiat": 300,
        "received_sats": 323635,
        "payment_hash": "619c256dd35911f54dbfdd1d76c9c2274a615c4e4dc8b54f1d7914c3a03a0db4",
        "preimage": "d4fbfe6d9f223672fd6fd4ebbc9d3e10a1f42a723854800851fa7a79c97fa48d",
        "trade_fee_sats": 568
    },
    "platform": {
        "contract_exchange_rate": 92442.23130895117,
        "contract_timestamp": "2025-04-22T03:22:37.162202Z",
        "contract_total_time": 688.665397,
        "routing_budget_sats": 323.959,
        "trade_revenue_sats": 973
    }
}
```

### Viewing Summary Statistics

The summary section displays:

-   Total Sats Sold
-   Total Fiat Gained
-   Total Premium Profit
-   Reinvested Fiat
-   Remaining Fiat Pool
-   Total Sats Reinvested
-   Net Sats Position

## Project Structure

```
/app
  /components
    /trades
      SellTradeTable.tsx       // For displaying sell trades
      ReinvestmentTable.tsx    // For displaying reinvestment trades
      SummarySection.tsx       // For displaying summary metrics
      ImportJsonModal.tsx      // For importing JSON data
  /store
    useTradeStore.ts           // Zustand store
  /types
    index.ts                   // TypeScript interfaces
  /utils
    calculations.ts            // Helper functions for calculations
    importParser.ts            // Functions to parse imported JSON
  page.tsx                     // Main page
  layout.tsx                   // App layout
  globals.css                  // Global styles
```

## Data Model

### Sell Trade

-   Date
-   Sats Sold
-   BTC Price (USD)
-   USD Received
-   Cost Basis (USD)
-   Premium Gain (USD)
-   Sent to Fiat Pool (USD)
-   Notes

### Reinvestment Trade

-   Date
-   Reinvest Amount (USD)
-   BTC Price (USD)
-   Sats Bought
-   From Profit Pool? (Yes/No)
-   Remaining Profit (USD)
-   Notes

## License

MIT
