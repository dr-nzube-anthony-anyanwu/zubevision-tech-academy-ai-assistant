export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function sendChatMessage(
  message: string,
  history: ChatMessage[]
) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const response = await fetch(`${backendUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history,
    }),
  });

  if (!response.ok) {
    throw new Error("Something went wrong while contacting the assistant.");
  }

  return response.json();
}