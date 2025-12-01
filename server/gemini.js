import { GoogleGenerativeAI } from "google-generative-ai";

const getModel = (apiKey, modelName) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
};

export const generateText = async ({ apiKey, modelName, messages }) => {
  // Combine messages into a single prompt for simplicity
  const prompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
  const model = getModel(apiKey, modelName);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }]}],
  });

  const text = result.response.text();
  return text;
};
