import OpenAI from "openai";

// https://sdk.vercel.ai/docs/guides/providers/openai
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";


export async function POST(req: Request) {
  console.log("task-planning called");
  const { messages } = await req.json();
  const excutableTasks = [
    {
      name: "report_generation_from_ct_x_ray_image",
      description: "Generate an answer for a question based on an image. like: generate free-text radiology report."
    }, {
      name: "answer_question_about_medical_imaging_domain",
      description: "Answer a question based on an medical imaging domain. It only deals with english text query"
    }
  ]
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: 'system', content: `The AI assistant performs task parsing on user input, select an appropriate task with the following format: {"task": task_name}. The task must be selected from the following options: ${excutableTasks.map((task) => JSON.stringify(task))}. In case the user input cannot be parsed, an empty JSON response should be provided. ` },
      ...messages
    ]
  });

  // console.log(response);
  // console.log(response.choices[0].message.content);
  const selectedTask = JSON.parse(response.choices[0].message.content || "").task;
  
  return new Response(JSON.stringify(selectedTask), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
