// /app/page.tsx
'use client';

import SellTradeTable from '@/components/trades/SellTradeTable';
import ReinvestmentTable from '@/components/trades/ReinvestmentTable';
import SummarySection from '@/components/trades/SummarySection';
import { useTradeStore } from '@/store/useTradeStore';

import { Button } from '@/components/ui/button';
import {
	CardDescription,
	CardTitle,
} from '@/components/ui/card';
import { Bitcoin, AlertTriangle } from 'lucide-react';

export default function Home() {

	const clearAllData = useTradeStore((state) => state.clearAllData);

	const handleClear = () => {
		if (
			confirm('Are you sure you want to clear all data? This action cannot be undone.')
		) {
			clearAllData();
		}
	};

	return (
		<div className="container mx-auto max-w-6xl px-6 py-8 space-y-10">
			{/* Header */}
			<div className='flex justify-between items-center mb-6'>
				<div className="flex items-center space-x-4">
					<div className="bg-orange-400 p-3 rounded-full">
						<Bitcoin className="h-6 w-6 text-white" />
					</div>
					<div>
						<CardTitle className="text-2xl md:text-3xl font-bold">
							Bitcoin Trading Tracker
						</CardTitle>
						<CardDescription className="text-sm text-fuchsia-300">
							Track premium trades, harvest profits, and reinvest with clarity.
						</CardDescription>
					</div>
				</div>

				<div className="flex gap-2 flex-wrap">
					<Button onClick={handleClear} className='cursor-pointer bg-red-300 hover:bg-red-300/80'>
						<AlertTriangle className="w-5 h-5 mr-1" />
						Clear All Data
					</Button>
				</div>
			</div>

			{/* Summary Section */}
			<SummarySection />

			{/* Tables */}
			<SellTradeTable />
			<ReinvestmentTable />


		</div>
	);
}
