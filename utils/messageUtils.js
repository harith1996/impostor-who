const sendMsg = (res, messageContent) => {
    // Function to send a confirmation message to a Discord channel
    // Implementation depends on your Discord bot setup
    return res.status(200).json({ type: 4, data: { content: messageContent } });
}
export default sendMsg;