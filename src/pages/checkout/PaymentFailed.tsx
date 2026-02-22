import { Section } from '../../components/Section';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MagneticButton } from '../../components/MagneticButton';

export const PaymentFailed = () => {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-brandBlack">
            <Section className="max-w-md w-full bg-white border-2 border-brandBlack rounded-[40px] p-12 text-center shadow-xl">
                <div className="w-20 h-20 bg-brandPink rounded-full border-2 border-brandBlack flex items-center justify-center mx-auto mb-8">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
                <p className="text-brandBlack/60 font-medium mb-12">Something went wrong with your transaction. Please try again.</p>
                <div className="space-y-4">
                    <Link to="/checkout">
                        <MagneticButton className="w-full bg-brandBlack text-white py-4 rounded-xl font-bold hover:bg-brandPurple transition-all">
                            Try Again
                        </MagneticButton>
                    </Link>
                    <Link to="/pricing" className="block text-sm font-bold opacity-40 hover:opacity-100 hover:text-brandPurple transition-all">
                        Back to Pricing
                    </Link>
                </div>
            </Section>
        </div>
    );
};
