import React from 'react';
import './CustomContainer.css';

/**
 * CustomContainer component that provides a wider layout for the course player
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render inside the container
 * @returns {JSX.Element} The rendered component
 */
const CustomContainer = ({ children }) => {
  return (
    <div className="custom-container">
      {children}
    </div>
  );
};

export default CustomContainer;
