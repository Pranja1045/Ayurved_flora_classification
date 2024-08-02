import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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",
    dangerouslyAllowBrowser: true,
 });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion(message) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    model: "llama3-8b-8192",
  });
}
