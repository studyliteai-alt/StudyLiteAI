import { Section } from '../../components/Section';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { PaystackButton } from 'react-paystack';
import { useAuth } from '../../context/AuthContext';

export const Checkout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const config = {
        reference: (new Date()).getTime().toString(),
        email: user?.email || "customer@example.com",
        amount: 300, // $3.00
        publicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    };

    const handlePaystackSuccessAction = (reference: any) => {
        console.log(reference);
        navigate('/success');
    };

    const handlePaystackCloseAction = () => {
        console.log('closed');
    };

    const componentProps = {
        ...config,
        text: 'Pay with Paystack',
        onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
        onClose: handlePaystackCloseAction,
    };
    return (
        <div className="min-h-screen bg-cream p-6 md:p-12 text-brandBlack">
            <Section className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Complete Purchase</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Plan Summary */}
                    <div className="bg-white border-2 border-brandBlack rounded-3xl p-8 shadow-xl">
                        <h2 className="text-xl font-bold mb-6">Plan Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-brandPurple/5 border-2 border-brandPurple/20 rounded-2xl">
                                <div>
                                    <p className="font-bold">Pro Plan</p>
                                    <p className="text-xs opacity-60">Billed monthly</p>
                                </div>
                                <p className="font-bold text-lg">$3.00</p>
                            </div>
                            <div className="pt-4 border-t border-brandBlack/5 flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span>$3.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form (Mock) */}
                    <div className="bg-white border-2 border-brandBlack rounded-3xl p-8 shadow-xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CreditCard className="text-brandGreen" /> Secure Payment
                        </h2>
                        <div className="space-y-6">
                            <div className="p-8 border-2 border-dashed border-brandBlack/10 rounded-2xl text-center bg-slate-50">
                                <p className="text-sm font-bold opacity-40">Payment Gateway Interface</p>
                            </div>
                            <div className="space-y-3">
                                <PaystackButton
                                    {...componentProps}
                                    className="w-full text-center bg-brandBlack text-white py-4 rounded-xl font-bold hover:bg-brandPurple transition-all"
                                />
                                <Link to="/pricing" className="block w-full text-center bg-white border-2 border-brandBlack text-brandBlack py-4 rounded-xl font-bold hover:bg-brandBlack hover:text-white transition-all text-xs">
                                    Cancel & Return
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};
