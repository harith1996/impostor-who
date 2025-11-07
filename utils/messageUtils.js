import { DiscordRequest } from "../utils.js";

const sendMsg = (res, messageContent) => {
    // Function to send a confirmation message to a Discord channel
    // Implementation depends on your Discord bot setup
    return res.status(200).json({ type: 4, data: { content: messageContent } });
}

export async function sendDM(recipientId, content) {
  // create DM channel
  const createRes = await DiscordRequest(`/users/@me/channels`, {
    method: 'POST',
    body: { "recipient_id": recipientId },
  });

  if (!createRes.ok) {
    const text = await createRes.text().catch(() => '');
    throw new Error(`create DM channel failed: ${createRes.status} ${text}`);
  }

  const channelData = await createRes.json();

  // send the message
  const sendRes = await DiscordRequest(`/channels/${channelData.id}/messages`, {
    method: 'POST',
    body: { "content": content },
  });

  if (!sendRes.ok) {
    const text = await sendRes.text().catch(() => '');
    throw new Error(`send DM failed: ${sendRes.status} ${text}`);
  }

  return await sendRes.json();
}

export default sendMsg;