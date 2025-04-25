// /types/index.ts

export interface SellTrade {
	id: string;
	date: string;
	satsSold: number;
	btcPrice: number;
	usdReceived: number;
	costBasis: number;
	premiumGain: number;
	sentToFiatPool: number;
	notes: string;
}

export interface ReinvestmentTrade {
	id: string;
	date: string;
	reinvestAmount: number;
	btcPrice: number;
	satsBought: number;
	fromProfitPool: boolean;
	remainingProfit: number;
	notes: string;
}

export interface SummaryMetrics {
	totalSatsSold: number;
	totalFiatGained: number;
	totalPremiumProfit: number;
	reinvestedFiat: number;
	remainingFiatPool: number;
	totalSatsReinvested: number;
}

export interface ImportedTradeData {
	coordinator: string;
	order_id: number;
	currency: string;
	maker: {
		trade_fee_percent: number;
		bond_size_sats: number;
		bond_size_percent: number;
		is_buyer: boolean;
		sent_sats: number;
		received_fiat: number;
		trade_fee_sats: number;
	};
	taker: {
		trade_fee_percent: number;
		bond_size_sats: number;
		bond_size_percent: number;
		is_buyer: boolean;
		sent_fiat: number;
		received_sats: number;
		payment_hash: string;
		preimage: string;
		trade_fee_sats: number;
		sent_sats: number;
		received_fiat: number;
	};
	platform: {
		contract_exchange_rate: number;
		contract_timestamp: string;
		contract_total_time: number;
		routing_budget_sats: number;
		trade_revenue_sats: number;
	};
}