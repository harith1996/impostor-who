import sendMsg from "../utils/messageUtils.js";
export default async function handleResetCommand(activeGames, res) {
    console.log('Handling reset command');
    if (activeGames.length === 0) {
        return sendMsg(res, 'No active games to reset.');
    }
    activeGames.length = 0; // Clear all active games
    return sendMsg(res, 'All active games have been reset.');
};