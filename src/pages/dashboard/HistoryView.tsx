import { useEffect, useState } from 'react';
import {
    History as HistoryIcon,
    Search,
    FileBox,
    ExternalLink,
    Clock,
    BookOpen,
    Calendar,
    Layers
} from 'lucide-react';
import { studyService } from '../../services/studyService';
import { quizService } from '../../services/quizService';
import { format } from 'date-fns';

export const HistoryView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [vaultItems, setVaultItems] = useState<any[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [projects, quizzes, settings] = await Promise.all([
                    studyService.getProjects(),
                    quizService.getQuizHistory(),
                    studyService.getSettings()
                ]);

                if (settings?.recent_searches) {
                    setRecentSearches(settings.recent_searches);
                }

                // Merge and sort by date
                const items = [
                    ...projects.map(p => ({
                        id: p.id,
                        name: p.name,
                        date: p.created_at,
                        type: 'Project',
                        score: '-',
                        icon: FileBox,
                        color: 'bg-amber-50',
                        iconColor: 'text-amber-600'
                    })),
                    ...quizzes.map(q => ({
                        id: q.id,
                        name: q.topic,
                        date: q.created_at,
                        type: 'Quiz',
                        score: `${Math.round((q.score / q.total_questions) * 100)}%`,
                        icon: BookOpen,
                        color: 'bg-indigo-50',
                        iconColor: 'text-indigo-600'
                    }))
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setVaultItems(items);
            } catch (err) {
                console.error('Error fetching vault history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.trim()) {
            try {
                const updated = await studyService.updateRecentSearches(term);
                if (updated) setRecentSearches(updated);
            } catch (err) {
                console.error('Search Save Error:', err);
            }
        }
    };

    const filteredItems = vaultItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-[#1A1A1A]">Vault</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Your personal intelligence archive</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative group flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brandPurple transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your archive..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onBlur={() => handleSearch(searchTerm)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {recentSearches.length > 0 && (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brandBlack/30">Recent Searches:</p>
                    <div className="flex gap-2">
                        {recentSearches.map((search, i) => (
                            <button
                                key={i}
                                onClick={() => setSearchTerm(search)}
                                className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] font-bold text-brandBlack/60 hover:border-brandPurple hover:text-brandPurple transition-all"
                            >
                                {search}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-20 italic text-gray-400 animate-pulse font-bold">Accessing secure archives...</div>
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm group hover:shadow-xl hover:shadow-black/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 ${item.color} rounded-[24px] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-xl font-black italic text-[#1A1A1A] group-hover:text-brandPurple transition-colors leading-tight">{item.name}</h3>
                                    <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg"><Calendar size={12} /> {format(new Date(item.date), 'MMM d, yyyy')}</span>
                                        <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg"><Clock size={12} /> {item.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10">
                                {item.score !== '-' && (
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mb-0.5 whitespace-nowrap">Performance</p>
                                        <p className="text-xl font-black text-brandPurple tracking-tighter">{item.score}</p>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <button className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest text-[#1A1A1A] hover:bg-white hover:shadow-lg transition-all active:scale-95 whitespace-nowrap">
                                        REVISIT
                                    </button>
                                    <button className="p-3 bg-[#1A1A1A] text-white rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg shadow-black/10">
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-[32px] p-20 border border-gray-100 border-dashed text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <Layers size={32} />
                        </div>
                        <p className="text-gray-400 font-bold italic">No records found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Growth Card */}
            <div className="bg-indigo-50 rounded-[48px] p-12 text-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group border border-indigo-100">
                <div className="space-y-6 relative z-10 max-w-xl">
                    <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center mb-8 shadow-xl shadow-black/5 group-hover:rotate-6 transition-transform border border-indigo-100">
                        <HistoryIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter leading-tight">Your cognitive growth is accelerating.</h2>
                    <p className="text-sm font-bold text-indigo-900/40 uppercase tracking-widest">
                        {vaultItems.length} sessions completed in your specialized learning vault.
                    </p>
                    <button className="bg-[#1A1A1A] text-white px-10 py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 transition-all">
                        VIEW PROGRESS
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/60 transition-colors"></div>
            </div>
        </div>
    );
};
