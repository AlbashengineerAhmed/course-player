import React, { useState } from 'react';
import './Comments.css';

const Comments = ({ comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      name: 'Student Name Goes Here',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      text: newComment,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    };
    
    setComments([...comments, comment]);
    setNewComment('');
    
    // Save to localStorage
    const savedComments = JSON.parse(localStorage.getItem('courseComments') || '[]');
    localStorage.setItem('courseComments', JSON.stringify([...savedComments, comment]));
  };

  return (
    <div className="comments-section">
      <h2 className="comments-title">Comments</h2>
      
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-avatar">
              <img src={comment.avatar} alt={comment.name} />
            </div>
            <div className="comment-content">
              <div className="comment-header">
                <h4 className="comment-name">{comment.name}</h4>
                <span className="comment-date">{comment.date}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          className="comment-input"
          placeholder="Write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button type="submit" className="submit-button">
          Submit Review <i className="fas fa-arrow-right"></i>
        </button>
      </form>
    </div>
  );
};

export default Comments;
