// /components/trades/SellTradeTable.tsx

import { useState } from 'react';
import { useTradeStore } from '@/store/useTradeStore';
import { SellTrade } from '@/types';
import { formatSats, formatUSD } from '@/lib/utils';
import { CalendarIcon, ReceiptText, X } from 'lucide-react';
import { format } from 'date-fns';

// Import shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const SellTradeTable = () => {
	const sellTrades = useTradeStore((state) => state.sellTrades);
	const removeSellTrade = useTradeStore((state) => state.removeSellTrade);
	const addSellTrade = useTradeStore((state) => state.addSellTrade);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [newTrade, setNewTrade] = useState<Omit<SellTrade, 'id' | 'premiumGain' | 'sentToFiatPool'>>({
		date: new Date().toISOString().split('T')[0],
		satsSold: 0,
		btcPrice: 0,
		usdReceived: 0,
		costBasis: 0,
		notes: '',
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		const numericValue = name === 'notes' ? value : parseFloat(value) || 0;

		setNewTrade((prev) => {
			const updated = {
				...prev,
				[name]: numericValue,
			};

			// If satsSold or btcPrice changes, recalculate usdReceived
			if (name === 'satsSold' || name === 'btcPrice') {
				const satsSold = name === 'satsSold' ? Number(numericValue) : Number(prev.satsSold);
				const btcPrice = name === 'btcPrice' ? Number(numericValue) : Number(prev.btcPrice);
				updated.usdReceived = (satsSold / 100_000_000) * btcPrice;
			}

			return updated;
		});
	};


	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			setDate(selectedDate);
			setNewTrade((prev) => ({
				...prev,
				date: selectedDate.toISOString().split('T')[0],
			}));
		}
	};

	const handleAddTrade = () => {
		// Calculate premium gain
		const premiumGain = newTrade.usdReceived - (newTrade.costBasis * newTrade.satsSold / 100000000);

		addSellTrade({
			...newTrade,
			premiumGain,
			sentToFiatPool: premiumGain,
		});

		// Reset form
		setNewTrade({
			date: new Date().toISOString().split('T')[0],
			satsSold: 0,
			btcPrice: 0,
			usdReceived: 0,
			costBasis: 0,
			notes: '',
		});
		setIsDialogOpen(false);
	};

	const isFormValid = newTrade.satsSold > 0 && newTrade.btcPrice > 0 && newTrade.usdReceived > 0 && newTrade.costBasis > 0;

	return (
		<Card className="mb-8 shadow-sm border-none">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div>
					<CardTitle className="text-xl">Sell Log (Harvest Profits)</CardTitle>
					<CardDescription>Manage your Bitcoin sell transactions</CardDescription>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button variant="default" className="bg-fuchsia-300 hover:bg-fuchsia-300/80 min-w-[180px] cursor-pointer">
							<ReceiptText /> Add Sell Trade
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[550px]">
						<DialogHeader>
							<DialogTitle>Add New Sell Trade</DialogTitle>
							<DialogDescription>
								Record a new Bitcoin sell transaction
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="date" className="text-right">Date</Label>
								<div className="col-span-3">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!date && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{date ? format(date, "PPP") : <span>Pick a date</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={date}
												onSelect={handleDateSelect}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="satsSold" className="text-right">Sats Sold</Label>
								<Input
									id="satsSold"
									name="satsSold"
									type="number"
									placeholder="500000"
									value={newTrade.satsSold || ''}
									onChange={handleInputChange}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="btcPrice" className="text-right">BTC Price (USD)</Label>
								<Input
									id="btcPrice"
									name="btcPrice"
									type="number"
									placeholder="88700"
									value={newTrade.btcPrice || ''}
									onChange={handleInputChange}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="usdReceived" className="text-right">USD Received</Label>
								<Input
									id="usdReceived"
									name="usdReceived"
									type="number"
									placeholder="443.50"
									value={newTrade.usdReceived || ''}
									onChange={handleInputChange}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="costBasis" className="text-right">Cost Basis (USD)</Label>
								<Input
									id="costBasis"
									name="costBasis"
									type="number"
									placeholder="84500"
									value={newTrade.costBasis || ''}
									onChange={handleInputChange}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="notes" className="text-right">Notes</Label>
								<Textarea
									id="notes"
									name="notes"
									placeholder="Premium goes to fiat pool"
									value={newTrade.notes}
									onChange={handleInputChange}
									className="col-span-3"
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								onClick={handleAddTrade}
								disabled={!isFormValid}
								className="bg-green-300 hover:bg-green-300/80"
							>
								Add Trade
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Action</TableHead>
								<TableHead>Sats Sold</TableHead>
								<TableHead>BTC Price</TableHead>
								<TableHead>USD Received</TableHead>
								<TableHead>Cost Basis</TableHead>
								<TableHead>Premium Gain</TableHead>
								<TableHead>Sent to Fiat Pool</TableHead>
								<TableHead>Notes</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sellTrades.length === 0 ? (
								<TableRow>
									<TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
										No sell trades recorded yet
									</TableCell>
								</TableRow>
							) : (
								sellTrades.map((trade) => (
									<TableRow key={trade.id}>
										<TableCell>{trade.date}</TableCell>
										<TableCell>
											<Badge variant="default" className="bg-green-600">Sell</Badge>
										</TableCell>
										<TableCell>{formatSats(trade.satsSold)}</TableCell>
										<TableCell>{formatUSD(trade.btcPrice)}</TableCell>
										<TableCell>{formatUSD(trade.usdReceived)}</TableCell>
										<TableCell>{formatUSD(trade.costBasis)}</TableCell>
										<TableCell className={trade.premiumGain >= 0 ? "text-green-600" : "text-red-600"}>
											{formatUSD(trade.premiumGain)}
										</TableCell>
										<TableCell>{formatUSD(trade.sentToFiatPool)}</TableCell>
										<TableCell className="max-w-[150px] truncate" title={trade.notes}>
											{trade.notes}
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="destructive"
												size="sm"
												onClick={() => removeSellTrade(trade.id)}
											>
												<X className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};

export default SellTradeTable;