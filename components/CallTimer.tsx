import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { tw } from '../utils/tailwind';

interface CallTimerProps {
  startTime?: Date;
  textStyle?: any;
}

const CallTimer: React.FC<CallTimerProps> = ({ startTime, textStyle }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (startTime) {
      setDuration(0);
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Text style={[tw`text-white text-lg`, textStyle]}>
      {startTime ? formatTime(duration) : '00:00'}
    </Text>
  );
};

export default CallTimer;