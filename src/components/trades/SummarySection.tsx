// /components/trades/SummarySection.tsx

import { useTradeStore } from '@/store/useTradeStore';
import { formatSats, formatUSD } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, CircleDollarSign, Wallet, ArrowRightLeft, ChartBar, PiggyBank, Calculator } from 'lucide-react';

const SummarySection = () => {
	const summaryMetrics = useTradeStore((state) => state.summaryMetrics);

	const metrics = [
		{
			title: "Total Sats Sold",
			value: formatSats(summaryMetrics.totalSatsSold),
			icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
			trend: "neutral"
		},
		{
			title: "Total Fiat Gained",
			value: formatUSD(summaryMetrics.totalFiatGained),
			icon: <CircleDollarSign className="h-8 w-8 text-green-500" />,
			trend: "positive"
		},
		{
			title: "Total Premium Profit",
			value: formatUSD(summaryMetrics.totalPremiumProfit),
			icon: <ChartBar className="h-8 w-8 text-indigo-500" />,
			trend: "positive"
		},
		{
			title: "Reinvested Fiat",
			value: formatUSD(summaryMetrics.reinvestedFiat),
			icon: <ArrowRightLeft className="h-8 w-8 text-blue-500" />,
			trend: "neutral"
		},
		{
			title: "Remaining Fiat Pool",
			value: formatUSD(summaryMetrics.remainingFiatPool),
			icon: <PiggyBank className="h-8 w-8 text-violet-500" />,
			trend: "neutral"
		},
		{
			title: "Total Sats Reinvested",
			value: formatSats(summaryMetrics.totalSatsReinvested),
			icon: <Wallet className="h-8 w-8 text-amber-500" />,
			trend: "neutral"
		},
		{
			title: "Net Sats Position",
			value: formatSats(summaryMetrics.totalSatsReinvested - summaryMetrics.totalSatsSold),
			icon: <Calculator className="h-8 w-8 text-cyan-500" />,
			trend: "neutral"
		}
	];

	return (
		<div className="mb-8">
			<h2 className="text-2xl font-bold mb-4">Summary</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{metrics.map((metric, index) => (
					<Card key={index} className="overflow-hidden border-0 shadow-sm">
						<CardContent className="p-0">
							<div className="flex items-start">
								<div className="flex-shrink-0 p-4">
									{metric.icon}
								</div>
								<div className="flex-1 p-4">
									<h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</h3>
									<p className="text-xl font-semibold">{metric.value}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};

export default SummarySection;