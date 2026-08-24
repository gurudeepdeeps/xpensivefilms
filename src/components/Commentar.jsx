import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import PropTypes from 'prop-types'; 
import { supabase } from '../supabase'; 
import { UserCircle2, Loader2, AlertCircle, Send } from 'lucide-react'; 
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import AOS from "aos"; 
import "aos/dist/aos.css"; 

const Comment = memo(({ comment, formatDate }) => ( 
    <div className="px-4 pt-4 pb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5"> 
        <div className="flex items-start gap-3"> 
            <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                <UserCircle2 className="w-5 h-5" />
            </div> 
            <div className="flex-grow min-w-0"> 
                <div className="flex items-center justify-between gap-4 mb-2"> 
                    <h4 className="font-medium text-white truncate">{comment.userName || comment.username || 'Anonymous'}</h4> 
                    <span className="text-xs text-gray-400 whitespace-nowrap"> 
                        {formatDate(comment.created_at || comment.createdAt)} 
                    </span> 
                </div> 
                <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">{comment.content}</p> 
            </div> 
        </div> 
    </div> 
)); 

Comment.propTypes = {
    comment: PropTypes.shape({
        userName: PropTypes.string,
        username: PropTypes.string,
        created_at: PropTypes.any,
        createdAt: PropTypes.any,
        content: PropTypes.string.isRequired,
    }).isRequired,
    formatDate: PropTypes.func.isRequired,
};
Comment.displayName = 'Comment';

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState(''); 
    const textareaRef = useRef(null); 

    const handleTextareaChange = useCallback((e) => { 
        setNewComment(e.target.value); 
        if (textareaRef.current) { 
            textareaRef.current.style.height = 'auto'; 
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
        } 
    }, []); 

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;
        
        onSubmit({ newComment, userName });
        setNewComment('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, onSubmit]); 

    return ( 
        <form onSubmit={handleSubmit} className="space-y-6"> 
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000"> 
                <label className="block text-sm font-medium text-white"> 
                    Name <span className="text-red-400">*</span> 
                </label> 
                <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                    placeholder="Enter your name" 
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                    required 
                /> 
            </div> 

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200"> 
                <label className="block text-sm font-medium text-white"> 
                    Message <span className="text-red-400">*</span> 
                </label> 
                <textarea 
                    ref={textareaRef} 
                    value={newComment} 
                    onChange={handleTextareaChange} 
                    placeholder="Write your message here..." 
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[120px]" 
                    required 
                /> 
            </div> 

            {error && (
                <Alert variant="destructive" data-aos="fade-up" data-aos-duration="1600">
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1800"
            >
                {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Send className="w-5 h-5" />
                )}
                {isSubmitting ? 'Submitting...' : 'Submit Comment'}
            </button>
        </form>
    );
});

CommentForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    error: PropTypes.string,
};
CommentForm.displayName = 'CommentForm';

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const fetchComments = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase fetch comments error:", error);
            } else if (data) {
                setComments(data);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchComments();

        // Subscribe to realtime Supabase changes
        const channel = supabase
            .channel('public:comments')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
                fetchComments();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchComments]);

    const handleSubmitComment = async ({ newComment, userName }) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const { error: insertError } = await supabase
                .from('comments')
                .insert([
                    {
                        content: newComment,
                        userName: userName,
                        created_at: new Date().toISOString(),
                    }
                ]);

            if (insertError) {
                console.error("Supabase insert error:", insertError);
                setError("Failed to submit comment. Please try again.");
            } else {
                fetchComments();
            }
        } catch (e) {
            console.error("Error submitting comment:", e);
            setError("Failed to submit comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (input) => {
        if (!input) return 'Just now';
        const date = new Date(input);
        if (isNaN(date.getTime())) return 'Just now';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <section id="comment" className="py-2 bg-transparent w-full">
            <div className="w-full mx-auto px-1 sm:px-4">
                <h2 
                    className="text-3xl sm:text-4xl font-bold text-center text-white mb-8"
                    data-aos="fade-up"
                    data-aos-duration="800"
                >
                    <span className="relative inline-block">
                        Comments
                        <span className="absolute inset-x-0 bottom-0 h-2 bg-indigo-600 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
                    </span>
                </h2>

                <div className="w-full mx-auto bg-transparent border-0 p-0 shadow-none">
                    <h3 className="text-xl font-semibold text-white mb-4">Leave a Comment</h3>
                    <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} error={error} />
                </div>

                <div className="max-w-3xl mx-auto mt-12 space-y-6">
                    {comments.length === 0 ? (
                        <p className="text-center text-gray-400 text-lg" data-aos="fade-up" data-aos-duration="1000">
                            No comments yet. Be the first to leave one!
                        </p>
                    ) : (
                        comments.map((comment, index) => (
                            <Comment 
                                key={comment.id || index} 
                                comment={comment} 
                                formatDate={formatDate}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default Komentar;
