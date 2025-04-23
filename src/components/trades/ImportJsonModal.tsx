// /components/trades/ImportJsonModal.tsx

import { useState } from 'react';
import { ImportedTradeData } from '@/types';
import { useTradeStore } from '@/store/useTradeStore';
import { Upload, FileText, AlertTriangle, X } from 'lucide-react';

// Import shadcn components
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ImportJsonModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const [jsonContent, setJsonContent] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const importTradeFromJson = useTradeStore((state) => state.importTradeFromJson);

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setFileName(file.name);
		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				setJsonContent(event.target?.result as string);
				setError(null);
			} catch {
				setError('Failed to read file');
			}
		};
		reader.readAsText(file);
	};

	const handleImport = () => {
		try {
			const data = JSON.parse(jsonContent) as ImportedTradeData;
			importTradeFromJson(data);
			resetForm();
			onClose();
		} catch {
			setError('Invalid JSON format');
		}
	};

	const resetForm = () => {
		setJsonContent('');
		setFileName(null);
		setError(null);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px] p-0">
				<DialogHeader className="p-6 pb-2">
					<DialogTitle className="text-xl flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Import Trade from JSON
					</DialogTitle>
					<DialogDescription>
						Upload or paste your trade data in JSON format
					</DialogDescription>
				</DialogHeader>

				<div className="p-6 pt-2 space-y-6">
					<div className="space-y-4">
						<div className="grid w-full items-center gap-1.5">
							<Label htmlFor="file-upload" className="text-sm font-medium">
								Upload JSON File
							</Label>
							<div className="flex flex-col items-center gap-2 w-full">
								<div className="grid flex-1 h-10 w-full">
									<Input
										id="file-upload"
										type="file"
										accept=".json"
										onChange={handleFileUpload}
										className="sr-only"
									/>
									<Label
										htmlFor="file-upload"
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer items-center justify-center hover:bg-accent hover:text-accent-foreground"
									>
										<Upload className="h-4 w-4 mr-2" />
										Select JSON File
									</Label>
								</div>
								{fileName && (
									<div className="flex items-center gap-1 text-sm text-muted-foreground w-full truncate">
										<FileText className="h-3 w-3" />
										<span className="truncate" title={fileName}>{fileName}</span>
										<Button
											variant="ghost"
											size="sm"
											className="h-5 w-5 p-0"
											onClick={() => {
												setFileName(null);
												setJsonContent('');
											}}
										>
											<X className="h-3 w-3" />
										</Button>
									</div>
								)}
							</div>
						</div>

						<div className="grid gap-1.5">
							<Label htmlFor="json-content" className="text-sm font-medium">
								Or paste JSON content
							</Label>
							<Textarea
								id="json-content"
								value={jsonContent}
								onChange={(e) => {
									setJsonContent(e.target.value);
									if (error) setError(null);
								}}
								className="min-h-[150px] max-h-[400px] font-mono text-sm"
								placeholder='{"coordinator": "Temple of Sats", "trades": [...], ...}'
							/>
						</div>

						{error && (
							<Alert variant="destructive" className="py-2">
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription className="ml-2">{error}</AlertDescription>
							</Alert>
						)}
					</div>
				</div>

				<DialogFooter className="p-6 pt-2">
					<div className="flex justify-between w-full">
						<Button variant="outline" onClick={handleClose}>
							Cancel
						</Button>
						<Button
							onClick={handleImport}
							disabled={!jsonContent}
							className="bg-blue-300 hover:bg-blue-300/80"
						>
							Import Data
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ImportJsonModal;