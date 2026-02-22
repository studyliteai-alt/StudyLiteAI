export const ResetPassword = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cream px-6">
            <div className="max-w-md w-full bg-white rounded-3xl border-2 border-brandBlack p-8 shadow-xl">
                <h2 className="text-3xl font-bold mb-8 text-center text-brandBlack">Reset Password</h2>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">New Password</label>
                        <input type="password" required className="w-full px-4 py-3 rounded-xl border-2 border-brandBlack/10 focus:border-brandPurple outline-none transition-all" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Confirm Password</label>
                        <input type="password" required className="w-full px-4 py-3 rounded-xl border-2 border-brandBlack/10 focus:border-brandPurple outline-none transition-all" placeholder="••••••••" />
                    </div>
                    <button className="w-full bg-brandBlack text-white py-4 rounded-xl font-bold hover:bg-brandPurple transition-all">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};
