import respond from "../utils/messageUtils.js";
export default async function handleResetCommand(activeGames, res) {
    console.log('Handling reset command');
    if (activeGames.length === 0) {
        return respond(res, 'No active games to reset.');
    }
    activeGames.length = 0; // Clear all active games
    return respond(res, 'All active games have been reset.');
};