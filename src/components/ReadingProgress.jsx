import { useState, useEffect } from 'react';

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setProgress(Number((currentScroll / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div 
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        backgroundColor: 'var(--text-ink)',
        width: `${progress}%`,
        transition: 'width 0.1s ease-out'
      }}
    />
  );
};

export default ReadingProgress;
