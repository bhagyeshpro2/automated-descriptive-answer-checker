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
max_tokens: 10,
n: 1,
stop: null,
temperature: 0.5,
});

const score = response.data.choices[0].text;
// const normalizedScore = (parseFloat(response.data.choices[0].text) - 0) * (maxScore - minScore) / (10 - 0) + minScore;
//   const score = Math.min(Math.max(normalizedScore, minScore), maxScore);
//   console.log(score);
  return score;
};

export { evaluateAnswer };
