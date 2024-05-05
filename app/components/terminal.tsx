import React, { useState, useEffect, useRef } from 'react';
import Terminal from 'react-console-emulator';

const TerminalComponent = () => {
  const ws = useRef<WebSocket | null>(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3007');

    ws.current.addEventListener('open', function(event) {
      if (terminalRef.current) {
        terminalRef.current.pushToStdout('Connected to WS Server');
      }
    });

    ws.current.addEventListener('message', function(event) {
      if (terminalRef.current) {
        terminalRef.current.pushToStdout(event.data);
      }
    });

    return () => {
      ws.current?.close();
    };
  }, []);

  const commands = {
    send: {
      description: 'Sends a command to the WebSocket server.',
      usage: 'send <command>',
      fn: function(...args) {
        const command = args.join(' ');
        ws.current?.send(JSON.stringify({ command }));
        return `Sending command: ${command}`;
      }
    }
  };

  return (
    <Terminal
      ref={terminalRef}
      commands={commands}
      welcomeMessage={'Welcome to the WebSocket terminal. Type "send <command>" to execute commands.'}
      promptLabel={'me@localhost:~$'}
      noCommandFound={(cmd) => `Command "${cmd}" not found.`}
      style={{ fontWeight: 'bold', fontSize: '1em' }}
      messageStyle={{ fontWeight: 'normal' }}
      contentStyle={{ marginTop: '10px' }}
      inputStyle={{ color: 'cyan' }}
    />
  );
};

export default TerminalComponent;
