import { get_word_picker_and_impostor } from "../utils/gameUtils.js";
import sendMsg from "../utils/messageUtils.js";

export default async function handleNewRoundCommand(activeGames, res) {
    console.log('Handling newround command');
    if (activeGames.length === 0) {
        return sendMsg(res, 'No active games. Please join a game first!');
    }
    const game = activeGames[0]; // For simplicity, use the first active game
    if (game.players.length < 2) {
        return sendMsg(res, 'Not enough players to start a new round. Please wait for more players to join!');
    }
    const { word_picker, impostor } = get_word_picker_and_impostor(game);
    console.log(`New round: Word Picker - ${word_picker.nick}, Impostor - ${impostor.nick}`);
    sendMsg(res, `New round started!\nWord Picker: <@${word_picker.user.id}>\nImpostor: <@${impostor.user.id}>`);
    return { word_picker, impostor };
}