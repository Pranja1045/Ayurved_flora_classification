import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

const pretunedMessage = `
do not use colon(:)in your response
Here is an exampple of the output format for a flower Rose,
Kingdom Plantae
Phylum  Magnoliophyta
Class Magnoliopsida
Order  Rosales
Family  Rosaceae
Genus  Rosa
Species  Rosa rugosa
Common Name  Rugosa Rose
Description  The Rugosa rose is a deciduous shrub that can grow up to 3 meters tall. It has large, glossy, dark green leaves and clusters of small, white flowers that bloom in the summer. The flowers have a strong, sweet fragrance. The Rugosa rose is a popular ornamental plant that is often used in landscaping and as a cut flower.
Medical Uses  The Rugosa rose is used in traditional Chinese medicine to treat a variety of ailments, including colds, coughs, and fevers. It is also used to treat skin conditions such as eczema and psoriasis.

Now, below is a flower name, provide response in the same format as above for the flower name provided.
If the flowe name is Unknown then just say please TRY again. else
Flower Name is 
`;

export async function getGroqChatCompletion(message) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: pretunedMessage + message,
      },
    ],
    model: "llama3-8b-8192",
  });
}
