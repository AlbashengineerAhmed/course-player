import React from 'react';
import VideoItem from './VideoItem';
import './VideoList.css';

const VideoList = ({ videos, onVideoSelect, watchedVideos, selectedVideoId }) => {
  return (
    <div className="video-list">
      {videos.map(video => (
        <VideoItem 
          key={video.id} 
          video={video} 
          onVideoSelect={onVideoSelect} 
          isWatched={watchedVideos[video.id]} 
          isSelected={video.id === selectedVideoId}
        />
      ))}
    </div>
  );
};

export default VideoList;
