const API_URL = 'https://discord.com/api/v10';
const AUTH_HEADER = (botToken) => ({
    'Authorization': `Bot ${botToken}`,
    'Content-Type': 'application/json',
});

const sendMsg = (res, messageContent) => {
    // Function to send a confirmation message to a Discord channel
    // Implementation depends on your Discord bot setup
    return res.status(200).json({ type: 4, data: { content: messageContent } });
}

export async function sendDM(botToken, recipientId, content) {
  // create DM channel
  const createRes = await fetch(`${API_URL}/users/@me/channels`, {
    method: 'POST',
    headers: AUTH_HEADER(botToken),
    body: JSON.stringify({ recipient_id: recipientId }),
  });

  if (!createRes.ok) {
    const text = await createRes.text().catch(() => '');
    throw new Error(`create DM channel failed: ${createRes.status} ${text}`);
  }

  const channelData = await createRes.json();

  // send the message
  const sendRes = await fetch(`${API_URL}/channels/${channelData.id}/messages`, {
    method: 'POST',
    headers: AUTH_HEADER(botToken),
    body: JSON.stringify({ content }),
  });

  if (!sendRes.ok) {
    const text = await sendRes.text().catch(() => '');
    throw new Error(`send DM failed: ${sendRes.status} ${text}`);
  }

  return await sendRes.json();
}

export default sendMsg;