import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cream px-6">
            <div className="max-w-md w-full bg-white rounded-3xl border-2 border-brandBlack p-8 shadow-xl text-center">
                <h2 className="text-3xl font-bold mb-4 text-brandBlack">Forgot Password</h2>
                <p className="text-brandBlack/60 mb-8 font-medium">Enter your email to reset your password.</p>
                <form className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl border-2 border-brandBlack/10 focus:border-brandPurple outline-none transition-all" placeholder="john@example.com" />
                    </div>
                    <button className="w-full bg-brandBlack text-white py-4 rounded-xl font-bold hover:bg-brandPurple transition-all">
                        Send Reset Link
                    </button>
                </form>
                <p className="mt-8 text-sm text-brandBlack/60">
                    Remember your password? <Link to="/login" className="text-brandPurple font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};
