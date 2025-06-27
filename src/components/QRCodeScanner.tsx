import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";


const QRCodeScanner = ({ onScan }: { onScan: (value: string) => void }) => {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <Dialog>
            <DialogTrigger>
                <div className="bg-purple-dark hover:bg-purple-dark/90 text-white p-4 cursor-pointer rounded-lg" onClick={() => setIsLoading(true)}>Scanner le QR Code</div>
            </DialogTrigger>
            <DialogContent className="flex items-center justify-center p-8">
                <DialogTitle className="sr-only">Scan the QR Code</DialogTitle>
                <DialogDescription className="sr-only">
                    Utilisez l'appareil photo de votre appareil pour scanner un code QR
                </DialogDescription>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-dark"></div>
                    </div>
                )}
                <div className={cn("flex items-center justify-center", isLoading ? "opacity-50 pointer-events-none" : "")}>
                    <BarcodeScanner
                        width={1000}
                        height={1000}
                        onUpdate={(_, result) => {
                            if (isLoading) setIsLoading(false);
                            if (result) {
                                onScan(result.getText());
                            }
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default QRCodeScanner;