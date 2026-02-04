import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { mockPurchaseTicket } from "@/lib/api";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const MockPaymentModal = ({ isOpen, onClose, ticketTypeId, amount, eventId }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState('FORM'); // FORM, PROCESSING, SUCCESS
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiry: '',
        cvc: '',
        name: ''
    });
    const [error, setError] = useState('');

    const handleFormatCardNumber = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        setFormData({ ...formData, cardNumber: formatted });
    };

    const handleFormatExpiry = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
        setFormData({ ...formData, expiry: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.cardNumber.length < 19 || formData.cvc.length < 3 || !formData.name) {
            setError("Please fill in all details correctly.");
            return;
        }

        setStep('PROCESSING');

        // Simulate network delay
        setTimeout(async () => {
            try {
                await mockPurchaseTicket(auth.user.access_token, ticketTypeId);
                setStep('SUCCESS');
                setTimeout(() => {
                    navigate('/dashboard/tickets');
                    onClose();
                }, 2000);
            } catch (err) {
                setError(err.message || "Payment Failed");
                setStep('FORM');
            }
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white text-black">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-green-600" />
                        Secure Payment Gateway
                    </DialogTitle>
                </DialogHeader>

                {step === 'FORM' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-gray-100 p-4 rounded-md mb-4">
                            <div className="text-sm text-gray-500">Total Amount</div>
                            <div className="text-2xl font-bold">₹{amount}</div>
                        </div>

                        <div className="space-y-2">
                            <Label>Card Number</Label>
                            <div className="relative">
                                <Input
                                    value={formData.cardNumber}
                                    onChange={handleFormatCardNumber}
                                    placeholder="0000 0000 0000 0000"
                                    className="pl-10"
                                />
                                <div className="absolute left-3 top-2.5 text-gray-400">💳</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Expiry Date</Label>
                                <Input
                                    value={formData.expiry}
                                    onChange={handleFormatExpiry}
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>CVC</Label>
                                <Input
                                    value={formData.cvc}
                                    maxLength={3}
                                    onChange={(e) => setFormData({ ...formData, cvc: e.target.value.replace(/\D/g, '') })}
                                    placeholder="123"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Cardholder Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                            Pay ₹{amount}
                        </Button>

                        <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" /> Encrypted & Secure
                        </div>
                    </form>
                )}

                {step === 'PROCESSING' && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        <p className="text-lg font-medium">Processing Transaction...</p>
                        <p className="text-sm text-gray-500">Please do not close this window</p>
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in" />
                        <div className="text-center">
                            <p className="text-xl font-bold text-green-600">Payment Approved!</p>
                            <p className="text-gray-500">Redirecting to your tickets...</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MockPaymentModal;
