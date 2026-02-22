import { Hero } from '../components/Hero';
import { Section } from '../components/Section';
import { DashboardVisual } from '../components/DashboardVisual';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorks } from '../components/HowItWorks';
import { ProblemSection } from '../components/ProblemSection';
import { StudyHistoryInfo } from '../components/StudyHistoryInfo';
import { Testimonials } from '../components/Testimonials';
import { TeamSection } from '../components/TeamSection';
import { PricingSection } from '../components/PricingSection';
import { AboutSection } from '../components/AboutSection';
import { ContactSection } from '../components/ContactSection';
import { Link } from 'react-router-dom';
import { MagneticButton } from '../components/MagneticButton';

export const LandingPage = () => {
    return (
        <main className="overflow-x-clip">
            <Hero />

            {/* Main Dashboard Visual */}
            <Section className="max-w-6xl mx-auto px-6 pb-40">
                <DashboardVisual />
            </Section>

            <ProblemSection />

            <AboutSection />

            <HowItWorks />

            <FeaturesSection />

            <PricingSection />

            <StudyHistoryInfo />

            <Testimonials />

            <TeamSection />

            <ContactSection />

            {/* Final CTA */}
            <Section className="py-40 bg-brandYellow border-y-4 border-brandBlack shadow-[0_-20px_0px_0px_rgba(0,0,0,0.1)]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight italic uppercase tracking-tighter">
                        Ready to level up?
                    </h2>
                    <p className="text-lg md:text-xl text-brandBlack/60 mb-10 font-bold max-w-2xl mx-auto">
                        Join 250,000+ students mastering their subjects faster than ever.
                    </p>
                    <Link to="/signup">
                        <MagneticButton className="bg-brandBlack text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-brandPurple transition-all transform hover:scale-110 shadow-xl">
                            Create Free Account
                        </MagneticButton>
                    </Link>
                </div>
            </Section>
        </main>
    );
};
