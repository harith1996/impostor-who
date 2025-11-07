import { DiscordRequest } from "../utils.js";
const CHANNEL_ID = process.env.CHANNEL_ID;
const respond = (res, messageContent) => {
    return res.status(200).json({ type: 4, data: { content: messageContent } });
}

export async function sendGameChannelMessage(content) {
  const res = await DiscordRequest(`/channels/${CHANNEL_ID}/messages`, {
    method: 'POST',
    body: { "content": content },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`send channel message failed: ${res.status} ${text}`);
  }
  return await res.json();
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

export default respond;