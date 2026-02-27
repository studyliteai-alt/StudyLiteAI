import { Section } from './Section';
import { Check } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { Link } from 'react-router-dom';

export const PricingSection = () => {
    const plans = [
        {
            id: 'free',
            name: 'Lite (Free)',
            price: 'Free',
            desc: 'Essential AI help for everyday students.',
            features: ['5 AI sessions / day', 'Basic AI summaries', 'Standard quizzes', 'Low data mode'],
            color: 'bg-white',
            btnColor: 'bg-brandBlack text-white',
            cta: 'Start Free'
        },
        {
            id: 'pro',
            name: 'Pro Mastery',
            price: '₦1,500',
            period: '/month',
            desc: 'Unlock deeper insights and infinite study.',
            features: ['Unlimited AI sessions', 'Advanced concept links', 'Mastery analytics', 'Study history', 'Faster AI priority'],
            color: 'bg-brandPurple/10 border-brandPurple',
            btnColor: 'bg-brandPurple text-white',
            cta: 'Join Pro',
            popular: true
        },
        {
            id: 'plus',
            name: 'Plus +',
            price: '₦3,000',
            period: '/month',
            desc: 'The ultimate power-up for elite academic performance.',
            features: ['Everything in Pro', 'PDF & Doc uploads', 'Custom flashcard sets', 'Priority support', 'Early access to Labs'],
            color: 'bg-brandYellow/10 border-brandYellow',
            btnColor: 'bg-brandYellow text-brandBlack',
            cta: 'Get Plus'
        }
    ];

    return (
        <Section id="pricing" className="bg-cream py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <span className="text-brandPurple font-bold uppercase tracking-widest text-xs">Pricing Plans</span>
                    <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-4">Choose Your Plan</h2>
                    <p className="text-lg text-brandBlack/60 font-bold italic">Flexible plans for every student.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div key={i} className={`relative p-8 rounded-[40px] border-4 border-brandBlack shadow-[12px_12px_0px_0px_rgba(24,24,27,1)] flex flex-col ${plan.color} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all`}>
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brandPurple text-white px-4 py-1 rounded-full text-xs font-bold border-2 border-brandBlack">
                                    MOST POPULAR
                                </span>
                            )}
                            <div className="mb-8">
                                <h3 className="text-2xl font-black uppercase mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold italic">{plan.price}</span>
                                    {plan.period && <span className="text-sm font-bold opacity-40 uppercase">{plan.period}</span>}
                                </div>
                                <p className="text-sm font-medium opacity-60 mt-2">{plan.desc}</p>
                            </div>

                            <ul className="space-y-4 mb-12 flex-1">
                                {plan.features.map((feature, fi) => (
                                    <li key={fi} className="flex items-center gap-3 text-sm font-bold">
                                        <div className="w-5 h-5 rounded-full bg-brandGreen/20 flex items-center justify-center border border-brandGreen/30">
                                            <Check className="w-3 h-3 text-brandGreen" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link to={`/checkout?plan=${plan.id}`} className="mt-auto">
                                <MagneticButton className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest border-2 border-brandBlack transition-all ${plan.btnColor}`}>
                                    {plan.cta}
                                </MagneticButton>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
