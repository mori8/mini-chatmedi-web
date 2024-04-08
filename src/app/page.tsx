"use client";

import { useChat } from "ai/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function Home() {
  // https://sdk.vercel.ai/docs/guides/providers/openai#wire-up-the-ui
  const { messages, append, input, handleInputChange, handleSubmit } = useChat();

  const compute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way
    console.log("[compute] input: ", input);

    // 1. task planning
    const taskPlanningResponse = await fetch("http://localhost:3000/api/chat/task-planning", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: input }] }),
    });
    const task = await taskPlanningResponse.json();
    console.log("[compute] task: ", task);

    // 2. model selection
    const modelSelectionResponse = await fetch("http://localhost:3000/api/chat/model-selection", { // Corrected endpoint
      method: "POST",
      body: JSON.stringify({ task }),
    });
    const model = await modelSelectionResponse.json();
    console.log("[compute] model: ", model);

    // 3. chat
    // Append or do something with model before submitting
    // append({ role: "assistant", content: model.result }); // Example append, adjust according to your data structure
    handleSubmit(e);
  }

  return (
    <main className="w-screen h-screen flex flex-col items-center pb-8">
      <div className="w-full h-full max-w-[640px] py-6 flex flex-col items-center">
        <header className="py-4">
          <h1 className="font-extrabold text-3xl bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
            chatmini
          </h1>
        </header>
        <div className="chatbox flex-1 flex flex-col gap-6 w-full">
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </div>
          ))}
        </div>
        <form onSubmit={compute} className="w-full">
          <input
            className="w-full py-3 px-4 border-2 border-gray-300 rounded-3xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </main>
  );
}
