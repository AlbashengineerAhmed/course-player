import React from 'react';
import './LeaderboardModal.css';

const LeaderboardModal = ({ isOpen, onClose }) => {
  // Sample leaderboard data
  const leaderboardData = [
    { id: 1, name: 'John Smith', score: 98, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Sarah Johnson', score: 95, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Michael Brown', score: 92, avatar: 'https://randomuser.me/api/portraits/men/68.jpg' },
    { id: 4, name: 'Emily Davis', score: 90, avatar: 'https://randomuser.me/api/portraits/women/17.jpg' },
    { id: 5, name: 'David Wilson', score: 88, avatar: 'https://randomuser.me/api/portraits/men/91.jpg' },
    { id: 6, name: 'Jessica Taylor', score: 85, avatar: 'https://randomuser.me/api/portraits/women/85.jpg' },
    { id: 7, name: 'Robert Martinez', score: 82, avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { id: 8, name: 'Jennifer Anderson', score: 80, avatar: 'https://randomuser.me/api/portraits/women/63.jpg' },
    { id: 9, name: 'William Thomas', score: 78, avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { id: 10, name: 'Lisa Jackson', score: 75, avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
  ];
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container leaderboard-modal">
        <div className="modal-header">
          <h3>Course Leaderboard</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="leaderboard-content">
          <div className="leaderboard-header">
            <div className="rank-header">Rank</div>
            <div className="student-header">Student</div>
            <div className="score-header">Score</div>
          </div>
          
          <div className="leaderboard-list">
            {leaderboardData.map((student, index) => (
              <div key={student.id} className="leaderboard-item">
                <div className="student-rank">
                  {index + 1}
                  {index < 3 && <span className="rank-medal">🏆</span>}
                </div>
                <div className="student-info">
                  <img src={student.avatar} alt={student.name} className="student-avatar" />
                  <span className="student-name">{student.name}</span>
                </div>
                <div className="student-score">{student.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
