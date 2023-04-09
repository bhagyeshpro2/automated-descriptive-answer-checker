import { config } from "dotenv"
config()

import { Configuration, OpenAIApi } from "openai"

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

async function evaluateAnswer(originalAnswer, studentAnswer, minScore, maxScore) {
const prompt = `Please compare the following answers and give a score between ${minScore} and ${maxScore} :\n\nOriginal Answer:+ ${originalAnswer}\n\nStudent Answer: ${studentAnswer}\n\nScore:` ;
const response = await openai.createCompletion({
model: 'text-davinci-003',
prompt: prompt,
max_tokens: 3,
n: 1,
stop: null,
temperature: 0.5,
});

const score = response.data.choices[0].text;
  return score;
};

export { evaluateAnswer };
