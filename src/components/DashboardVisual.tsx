export const DashboardVisual = () => {
    return (
        <div className="relative bg-white rounded-3xl border-4 border-brandBlack shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden aspect-[16/10] flex items-center justify-center p-8 hover-lift hover-glow transition-all">
            <div className="w-full h-full bg-slate-50 rounded-xl border-2 border-slate-200 flex overflow-hidden">
                <aside className="w-20 border-r border-slate-200 p-4 space-y-6">
                    <div className="w-full aspect-square bg-slate-200 rounded-lg"></div>
                    <div className="w-full aspect-square bg-slate-200 rounded-lg"></div>
                    <div className="w-full aspect-square bg-slate-200 rounded-lg"></div>
                </aside>
                <main className="flex-1 p-8">
                    <div className="grid grid-cols-4 gap-6 h-full">
                        <div className="col-span-3 space-y-6">
                            <div className="h-12 bg-slate-100 rounded-lg w-1/3"></div>
                            <div className="grid grid-cols-7 gap-4 h-64">
                                {[...Array(28)].map((_, i) => (
                                    <div key={i} className="bg-white border border-slate-200 rounded-lg p-2">
                                        <div className="h-2 w-4 bg-slate-100 rounded"></div>
                                    </div>
                                ))}
                                {/* Sample Post Cards */}
                                <div className="bg-brandPurple/20 border-2 border-brandPurple rounded-lg p-3 relative transform rotate-1">
                                    <div className="h-2 w-12 bg-brandPurple rounded mb-2"></div>
                                    <div className="h-16 bg-white/50 rounded"></div>
                                </div>
                                <div className="bg-brandYellow/20 border-2 border-brandYellow rounded-lg p-3 relative -translate-y-4">
                                    <div className="h-2 w-12 bg-brandYellow rounded mb-2"></div>
                                    <div className="h-16 bg-white/50 rounded"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 border-l border-slate-200 p-6 space-y-6">
                            <div className="h-8 bg-slate-200 rounded w-full"></div>
                            <div className="space-y-4">
                                <div className="h-20 bg-white rounded-lg border border-slate-200"></div>
                                <div className="h-20 bg-white rounded-lg border border-slate-200"></div>
                                <div className="h-20 bg-white rounded-lg border border-slate-200"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
