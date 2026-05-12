import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import PropTypes from 'prop-types'; 
 import { addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'; 
 import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
 import { db, storage } from '../firebase-comment'; 
 import { UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X } from 'lucide-react'; 
 import AOS from "aos"; 
 import "aos/dist/aos.css"; 
 
 const Comment = memo(({ comment, formatDate }) => ( 
     <div 
         className="px-4 pt-4 pb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5" 
         
     > 
         <div className="flex items-start gap-3"> 
             
                 <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                     <UserCircle2 className="w-5 h-5" />
                 </div> 
             <div className="flex-grow min-w-0"> 
                 <div className="flex items-center justify-between gap-4 mb-2"> 
                     <h4 className="font-medium text-white truncate">{comment.userName}</h4> 
                     <span className="text-xs text-gray-400 whitespace-nowrap"> 
                         {formatDate(comment.createdAt)} 
                     </span> 
                 </div> 
                 <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">{comment.content}</p> 
             </div> 
         </div> 
     </div> 
 )); 
 
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
                 <div className="flex items-center gap-2 text-red-400 text-sm" data-aos="fade-up" data-aos-duration="1600">
                     <AlertCircle className="w-4 h-4" />
                     <span>{error}</span>
                 </div>
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
 
 Comment.propTypes = {
     comment: PropTypes.shape({
         userName: PropTypes.string.isRequired,
        createdAt: PropTypes.any,
        createdAtMs: PropTypes.number,
         content: PropTypes.string.isRequired,
     }).isRequired,
     formatDate: PropTypes.func.isRequired,
 };
 Comment.displayName = 'Comment';
 
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
 
     useEffect(() => {
         const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
         const unsubscribe = onSnapshot(q, (snapshot) => {
             const commentsData = snapshot.docs.map(doc => ({
                 id: doc.id,
                 ...doc.data()
             }));
             setComments(commentsData);
         });
 
         return () => unsubscribe();
     }, []);
 

 
     const handleSubmitComment = async ({ newComment, userName }) => {
         setIsSubmitting(true);
         setError(null);
         try {

             await addDoc(collection(db, 'comments'), {
                 content: newComment,
                 userName,

                createdAt: serverTimestamp(),
                createdAtMs: Date.now(),
             });
         } catch (e) {
             console.error("Error adding document: ", e);
             setError("Failed to submit comment. Please try again.");
         } finally {
             setIsSubmitting(false);
         }
     };

    const formatDate = (input) => {
        let date;
        if (!input) {
            return 'Just now';
        }
        if (typeof input === 'object' && input.createdAt) {
            const ts = input.createdAt;
            if (ts && typeof ts.toDate === 'function') {
                date = ts.toDate();
            } else if (typeof ts === 'object' && 'seconds' in ts) {
                date = new Date(ts.seconds * 1000);
            } else if (typeof input.createdAtMs === 'number') {
                date = new Date(input.createdAtMs);
            }
        } else if (typeof input === 'object' && typeof input.toDate === 'function') {
            date = input.toDate();
        } else if (typeof input === 'object' && 'seconds' in input) {
            date = new Date(input.seconds * 1000);
        } else if (typeof input === 'number') {
            date = new Date(input);
        } else if (typeof input === 'string') {
            date = new Date(input);
        }
        if (!date || isNaN(date.getTime())) {
            return 'Just now';
        }
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / (1000 * 60));
        const diffHr = Math.floor(diffMs / (1000 * 60 * 60));
        const sameDay = now.toDateString() === date.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = yesterday.toDateString() === date.toDateString();
        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (sameDay) return `Today, ${timeStr}`;
        if (isYesterday) return `Yesterday, ${timeStr}`;
        return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };
 
     return (
         <section id="comment" className="py-20 bg-gray-900">
             <div className="container mx-auto px-4">
                 <h2 className="text-4xl font-bold text-center text-white mb-12" data-aos="fade-up" data-aos-duration="800">
                     <span className="relative inline-block">
                         Comments
                         <span className="absolute inset-x-0 bottom-0 h-2 bg-indigo-600 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
                     </span>
                 </h2>
 
                 <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-2xl shadow-lg p-8 border border-gray-700/50">
                     <h3 className="text-2xl font-semibold text-white mb-6">Leave a Comment</h3>
                     <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} error={error} />
                 </div>
 
                 <div className="max-w-3xl mx-auto mt-12 space-y-6">
                     {comments.length === 0 ? (
                         <p className="text-center text-gray-400 text-lg" data-aos="fade-up" data-aos-duration="1000">
                             No comments yet. Be the first to leave one!
                         </p>
                     ) : (
                         comments.map((comment, index) => (
                            <Comment key={comment.id} comment={comment} formatDate={formatDate} index={index} />
                         ))
                     )}
                 </div>
             </div>
         </section>
     );
 };
 
 Komentar.displayName = 'Komentar';
 
 export default Komentar;
