import { Section } from '../../components/Section';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
import { PaystackButton } from 'react-paystack';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

// Security: All plan amounts are defined server-side in Cloud Functions.
// The plan key here is only used for UI display and passed to the function
// as a lookup key — the amount and status are always validated server-side.
const PLANS: Record<string, { name: string; price: string; amount: number }> = {
    'pro': { name: 'Pro Mastery', price: '1,500', amount: 150000 },  // in kobo
    'plus': { name: 'Plus +', price: '3,000', amount: 300000 },
};

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

export const Checkout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryParams = new URLSearchParams(location.search);
    const planParam = queryParams.get('plan') || 'pro';
    const selectedPlan = PLANS[planParam] ?? PLANS['pro'];

    if (!user) { navigate('/login'); return null; }

    const config = {
        // Timestamp reference is unique per attempt; Cloud Function validates it with Paystack
        reference: `order_${user.uid}_${Date.now()}`,
        email: user.email || '',
        amount: selectedPlan.amount,
        publicKey: PAYSTACK_PUBLIC_KEY,
    };

    const handlePaystackSuccess = async (result: any) => {
        const reference = result?.reference;
        if (!reference) { setError('No payment reference received. Please contact support.'); return; }

        setVerifying(true);
        setError(null);

        try {
            // Call the Cloud Function — it verifies the payment with Paystack
            // and updates Firestore subscriptionStatus = 'pro' if successful.
            const { getApp } = await import('firebase/app');
            const { getFunctions: getFirebaseFunctions, httpsCallable } = await import('firebase/functions');
            const fnApp = getApp();
            const functions = getFirebaseFunctions(fnApp);
            const verifyPayment = httpsCallable<
                { reference: string; plan: string },
                { success: boolean; message: string }
            >(functions, 'verifyPaystackPayment');

            const response = await verifyPayment({ reference, plan: planParam });

            if (response.data.success) {
                navigate('/success');
            } else {
                setError('Payment could not be verified. Please contact support.');
            }
        } catch (err: any) {
            console.error('[Checkout] Verification error:', err);
            setError(err?.message || 'Verification failed. If you were charged, contact support with your reference.');
        } finally {
            setVerifying(false);
        }
    };

    const componentProps = {
        ...config,
        text: 'Pay Securely with Paystack',
        onSuccess: handlePaystackSuccess,
        onClose: () => { /* User dismissed modal — no action needed */ },
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
                                    <p className="font-bold">{selectedPlan.name}</p>
                                    <p className="text-xs opacity-60">Billed monthly</p>
                                </div>
                                <p className="font-bold text-lg">₦{selectedPlan.price}</p>
                            </div>
                            <div className="pt-4 border-t border-brandBlack/5 flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span>₦{selectedPlan.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white border-2 border-brandBlack rounded-3xl p-8 shadow-xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CreditCard className="text-brandGreen" /> Secure Payment
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs text-brandBlack/50 font-bold p-3 bg-green-50 border border-green-100 rounded-xl">
                                <ShieldCheck size={16} className="text-green-500 flex-shrink-0" />
                                Your payment is processed securely by Paystack. We never store your card details.
                            </div>

                            {/* Error state */}
                            {error && (
                                <div className="flex items-start gap-2 text-sm text-red-700 font-medium p-3 bg-red-50 border border-red-100 rounded-xl">
                                    <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                    {error}
                                </div>
                            )}

                            {/* Verifying state */}
                            {verifying ? (
                                <div className="w-full flex items-center justify-center gap-3 py-4 bg-brandBlack/5 rounded-xl font-bold text-brandBlack/60">
                                    <Loader2 size={18} className="animate-spin" />
                                    Confirming your payment…
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {!PAYSTACK_PUBLIC_KEY ? (
                                        <p className="text-red-500 text-sm font-bold text-center p-4 bg-red-50 border border-red-100 rounded-xl">
                                            Payment gateway is not configured. Please contact support.
                                        </p>
                                    ) : (
                                        <PaystackButton
                                            {...componentProps}
                                            className="w-full text-center bg-brandBlack text-white py-4 rounded-xl font-bold hover:bg-brandPurple transition-all"
                                        />
                                    )}
                                    <Link
                                        to="/pricing"
                                        className="block w-full text-center bg-white border-2 border-brandBlack text-brandBlack py-4 rounded-xl font-bold hover:bg-brandBlack hover:text-white transition-all text-xs"
                                    >
                                        Cancel &amp; Return
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};
