import { motion } from 'framer-motion';
import { BrainCircuit, Loader2, Check, Upload, File as FileIcon, X } from 'lucide-react';
import { WorkspaceStep, ResultTab, StudyData } from './types';
import { useState, useRef } from 'react';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface StudyWorkspaceProps {
    step: WorkspaceStep;
    noteInput: string;
    setNoteInput: (val: string) => void;
    handleProcessNotes: () => void;
    activeResultTab: ResultTab;
    setActiveResultTab: (tab: ResultTab) => void;
    selectedQuizIndex: number | null;
    setSelectedQuizIndex: (idx: number | null) => void;
    studyData: StudyData | null;
    onComplete: () => void;
}

export const StudyWorkspace = ({
    step,
    noteInput,
    setNoteInput,
    handleProcessNotes,
    activeResultTab,
    setActiveResultTab,
    selectedQuizIndex,
    setSelectedQuizIndex,
    studyData,
    onComplete
}: StudyWorkspaceProps) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onStartProcessing = async () => {
        if (selectedFile && user) {
            setUploading(true);
            try {
                const uploadResult = await storageService.uploadFile(user.uid, selectedFile);
                // For now, we'll just prepend a note about the file. 
                // In a real app, you'd send the URL to Gemini's multimodal API.
                setNoteInput(`[Uploaded Document: ${uploadResult.name}]\n\nLink: ${uploadResult.url}\n\n${noteInput}`);
                handleProcessNotes();
            } catch (error) {
                console.error("Upload failed:", error);
                showToast("Upload Failed", "We couldn't upload your file. Please try again.", "error");
            } finally {
                setUploading(false);
            }
        } else {
            handleProcessNotes();
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="workspace-container"
        >
            <div className="workspace-card">
                {step === 'input' && (
                    <div className="workspace-input-area">
                        <h2 className="text-2xl font-black mb-2">Paste your study material</h2>
                        <p className="text-dash-text-muted font-medium mb-4">Paste messy notes, textbook snippets, or upload a document below.</p>

                        <div className="flex gap-4 mb-4">
                            <textarea
                                className="workspace-textarea flex-1 min-h-[200px]"
                                placeholder="Paste your notes here..."
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                            />

                            <div className="flex flex-col gap-3 w-64">
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                                />

                                <div
                                    onClick={handleUploadClick}
                                    className={`file-dropzone flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${selectedFile ? 'border-dash-primary bg-dash-primary/5' : 'border-zinc-200 hover:border-black'}`}
                                >
                                    {selectedFile ? (
                                        <div className="text-center relative">
                                            <FileIcon size={32} className="mx-auto text-dash-primary mb-2" />
                                            <p className="text-xs font-bold truncate max-w-[150px]">{selectedFile.name}</p>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleClearFile(); }}
                                                className="absolute -top-4 -right-4 p-1 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_#000]"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center text-dash-text-muted">
                                            <Upload size={32} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-xs font-bold">Upload PDF/Image</p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-center font-bold text-dash-text-muted uppercase tracking-widest">Optional</p>
                            </div>
                        </div>

                        <button
                            className="action-btn primary py-4 flex items-center justify-center gap-3 disabled:opacity-50"
                            disabled={!noteInput.trim() && !selectedFile}
                            onClick={onStartProcessing}
                        >
                            {uploading ? <Loader2 size={20} className="animate-spin" /> : <BrainCircuit size={20} />}
                            <span>{uploading ? 'Uploading...' : 'Simplify My Notes'}</span>
                        </button>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="processing-view">
                        <div className="brain-pulse">
                            <BrainCircuit size={40} />
                        </div>
                        <h2 className="text-2xl font-black">AI is Processing...</h2>
                        <p className="text-dash-text-muted font-medium max-w-sm">
                            We're simplifying your content, extracting key exam points, and generating a quiz for you.
                        </p>
                        <div className="flex gap-2 mt-4">
                            <Loader2 size={16} className="animate-spin text-dash-primary" />
                            <span className="text-xs font-bold uppercase tracking-widest text-dash-primary">Breaking it down...</span>
                        </div>
                    </div>
                )}

                {step === 'results' && (
                    <div className="results-view animate-fadeIn">
                        <div className="workspace-tabs">
                            {[
                                { id: 'summary', label: 'Summary' },
                                { id: 'exam-points', label: 'Exam Points' },
                                { id: 'quiz', label: 'Quiz Mode' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    className={`tab-btn ${activeResultTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveResultTab(tab.id as ResultTab)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="results-content min-h-[400px]">
                            {activeResultTab === 'summary' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold">Simplified Summary</h3>
                                    <div className="prose font-medium text-zinc-600 space-y-4">
                                        <p>Based on your material, here is the simplified version:</p>
                                        <div className="space-y-4 whitespace-pre-line leading-relaxed">
                                            {studyData?.summary}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeResultTab === 'exam-points' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-dash-primary">Key Exam Points 🎯</h3>
                                    <div className="grid gap-4">
                                        {studyData?.examPoints.map((point, i) => (
                                            <div key={i} className="p-4 border-2 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000]">
                                                <h4 className="font-black text-sm uppercase mb-1">{point.title}</h4>
                                                <p className="text-sm font-medium text-zinc-600">{point.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeResultTab === 'quiz' && (
                                <div className="quiz-interface">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold">Knowledge Check</h3>
                                        <span className="text-xs font-bold bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
                                            {studyData?.quiz.length} Questions
                                        </span>
                                    </div>

                                    {studyData?.quiz.map((q, qIdx) => (
                                        <div key={qIdx} className="quiz-card mb-8">
                                            <p className="font-bold text-lg mb-6">{q.question}</p>
                                            <div className="grid gap-3">
                                                {q.options.map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        className={`quiz-option ${selectedQuizIndex === idx ? 'selected' : ''}`}
                                                        onClick={() => setSelectedQuizIndex(idx)}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        className="action-btn primary w-full py-4 flex items-center justify-center gap-2"
                                        onClick={onComplete}
                                    >
                                        <span>Finish Session</span>
                                        <Check size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
