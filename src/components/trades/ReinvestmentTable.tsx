// /components/trades/ReinvestmentTable.tsx

import { useState } from 'react';
import { useTradeStore } from '@/store/useTradeStore';
import { ReinvestmentTrade } from '@/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ReinvestmentTable = () => {
	const reinvestmentTrades = useTradeStore((state) => state.reinvestmentTrades);
	const removeReinvestmentTrade = useTradeStore((state) => state.removeReinvestmentTrade);
	const summaryMetrics = useTradeStore((state) => state.summaryMetrics);
	const addReinvestmentTrade = useTradeStore((state) => state.addReinvestmentTrade);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [newTrade, setNewTrade] = useState<Omit<ReinvestmentTrade, 'id' | 'satsBought' | 'remainingProfit'>>({
		date: new Date().toISOString().split('T')[0],
		reinvestAmount: 0,
		btcPrice: 0,
		fromProfitPool: true,
		notes: '',
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setNewTrade((prev) => ({
			...prev,
			[name]: name === 'notes' ? value : parseFloat(value) || 0,
		}));
	};

	const handleSelectChange = (value: string) => {
		setNewTrade((prev) => ({
			...prev,
			fromProfitPool: value === 'true',
		}));
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

	const calculateSatsBought = () => {
		if (!newTrade.btcPrice || !newTrade.reinvestAmount) return 0;
		// Calculate how many sats you can buy with the reinvest amount
		return Math.floor((newTrade.reinvestAmount / newTrade.btcPrice) * 100000000);
	};

	const calculateRemainingProfit = () => {
		if (!newTrade.fromProfitPool) return summaryMetrics.remainingFiatPool;
		return summaryMetrics.remainingFiatPool - newTrade.reinvestAmount;
	};

	const handleAddTrade = () => {
		addReinvestmentTrade({
			...newTrade,
			satsBought: calculateSatsBought(),
			remainingProfit: calculateRemainingProfit(),
		});

		// Reset form
		setNewTrade({
			date: new Date().toISOString().split('T')[0],
			reinvestAmount: 0,
			btcPrice: 0,
			fromProfitPool: true,
			notes: '',
		});
		setIsDialogOpen(false);
	};

	const isFormValid = newTrade.reinvestAmount > 0 && newTrade.btcPrice > 0;

	return (
		<Card className="mb-8 shadow-sm border-none">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div>
					<CardTitle className="text-xl">Reinvestment Log (Buy Back from Profit)</CardTitle>
					<CardDescription>Track Bitcoin repurchases from your profit pool</CardDescription>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button variant="default" className="bg-orange-300 hover:bg-orange-300/80 min-w-[180px] cursor-pointer">
							<ReceiptText /> Add Reinvestment
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[550px]">
						<DialogHeader>
							<DialogTitle>Add New Reinvestment</DialogTitle>
							<DialogDescription>
								Record a new Bitcoin repurchase transaction
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
										<PopoverContent className="w-fit p-0">
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
								<Label htmlFor="reinvestAmount" className="text-right">Reinvest Amount (USD)</Label>
								<Input
									id="reinvestAmount"
									name="reinvestAmount"
									type="number"
									placeholder="20.00"
									value={newTrade.reinvestAmount || ''}
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
									placeholder="82300"
									value={newTrade.btcPrice || ''}
									onChange={handleInputChange}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="fromProfitPool" className="text-right">From Profit Pool?</Label>
								<Select
									onValueChange={handleSelectChange}
									defaultValue={newTrade.fromProfitPool.toString()}
								>
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select source" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="true">Yes</SelectItem>
										<SelectItem value="false">No</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="satsBought" className="text-right">Sats to be Bought</Label>
								<Input
									id="satsBought"
									value={formatSats(calculateSatsBought())}
									readOnly
									className="col-span-3 bg-muted"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="notes" className="text-right">Notes</Label>
								<Textarea
									id="notes"
									name="notes"
									placeholder="Bought dip from premium pool"
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
								Add Reinvestment
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
								<TableHead>Reinvest Amount</TableHead>
								<TableHead>BTC Price</TableHead>
								<TableHead>Sats Bought</TableHead>
								<TableHead>From Profit Pool</TableHead>
								<TableHead>Remaining Profit</TableHead>
								<TableHead>Notes</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{reinvestmentTrades.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
										No reinvestment trades recorded yet
									</TableCell>
								</TableRow>
							) : (
								reinvestmentTrades.map((trade) => (
									<TableRow key={trade.id}>
										<TableCell>{trade.date}</TableCell>
										<TableCell>{formatUSD(trade.reinvestAmount)}</TableCell>
										<TableCell>{formatUSD(trade.btcPrice)}</TableCell>
										<TableCell className="font-medium">{formatSats(trade.satsBought)}</TableCell>
										<TableCell>
											<Badge variant={trade.fromProfitPool ? "default" : "outline"} className={trade.fromProfitPool ? "bg-blue-300" : ""}>
												{trade.fromProfitPool ? 'Yes' : 'No'}
											</Badge>
										</TableCell>
										<TableCell>{formatUSD(trade.remainingProfit)}</TableCell>
										<TableCell className="max-w-[150px] truncate" title={trade.notes}>
											{trade.notes}
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="destructive"
												size="sm"
												onClick={() => removeReinvestmentTrade(trade.id)}
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

export default ReinvestmentTable;