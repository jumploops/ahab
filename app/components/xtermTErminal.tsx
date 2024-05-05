import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';// Import the stylesheet for xterm.js at the top of your component 
import 'xterm/css/xterm.css';

// Dynamically load xterm modules with SSR disabled
const XTerm = dynamic(() => import('xterm').then((mod) => ({
  // Return the Terminal as the default component
  default: mod.Terminal
})), {
  ssr: false
});

function WebTerminal() {
  const terminalRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // Import xterm and the fit addon client
    Promise.all([
      import('xterm'),
      import('xterm-addon-fit')
    ]).then(([xtermMod, fitAddonMod]) => {
      const Terminal = xtermMod.Terminal;
      const FitAddon = fitAddonMod.FitAddon;

      // Create a new xterm.js Terminal instance
      const terminal = new Terminal({
        cursorBlink: true
      });

      // Apply the fit addon
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      // Open the terminal
      terminal.open(terminalRef.current);
      fitAddon.fit();

      // Instantiate WebSocket connection
      wsRef.current = new WebSocket('ws://localhost:3007');

      // Set up WebSocket event listeners
      wsRef.current.onopen = () => console.log('Connected to WebSocket');
      wsRef.current.onclose = () => console.log('Disconnected from WebSocket');
      wsRef.current.onerror = (error) => console.error('WebSocket error:', error);
      wsRef.current.onmessage = (event) => terminal.write(event.data);

      // Set up xterm.js event listeners
      terminal.onData(data => {
        wsRef.current.send(data);
      });

      return () => {
        terminal.dispose();
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    });

    // Websocket and xterm.js cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      // If you had other cleanup logic, it would go here
    };
  }, []);

  return <div ref={terminalRef} style={{ width: '100%', height: '300px', backgroundColor: 'black' }} />;
}

export default dynamic(() => Promise.resolve(WebTerminal), {
  ssr: fals:
});
