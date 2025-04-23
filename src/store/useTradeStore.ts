// /store/useTradeStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SellTrade, ReinvestmentTrade, SummaryMetrics, ImportedTradeData } from '@/types';
import { calculateSummaryMetrics } from '@/lib/utils';

interface TradeState {
	sellTrades: SellTrade[];
	reinvestmentTrades: ReinvestmentTrade[];
	summaryMetrics: SummaryMetrics;

	// Actions
	addSellTrade: (trade: Omit<SellTrade, 'id'>) => void;
	addReinvestmentTrade: (trade: Omit<ReinvestmentTrade, 'id'>) => void;
	removeSellTrade: (id: string) => void;
	removeReinvestmentTrade: (id: string) => void;
	importTradeFromJson: (data: ImportedTradeData) => void;
	updateSummaryMetrics: () => void;
	clearAllData: () => void;
}

export const useTradeStore = create<TradeState>()(
	persist(
		(set, get) => ({
			sellTrades: [],
			reinvestmentTrades: [],
			summaryMetrics: {
				totalSatsSold: 0,
				totalFiatGained: 0,
				totalPremiumProfit: 0,
				reinvestedFiat: 0,
				remainingFiatPool: 0,
				totalSatsReinvested: 0,
			},

			addSellTrade: (trade) => {
				const newTrade = {
					...trade,
					id: Date.now().toString(),
				};
				set((state) => ({
					sellTrades: [...state.sellTrades, newTrade],
				}));
				get().updateSummaryMetrics();
			},

			addReinvestmentTrade: (trade) => {
				const newTrade = {
					...trade,
					id: Date.now().toString(),
				};
				set((state) => ({
					reinvestmentTrades: [...state.reinvestmentTrades, newTrade],
				}));
				get().updateSummaryMetrics();
			},

			removeSellTrade: (id) => {
				set((state) => ({
					sellTrades: state.sellTrades.filter((trade) => trade.id !== id),
				}));
				get().updateSummaryMetrics();
			},

			removeReinvestmentTrade: (id) => {
				set((state) => ({
					reinvestmentTrades: state.reinvestmentTrades.filter((trade) => trade.id !== id),
				}));
				get().updateSummaryMetrics();
			},

			importTradeFromJson: (data) => {
				// Logic to convert imported data to our trade format
				if (data.maker && !data.maker.is_buyer && data.taker.is_buyer) {
					// This is a sell trade where the maker is selling BTC
					const newSellTrade: Omit<SellTrade, 'id'> = {
						date: new Date(data.platform.contract_timestamp).toISOString().split('T')[0],
						satsSold: data.maker.sent_sats,
						btcPrice: data.platform.contract_exchange_rate,
						usdReceived: data.maker.received_fiat,
						// Assuming a default cost basis if not available
						costBasis: data.platform.contract_exchange_rate * 0.95, // 5% below market as example
						premiumGain: data.maker.received_fiat - (data.platform.contract_exchange_rate * 0.95 * data.maker.sent_sats / 100000000),
						sentToFiatPool: data.maker.received_fiat - (data.platform.contract_exchange_rate * 0.95 * data.maker.sent_sats / 100000000),
						notes: `Imported trade #${data.order_id} from ${data.coordinator}`,
					};
					get().addSellTrade(newSellTrade);
				} else if (data.taker && !data.taker.is_buyer && data.maker.is_buyer) {
					// This is a sell trade where the taker is selling BTC
					const newSellTrade: Omit<SellTrade, 'id'> = {
						date: new Date(data.platform.contract_timestamp).toISOString().split('T')[0],
						satsSold: data.taker.sent_sats || 0,
						btcPrice: data.platform.contract_exchange_rate,
						usdReceived: data.taker.received_fiat || 0,
						// Assuming a default cost basis if not available
						costBasis: data.platform.contract_exchange_rate * 0.95, // 5% below market as example
						premiumGain: (data.taker.received_fiat || 0) - (data.platform.contract_exchange_rate * 0.95 * (data.taker.sent_sats || 0) / 100000000),
						sentToFiatPool: (data.taker.received_fiat || 0) - (data.platform.contract_exchange_rate * 0.95 * (data.taker.sent_sats || 0) / 100000000),
						notes: `Imported trade #${data.order_id} from ${data.coordinator}`,
					};
					get().addSellTrade(newSellTrade);
				}
				// Note: You'd need to expand this to handle reinvestment trades as well
			},

			updateSummaryMetrics: () => {
				const { sellTrades, reinvestmentTrades } = get();
				const metrics = calculateSummaryMetrics(sellTrades, reinvestmentTrades);
				set({ summaryMetrics: metrics });
			},

			clearAllData: () => {
				set({
					sellTrades: [],
					reinvestmentTrades: [],
					summaryMetrics: {
						totalSatsSold: 0,
						totalFiatGained: 0,
						totalPremiumProfit: 0,
						reinvestedFiat: 0,
						remainingFiatPool: 0,
						totalSatsReinvested: 0,
					},
				});
			},
		}),
		{
			name: 'bitcoin-trade-tracker',
		}
	)
);