// /app/help/page.tsx

'use client';

import Link from 'next/link';

export default function HelpPage() {
	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<div className="mb-8">
				<Link href="/" className="text-orange-300 hover:underline mb-4 inline-block">
					&larr; Back to Tracker
				</Link>
				<h1 className="text-3xl font-bold mb-4">Bitcoin Premium Trading Tracker - Help</h1>
				<p className="text-fuchsia-300">
					Learn how to use this tool to track your Bitcoin trades, harvest premium profits, and reinvest strategically.
				</p>
			</div>

			<div className="prose max-w-none">
				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">What This Tool Does</h2>
					<p>
						This Bitcoin Premium Trading Tracker helps you implement a strategic approach to Bitcoin trading by:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<li>Tracking your BTC sell trades with a focus on premium gains</li>
						<li>Separating premium profits from your core Bitcoin stack</li>
						<li>Recording reinvestments separately to track strategy effectiveness</li>
						<li>Calculating key metrics to monitor your overall performance</li>
					</ul>
					<p>
						This approach allows you to &quot;harvest&quot; profits while maintaining or growing your Bitcoin position over time.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">Core Concept: Premium Harvesting</h2>
					<p className="mb-4">
						The strategy is based on these principles:
					</p>
					<ol className="list-decimal pl-6 mb-4">
						<li>Your core BTC stack (sats) is for trading.</li>
						<li>Any premium you gain is &quot;harvested&quot; into fiat — don&apos;t reinvest it unless you want to &quot;compound&quot; intentionally.</li>
						<li>The fiat profits can be saved, reinvested manually, or used to buy back BTC at dips.</li>
					</ol>
					<p>
						By tracking these separately, you get a clear picture of how your strategy is performing.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">Key Fields Explained</h2>

					<h3 className="text-xl font-semibold mb-2">Sell Log Fields</h3>
					<ul className="list-disc pl-6 mb-4">
						<li><strong>Date:</strong> When the sell trade occurred</li>
						<li><strong>Sats Sold:</strong> Amount of BTC you sold (in satoshis)</li>
						<li><strong>BTC Price:</strong> Market price of Bitcoin at time of sale (USD)</li>
						<li><strong>USD Received:</strong> Total cash received from sale</li>
						<li><strong>Cost Basis:</strong> Your acquisition price per BTC</li>
						<li><strong>Premium Gain:</strong> Pure fiat profit, separated out (USD Received - Cost Basis value)</li>
						<li><strong>Sent to Fiat Pool:</strong> Amount added to your fiat profit pool</li>
					</ul>

					<h3 className="text-xl font-semibold mb-2">Reinvestment Log Fields</h3>
					<ul className="list-disc pl-6 mb-4">
						<li><strong>Date:</strong> When you reinvested</li>
						<li><strong>Reinvest Amount:</strong> How much fiat you used</li>
						<li><strong>BTC Price:</strong> Market price of Bitcoin when buying</li>
						<li><strong>Sats Bought:</strong> Amount of BTC acquired (in satoshis)</li>
						<li><strong>From Profit Pool:</strong> Whether the funds came from your premium profits</li>
						<li><strong>Remaining Profit:</strong> Balance of your profit pool after reinvestment</li>
					</ul>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">How to Use This Tool</h2>

					<h3 className="text-xl font-semibold mb-2">Adding Sell Trades</h3>
					<ol className="list-decimal pl-6 mb-4">
						<li>Click the &quot;Add Sell Trade&quot; button</li>
						<li>Enter the date of your trade</li>
						<li>Input the amount of satoshis you sold</li>
						<li>Enter the Bitcoin price at time of sale</li>
						<li>Input the total USD you received</li>
						<li>Enter your cost basis (what you originally paid)</li>
						<li>Add any notes about the trade</li>
						<li>Click &quot;Add Trade&quot; to save</li>
					</ol>

					<h3 className="text-xl font-semibold mb-2">Adding Reinvestments</h3>
					<ol className="list-decimal pl-6 mb-4">
						<li>Click the &quot;Add Reinvestment&quot; button</li>
						<li>Enter the date of your reinvestment</li>
						<li>Input the USD amount you&apos;re reinvesting</li>
						<li>Enter the Bitcoin price at time of purchase</li>
						<li>Select whether it&apos;s from your profit pool</li>
						<li>Add any notes about the reinvestment</li>
						<li>Review the preview of sats to be bought</li>
						<li>Click &quot;Add Reinvestment&quot; to save</li>
					</ol>

					<h3 className="text-xl font-semibold mb-2">Importing JSON Data</h3>
					<ol className="list-decimal pl-6 mb-4">
						<li>Click the &quot;Import JSON&quot; button</li>
						<li>Upload a JSON file or paste JSON content</li>
						<li>Click &quot;Import&quot; to process the data</li>
					</ol>
					<p className="text-sm text-fuchsia-300 mb-4 border-l-4 border-blue-300 pl-4">
						Note: The JSON must follow the expected format with maker/taker information.
						After import, you may need to adjust the cost basis manually.
					</p>

					<h3 className="text-xl font-semibold mb-2">Reading the Summary</h3>
					<p className="mb-4">
						The summary section gives you an overview of your trading activity:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<li><strong>Total Sats Sold:</strong> Sum of all BTC you&apos;ve sold</li>
						<li><strong>Total Fiat Gained:</strong> Total USD received from sales</li>
						<li><strong>Total Premium Profit:</strong> Sum of all premium gains</li>
						<li><strong>Reinvested Fiat:</strong> How much you&apos;ve reinvested</li>
						<li><strong>Remaining Fiat Pool:</strong> Current balance of your profit pool</li>
						<li><strong>Total Sats Reinvested:</strong> Sum of all BTC you&apos;ve bought back</li>
						<li><strong>Net Sats Position:</strong> Overall change in your BTC holdings</li>
					</ul>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">Examples</h2>

					<h3 className="text-xl font-semibold mb-2">Example 1: Simple Premium Harvest</h3>
					<ol className="list-decimal pl-6 mb-4">
						<li>You sell 500,000 sats at $88,700/BTC, receiving $443.50</li>
						<li>Your cost basis was $84,500/BTC</li>
						<li>Premium gain: $443.50 - ($84,500 × 500,000 ÷ 100,000,000) = $21.00</li>
						<li>You keep the $21.00 as profit in your fiat pool</li>
					</ol>

					<h3 className="text-xl font-semibold mb-2">Example 2: Reinvestment Strategy</h3>
					<ol className="list-decimal pl-6 mb-4">
						<li>From your fiat pool, you reinvest $20.00 when BTC price dips to $82,300</li>
						<li>This buys you back 243,000 sats</li>
						<li>Your fiat pool decreases from $21.00 to $1.00</li>
						<li>Net position: Started with 500,000 sats, now have 243,000 sats plus $1.00 fiat</li>
					</ol>

					<h3 className="text-xl font-semibold mb-2">Example 3: Multiple Cycles</h3>
					<p className="mb-4">
						By continuing this cycle (sell high → harvest premium → buy dips), you can:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<li>Generate consistent fiat profits</li>
						<li>Potentially maintain or increase your BTC stack over time</li>
						<li>Reduce overall volatility in your portfolio</li>
					</ul>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">Tips for Best Results</h2>
					<ul className="list-disc pl-6 mb-4">
						<li>Set clear targets for both selling and buying back</li>
						<li>Be patient - good premium opportunities may take time</li>
						<li>Consider splitting your stack into multiple tranches</li>
						<li>Document your strategy reasoning in the notes field</li>
						<li>Review your performance regularly using the summary metrics</li>
						<li>Remember that all trading carries risk - only trade what you can afford to lose</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
					<p className="mb-4">
						This application stores all your trade data in your browser&apos;s localStorage. This means:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<li>Your data remains private and stored only on your device</li>
						<li>Clearing your browser data will erase your trading history</li>
						<li>Consider exporting your data periodically (feature coming soon)</li>
					</ul>
					<p className="text-sm text-fuchsia-300 border-l-4 border-yellow-300 pl-4">
						Warning: The &quot;Clear All Data&quot; button will permanently remove all your recorded trades and cannot be undone.
					</p>
				</section>
			</div>

			<div className="mt-12 border-t pt-8">
				<Link href="/" className="px-4 py-2 bg-orange-300 text-background rounded hover:bg-orange-300/80 inline-block">
					Return to Tracker
				</Link>
			</div>
		</div>
	);
}