// /components/trades/SellTradeTable.tsx

import { useState, useEffect } from 'react';
import { useTradeStore } from '@/store/useTradeStore';
import { SellTrade } from '@/types';
import { formatSats, formatUSD, cn } from '@/lib/utils';
import { CalendarIcon, FileDown, Pencil, ReceiptText, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { NumericFormat } from 'react-number-format';

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
import ImportJsonModal from '@/components/trades/ImportJsonModal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const SellTradeTable = () => {
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const sellTrades = useTradeStore((state) => state.sellTrades);
	const removeSellTrade = useTradeStore((state) => state.removeSellTrade);
	const addSellTrade = useTradeStore((state) => state.addSellTrade);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [newTrade, setNewTrade] = useState<Omit<SellTrade, 'id' | 'sentToFiatPool'>>({
		date: new Date().toISOString().split('T')[0],
		satsSold: 0,
		btcPrice: 0,
		premiumGain: 0,
		usdReceived: 0,
		costBasis: 0,
		notes: '',
	});

	// Formatted display values
	const [displayValues, setDisplayValues] = useState({
		satsSold: '',
		btcPrice: '',
		premiumGain: '',
		usdReceived: '',
		costBasis: ''
	});

	// Update display values when newTrade changes
	useEffect(() => {
		setDisplayValues({
			satsSold: newTrade.satsSold ? newTrade.satsSold.toLocaleString() : '',
			btcPrice: newTrade.btcPrice ? `$${newTrade.btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '',
			premiumGain: newTrade.premiumGain ? `${newTrade.premiumGain}%` : '',
			usdReceived: newTrade.usdReceived ? `$${newTrade.usdReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '',
			costBasis: newTrade.costBasis ? `$${newTrade.costBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''
		});
	}, [newTrade]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		// For notes field, just use the value as is
		if (name === 'notes') {
			setNewTrade(prev => ({ ...prev, notes: value }));
			return;
		}

		// For numeric fields, strip non-numeric characters (except for decimal point)
		const cleanValue = value.replace(/[^0-9.]/g, '');
		const numericValue = parseFloat(cleanValue) || 0;

		setNewTrade((prev) => {
			const updated = {
				...prev,
				[name]: numericValue,
			};

			// Get the latest values after the update
			const satsSold = name === 'satsSold' ? numericValue : prev.satsSold;
			const btcPrice = name === 'btcPrice' ? numericValue : prev.btcPrice;
			const premium = name === 'premium' ? numericValue : prev.premiumGain;

			// If any of these values change, recalculate related fields
			if (name === 'satsSold' || name === 'btcPrice' || name === 'premium') {
				// Calculate price with premium applied
				const priceWithPremium = btcPrice * (1 + premium / 100);

				// Update USD received based on satsSold and priceWithPremium
				updated.usdReceived = (satsSold / 100_000_000) * priceWithPremium;

				// Cost basis should be the market price WITH premium
				updated.costBasis = priceWithPremium;
			}

			return updated;
		});

		// Update display values separately
		updateDisplayValue(name, numericValue);
	};

	// Add a new helper function for updating display values
	const updateDisplayValue = (field: string, value: number) => {
		setDisplayValues(prev => {
			const updated = { ...prev };

			switch (field) {
				case 'satsSold':
					updated.satsSold = value ? value.toLocaleString() : '';
					break;
				case 'btcPrice':
					updated.btcPrice = value ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
					break;
				case 'premium':
					updated.premiumGain = value ? `${value}%` : '';
					break;
				case 'usdReceived':
					updated.usdReceived = value ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
					break;
				case 'costBasis':
					updated.costBasis = value ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
					break;
			}

			return updated;
		});
	};

	// Modify handleDirectInputChange to properly handle currency inputs
	const handleDirectInputChange = (name: string, value: string) => {
		// Remove currency symbols, commas, and other non-numeric characters
		const cleanValue = value.replace(/[$,%]/g, '');
		const numericValue = parseFloat(cleanValue) || 0;

		// Update the internal numeric value
		setNewTrade(prev => ({
			...prev,
			[name]: numericValue
		}));

		// Update the display value separately
		updateDisplayValue(name, numericValue);

		// Recalculate dependent values
		if (name === 'satsSold' || name === 'btcPrice' || name === 'premium') {
			const updatedTrade = {
				...newTrade,
				[name]: numericValue
			};

			// Calculate price with premium applied
			const priceWithPremium = (name === 'btcPrice' ? numericValue : updatedTrade.btcPrice) *
				(1 + (name === 'premium' ? numericValue : updatedTrade.premiumGain) / 100);

			// Update USD received based on satsSold and priceWithPremium
			const satsSold = name === 'satsSold' ? numericValue : updatedTrade.satsSold;
			const usdReceived = (satsSold / 100_000_000) * priceWithPremium;

			setNewTrade(prev => ({
				...prev,
				[name]: numericValue,
				usdReceived: usdReceived,
				costBasis: priceWithPremium
			}));

			// Update display values for calculated fields
			setDisplayValues(prev => ({
				...prev,
				usdReceived: `$${usdReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
				costBasis: `$${priceWithPremium.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
			}));
		}
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
		// Calculate premium gain - the difference between what was received and what would have been received at market price (without premium)
		const marketValue = (newTrade.satsSold / 100_000_000) * newTrade.btcPrice;
		const premiumGain = newTrade.usdReceived - marketValue;

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
			premiumGain: 0,
			usdReceived: 0,
			costBasis: 0,
			notes: '',
		});
		setIsDialogOpen(false);
	};

	const isFormValid = newTrade.satsSold > 0 && newTrade.btcPrice > 0 && newTrade.usdReceived > 0;

	return (
		<>
			<Card className="mb-8 shadow-sm border-none">
				<CardHeader className="flex flex-col md:flex-row items-center justify-between pb-2">
					<div>
						<CardTitle className="text-xl">Sell Log (Harvest Profits)</CardTitle>
						<CardDescription>Manage your Bitcoin sell transactions</CardDescription>
					</div>
					<div className="flex gap-2 flex-wrap">
						<Button onClick={() => setIsImportModalOpen(true)} className='min-w-[180px] cursor-pointer bg-green-300 hover:bg-green-300/80'>
							<FileDown className="w-4 h-4 mr-1" />
							Import JSON
						</Button>
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button variant="default" className="bg-fuchsia-300 hover:bg-fuchsia-300/80 min-w-[180px] cursor-pointer">
									<ReceiptText className="mr-2 h-4 w-4" /> Add Sell Trade
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
										<div className="col-span-3 relative text-sm">
											<NumericFormat
												id="satsSold"
												name="satsSold"
												thousandSeparator=","
												allowNegative={false}
												value={newTrade.satsSold}
												onValueChange={(values) => {
													const { floatValue } = values;
													handleDirectInputChange('satsSold', String(floatValue ?? 0));
												}}
												className={cn(
													"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
													"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
													"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
													"px-2 py-2 font-mono border rounded-md"
												)}
												placeholder="500,000"
											/>

											<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
												sats
											</span>
										</div>
									</div>

									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="btcPrice" className="text-right">BTC Price</Label>
										<div className="col-span-3 relative text-sm">
											<NumericFormat
												id="btcPrice"
												name="btcPrice"
												prefix="$"
												thousandSeparator=","
												decimalScale={2}
												fixedDecimalScale
												allowNegative={false}
												value={newTrade.btcPrice}
												onValueChange={(values) => {
													const { floatValue } = values;
													handleDirectInputChange('btcPrice', String(floatValue ?? 0));
												}}
												className={cn(
													"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
													"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
													"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
													"px-2 py-2 font-mono border rounded-md"
												)}
												placeholder="$29,000.00"
											/>

										</div>
									</div>

									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="premium" className="text-right">Premium</Label>
										<div className="col-span-3 relative">
											<NumericFormat
												id="premium"
												name="premium"
												suffix="%"
												decimalScale={2}
												fixedDecimalScale
												allowNegative={true}
												value={newTrade.premiumGain}
												onValueChange={(values) => {
													const { floatValue } = values;
													handleDirectInputChange('premium', String(floatValue ?? 0));
												}}
												className={cn(
													"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
													"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
													"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
													"px-2 py-2 font-mono border rounded-md"
												)}
												placeholder="3.5%"
											/>

											<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
												%
											</span>
										</div>
									</div>

									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="usdReceived" className="text-right">USD Received</Label>
										<div className="col-span-3 relative">
											<Input
												id="usdReceived"
												name="usdReceived"
												placeholder="$443.50"
												value={displayValues.usdReceived}
												onChange={(e) => handleDirectInputChange('usdReceived', e.target.value)}
												className="pl-2 font-mono"
											/>
										</div>
									</div>

									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="costBasis" className="text-right">Cost Basis</Label>
										<div className="col-span-3">
											<Input
												id="costBasis"
												name="costBasis"
												placeholder="$0.00"
												value={displayValues.costBasis}
												className="pl-2 font-mono bg-gray-50"
												disabled
											/>
										</div>
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
					</div>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border hidden md:block">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
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

					{/* Mobile View */}
					<div className="md:hidden space-y-4">
						<Accordion type="multiple" className="w-full space-y-2">
							{sellTrades.map((trade) => (
								<AccordionItem key={trade.id} value={`trade-${trade.id}`}>
									<Card className="p-4 shadow-md rounded-2xl bg-background">
										<AccordionTrigger className="flex justify-between items-center w-full p-0 hover:no-underline">
											<div className='flex flex-col text-left space-y-1'>
												<div className='flex items-center space-x-6'>
													<div className="flex flex-col text-left space-y-1">
														<p className="text-xs text-foreground">Date</p>
														<p className="text-base font-semibold text-orange-300">{trade.date}</p>
													</div>
													<div className="flex flex-col text-left space-y-1">
														<p className="text-xs text-foreground">Sats Sold</p>
														<p className="text-base font-semibold text-orange-300">{formatSats(trade.satsSold)}</p>
													</div>
													<div className="flex flex-col text-left space-y-1">
														<p className="text-xs text-foreground">BTC Price</p>
														<p className="text-base font-semibold text-orange-300">{formatUSD(trade.btcPrice)}</p>
													</div>
												</div>
											</div>
										</AccordionTrigger>
										<AccordionContent >
											<div className='flex justify-end items-end gap-3'>
												<Button
													size="icon"
													variant="ghost"
													onClick={(e) => {
														e.stopPropagation(); // prevent accordion toggle
														removeSellTrade(trade.id);
													}}
													className="text-orange-300 hover:text-yellow-300/80 bg-muted-foreground/20 hover:bg-yellow-300/80"
												>
													<Pencil className="w-5 h-5" />
												</Button>
												<Button
													size="icon"
													variant="ghost"
													onClick={(e) => {
														e.stopPropagation(); // prevent accordion toggle
														removeSellTrade(trade.id);
													}}
													className="text-red-300 hover:text-red-300/80 bg-muted-foreground/20 hover:bg-red-300/80"
												>
													<Trash2 className="w-5 h-5" />
												</Button>
											</div>
											<div className="mt-4 text-sm text-muted-foreground space-y-2 w-full">
												<div className="flex justify-between">
													<span className="font-medium text-foreground">Sats:</span>
													<span>{formatSats(trade.satsSold)}</span>
												</div>
												<div className="flex justify-between">
													<span className="font-medium text-foreground">BTC Price:</span>
													<span>{formatUSD(trade.btcPrice)}</span>
												</div>
												{trade.premiumGain && <div className="flex justify-between">
													<span className="font-medium text-foreground">Premium:</span>
													<span>{trade.premiumGain}%</span>
												</div>}
												<div className="flex justify-between">
													<span className="font-medium text-foreground">USD Received:</span>
													<span>{formatUSD(trade.usdReceived)}</span>
												</div>
												<div>
													<p className="font-medium text-foreground">Notes:</p>
													<p className="text-fuchsia-300">{trade.notes || '-'}</p>
												</div>
											</div>
										</AccordionContent>
									</Card>
								</AccordionItem>
							))}
						</Accordion>
					</div>


				</CardContent>
			</Card>



			{/* Modal */}
			<ImportJsonModal
				isOpen={isImportModalOpen}
				onClose={() => setIsImportModalOpen(false)}
			/>
		</>
	);
};

export default SellTradeTable;