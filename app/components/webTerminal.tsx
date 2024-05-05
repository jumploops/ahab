import React, { useState, useEffect, useRef } from 'react';

const cursorBlinkAnimation = `@keyframes cursorBlink { 
  0% { opacity: 0; } 
  50% { opacity: 1; } 
  100% { opacity: 0; }
}`;

function WebTerminal() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const wsRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:3007');

    wsRef.current.onmessage = (event) => {
      // Add the received message to the output array to display it, with proper line breaks
      setOutput((prevOutput) => [...prevOutput, ...event.data.split(/\r?\n/)]);
    };

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      // Optionally reconnect or reset state here
    };

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && wsRef.current) {
      setOutput((prevOutput) => [...prevOutput, `me@localhost:~$ ${input}`]);
      wsRef.current.send(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
      <style>{cursorBlinkAnimation}</style>
      <div className="flex-1 overflow-auto p-4 font-mono text-xs bg-black text-white whitespace-pre-wrap">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex-none">
        <div className="flex items-center bg-black p-2">
          <div className="text-green-400">me@localhost:~$</div>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-black text-white p-1 outline-none"
            autoFocus
          />
          <div className="w-2 h-full bg-white ml-1 opacity-50" style={{ animation: 'cursorBlink 1s step-start infinite' }} />
        </div>
      </div>
    </div>
  );
}

export default WebTerminal;
