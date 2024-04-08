import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// https://sdk.vercel.ai/docs/guides/providers/openai
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

// 모델 선택 로직을 별도의 함수로 정의
async function taskPlanning(message: string): Promise<object> {
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
      { role: 'user', content: message }
    ]
  });

  // console.log(response);
  // console.log(response.choices[0].message.content);
  const selectedTask = JSON.parse(response.choices[0].message.content || "").task;
  
  return selectedTask;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  // Task Planning과 Model Selection 로직 구현
  // const task = await taskPlanning(messages[0].content);
  // console.log(task);
  // 첫수행이냐 아니냐에 따라 task planning 수행 여부 결정
  
  // messages.push({ role: 'assistant', content: task });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are helpful visual assistant which is designed to be able to assist with a wide range of text and visual related tasks. You can not directly read images, but it has a list of tools to finish different visual tasks. Each image will have a file name formed as "image/xxx.png", and you can invoke different tools to indirectly understand pictures. When talking about images, you are very strict to the file name and will never fabricate nonexistent files. When using tools to generate new image files, assistant is also known that the image may not be the same as the user's demand, and will use other visual question answering tools or description tools to observe the real image. assistant is able to use tools in a sequence, and is loyal to the tool observation outputs rather than faking the image content and image file name. It will remember to provide the file name from the last tool observation, if a new image is generated.When matching the user message with the provided functions, if the required fields are missing in the user message, DON”T ASK USER BACK!! Instead just call the function with default parameters. Use the chat history when you fill the fields.`,
      },
      // { role: 'assistant', content: task},
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
