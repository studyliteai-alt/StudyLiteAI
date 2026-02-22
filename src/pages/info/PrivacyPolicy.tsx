import { Section } from '../../components/Section';

export const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-cream">
            <Section className="max-w-4xl mx-auto py-32 px-6">
                <div className="mb-16">
                    <span className="text-brandPurple font-bold uppercase tracking-widest text-xs">Legal</span>
                    <h1 className="text-5xl md:text-7xl font-bold mt-6 mb-8">Privacy Policy</h1>
                    <p className="text-brandBlack/40 font-medium">Last updated: February 21, 2026</p>
                </div>

                <div className="prose prose-lg max-w-none space-y-12 text-brandBlack/70 font-medium leading-relaxed">
                    <section>
                        <h2 className="text-3xl font-bold text-brandBlack mb-6">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us when you create an account, upload notes, or communicate with us. This may include your email address, study materials, and usage data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-brandBlack mb-6">2. How We Use Informaton</h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, including training our AI models (anonymized) to better understand student notes and generate more accurate summaries.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-brandBlack mb-6">3. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing and against accidental loss, destruction, or damage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-brandBlack mb-6">4. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal data held by us. You can manage most of these settings directly within your account profile.
                        </p>
                    </section>

                    <section className="pt-12 border-t border-brandBlack/5">
                        <p>If you have any questions about this Privacy Policy, please contact us at privacy@studylite.ai.</p>
                    </section>
                </div>
            </Section>
        </div>
    );
};
