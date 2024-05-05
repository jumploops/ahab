"use client";

import React, { useState, useEffect } from "react";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import Chat from "./components/chat";
import Terminal from './components/webTerminal';

const Home = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newWs = new WebSocket('ws://localhost:3007');

    newWs.onmessage = (event) => {
      setOutput((prevOutput) => [...prevOutput, event.data]);
    };

    newWs.onopen = () => {
      console.log('WebSocket connected');
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newWs.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  // Call this function to send commands through WebSocket
  const sendCommand = (command: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(command);
      setOutput((prevOutput) => [...prevOutput, `me@localhost:~$ ${command}`]);
    } else {
      console.error("WebSocket is not open.");
    }
  };

  const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
    console.log("in functionCallHandler");
    if (call?.function?.name === "run_terminal_command") {
      const args = JSON.parse(call.function.arguments);
      console.log(args);
      if (args.command) {
        sendCommand(args.command);
      }
    }

    // Return something meaningful here or null if there's nothing to return.
    return '';
  };

  return (
    <main className='flex justify-center align-center h-[100vh] bg-white'>
      <div className='flex flex-row w-full h-full'>
        <div className='w-full h-full'>
          <Chat functionCallHandler={functionCallHandler} />
        </div>
        <div className='w-full'>
          <Terminal output={output} onInputSubmit={sendCommand} />
        </div>
      </div>
    </main>
  );
};

export default Home;
