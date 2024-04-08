import OpenAI from "openai";

// https://sdk.vercel.ai/docs/guides/providers/openai
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";


export async function POST(req: Request) {
  const { task } = await req.json();
  const candidateModelsForEachTasks = {
    "report_generation_from_ct_x_ray_image": [
      {
        "name": "",
        "description": "",
        "dataset": ""
      }
    ],
    "answer_question_about_medical_imaging_domain": [
      {
        "name": "",
        "description": "",
        "dataset": ""
      }
    ]
  }

  // const response = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     // TODO
  //   ]
  // });

  const selectedModel = "gpt-3.5-turbo"
  
  return new Response(JSON.stringify({ model: selectedModel }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
