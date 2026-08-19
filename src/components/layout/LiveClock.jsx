import React, { useState, useEffect } from 'react';

const LiveClock = ({ className = '' }) => {
  const [time, setTime] = useState(() => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`font-mono text-sm font-semibold tracking-tight text-slate-800 select-none ${className}`}>
      {time}
    </div>
  );
};

export default LiveClock;
