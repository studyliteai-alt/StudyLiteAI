import { Section } from '../../components/Section';
import { Link } from 'react-router-dom';
import { MagneticButton } from '../../components/MagneticButton';

export const NotFound = () => {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-brandBlack">
            <Section className="max-w-md w-full text-center">
                <div className="text-9xl font-bold italic opacity-10 mb-8 select-none">404</div>
                <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
                <p className="text-brandBlack/60 font-medium mb-12">Oops! This page does not exist.</p>
                <Link to="/">
                    <MagneticButton className="bg-brandBlack text-white px-12 py-4 rounded-full font-bold hover:bg-brandPurple transition-all">
                        Back to Home
                    </MagneticButton>
                </Link>
            </Section>
        </div>
    );
};
