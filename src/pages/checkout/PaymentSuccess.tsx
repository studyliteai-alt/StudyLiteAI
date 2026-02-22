import { Section } from '../../components/Section';
import { PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MagneticButton } from '../../components/MagneticButton';

export const PaymentSuccess = () => {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6">
            <Section className="max-w-md w-full bg-white border-2 border-brandBlack rounded-[40px] p-12 text-center shadow-xl">
                <div className="w-20 h-20 bg-brandGreen rounded-full border-2 border-brandBlack flex items-center justify-center mx-auto mb-8 animate-wiggle">
                    <PartyPopper className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
                <p className="text-brandBlack/60 font-medium mb-12">Your account has been upgraded to Pro. You now have unlimited access to all features.</p>
                <Link to="/">
                    <MagneticButton className="w-full bg-brandBlack text-white py-4 rounded-xl font-bold hover:bg-brandPurple transition-all">
                        Back to Home
                    </MagneticButton>
                </Link>
            </Section>
        </div>
    );
};
