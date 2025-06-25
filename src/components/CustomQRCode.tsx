import { QRCode } from 'react-qrcode-logo';
import logo from '@/assets/MealMatesLogo.webp';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

interface CustomQRCodeProps {
    value: string;
    size?: number;
}

const CustomQRCode = ({ value, size = 200 }: CustomQRCodeProps) => {
    return (
        <Dialog>
            <DialogTrigger>
                <QRCode
                    value={value}
                    logoImage={logo}
                    ecLevel='H'
                    qrStyle='dots'
                    fgColor='#5e1969'
                    logoHeight={50}
                    logoWidth={50}
                    size={size}
                    eyeRadius={[
                        { outer: [50, 0, 0, 0], inner: 50 },
                        { outer: [0, 50, 0, 0], inner: 50 },
                        { outer: [0, 0, 0, 50], inner: 50 }
                    ]}
                />
            </DialogTrigger>
            <DialogContent className="flex items-center justify-center p-8">
                <DialogTitle className="sr-only">Scan the QR Code</DialogTitle>
                <QRCode
                    value={value}
                    logoImage={logo}
                    ecLevel='H'
                    qrStyle='dots'
                    fgColor='#5e1969'
                    logoHeight={50}
                    logoWidth={50}
                    size={Math.min(window.innerWidth - 64, 400)}
                    eyeRadius={[
                        { outer: [50, 0, 0, 0], inner: 50 },
                        { outer: [0, 50, 0, 0], inner: 50 },
                        { outer: [0, 0, 0, 50], inner: 50 }
                    ]}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CustomQRCode;