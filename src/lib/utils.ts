import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// /utils/calculations.ts

import { SellTrade, ReinvestmentTrade, SummaryMetrics, ImportedTradeData } from '@/types';

export const calculateSummaryMetrics = (
	sellTrades: SellTrade[],
	reinvestmentTrades: ReinvestmentTrade[]
): SummaryMetrics => {
	const totalSatsSold = sellTrades.reduce((sum, trade) => sum + trade.satsSold, 0);
	const totalFiatGained = sellTrades.reduce((sum, trade) => sum + trade.usdReceived, 0);
	const totalPremiumProfit = sellTrades.reduce((sum, trade) => sum + trade.premiumGain, 0);
	const reinvestedFiat = reinvestmentTrades.reduce((sum, trade) => sum + trade.reinvestAmount, 0);
	const totalSatsReinvested = reinvestmentTrades.reduce((sum, trade) => sum + trade.satsBought, 0);

	// Calculate remaining fiat pool - this is the premium profit minus what's been reinvested
	const remainingFiatPool = totalPremiumProfit - reinvestedFiat;

	return {
		totalSatsSold,
		totalFiatGained,
		totalPremiumProfit,
		reinvestedFiat,
		remainingFiatPool,
		totalSatsReinvested,
	};
};

export const formatSats = (sats: number): string => {
	return sats.toLocaleString();
};

export const formatUSD = (amount: number): string => {
	return amount.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

export const formatPercentage = (decimal: number): string => {
	return (decimal * 100).toFixed(2) + '%';
};

export const calculatePremiumPercentage = (btcPrice: number, costBasis: number): number => {
	return (btcPrice - costBasis) / costBasis;
};

// /utils/importParser.ts

export const parseImportedTrade = (data: ImportedTradeData): Partial<SellTrade> | null => {
	try {
		// Determine if this is a sell trade
		let satsSold = 0;
		let usdReceived = 0;

		// Check if maker is seller
		if (data.maker && !data.maker.is_buyer) {
			satsSold = data.maker.sent_sats;
			usdReceived = data.maker.received_fiat;
		}
		// Check if taker is seller
		else if (data.taker && !data.taker.is_buyer) {
			satsSold = data.taker.sent_sats || 0;
			usdReceived = data.taker.received_fiat || 0;
		}
		// Not a sell trade
		else {
			return null;
		}

		// Extract date from timestamp
		const date = new Date(data.platform.contract_timestamp).toISOString().split('T')[0];

		// Use market price from the platform data
		const btcPrice = data.platform.contract_exchange_rate;

		// Assuming a default cost basis if not available - this needs user input
		const defaultCostBasis = btcPrice * 0.95; // Assuming 5% below market as example

		// Calculate premium gain based on assumed cost basis
		const premiumGain = usdReceived - (defaultCostBasis * satsSold / 100000000);

		return {
			date,
			satsSold,
			btcPrice,
			usdReceived,
			costBasis: defaultCostBasis,
			premiumGain,
			sentToFiatPool: premiumGain,
			notes: `Imported trade #${data.order_id} from ${data.coordinator}`,
		};
	} catch (error) {
		console.error('Error parsing imported trade:', error);
		return null;
	}
};