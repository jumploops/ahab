"use client";

import React, { useState } from "react";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import Chat from "./components/chat";
import Terminal from './components/webTerminal';

interface TerminalData {
  command?: string;
}

const Home = () => {

  const [terminalData, setTerminalData] = useState<TerminalData>({});
  const isEmpty = Object.keys(terminalData).length === 0;

  const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
    console.log("in functionCallHandler");
    console.log(call?.function?.name);
    if (call?.function?.name !== "run_terminal_command") return;
    const args = JSON.parse(call.function.arguments);
    console.log(args);
    //    const data = getWeather(args.location);
    //    setWeatherData(data);
    return JSON.stringify(args);
  };

  return (
    <main className='flex justify-center align-center h-[100vh] bg-white'>
      <div className='flex flex-row w-full h-full'>
        <div className='w-full h-full'>
          <Chat functionCallHandler={functionCallHandler} />
        </div>
        <div className='w-full'>
          <Terminal />
        </div>
      </div>
    </main>
  );
};

export default Home;
