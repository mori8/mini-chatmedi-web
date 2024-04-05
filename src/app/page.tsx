"use client";
import { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";


export default function Home() {
  const [userPrompt, setUserPrompt] = useState("");
  const [query, setQuery] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);

  const getResults = async () => {
    setQuery((prev) => [...prev, userPrompt]);
    setUserPrompt("");

    const response = await fetch(
      `http://localhost:3000/fastapi/generate-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      }
    );
    // console.log("response: ", response);
    const data = await response.json();
    // console.log("data: ", data);
    setResults((prev) => [...prev, data.response]);
  };

  return (
    <main className="w-screen h-screen flex flex-col items-center pb-8">
      <div className="w-full h-full max-w-[640px] py-6 flex flex-col items-center">
        <header className="py-4">
          <h1 className="font-extrabold text-3xl bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
            chatmini
          </h1>
        </header>
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          {/* 대화 목록을 화면에 표시 */}
          {query.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="text-left text-blue-500">User: {item}</div>
              <div className="text-left text-green-500">LLM: {results[index]}</div>
            </div>
          ))}
        </div>
        <div className="border-2 border-gray-300 rounded-3xl px-4 py-3 w-full flex gap-4">
          <input
            type="text"
            value={userPrompt}
            className="flex-1"
            onChange={(e) => setUserPrompt(e.target.value)}
          />
          <button onClick={getResults} className="flex-shrink-0">
            <PaperAirplaneIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>
      </div>
    </main>
  );
}
