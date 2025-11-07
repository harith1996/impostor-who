import { getRandomPlayer } from "../utils/gameUtils.js";
import respond, { sendGameChannelMessage } from "../utils/messageUtils.js";
import { sendDM } from "../utils/messageUtils.js";

export default async function handlePickWordCommand(activeGames, invoker, word, res) {
    if (activeGames.length === 0) {
        return respond(res, 'No active games. Please join a game first!');
    }
    else {
        const game = activeGames[0];
        if (!game.currentRound) {
            return respond(res, 'No active round. Please start a new round first!');
        }
        const wordPicker = game.currentRound.word_picker;
        const nick = invoker.username;
        const userId = invoker.id;
        console.log(`Handling pick word command for user: ${nick}`);
        // verify that the user is the word picker
        if (wordPicker.user.id !== userId) {
            return sendDM(userId, `Sorry you're not the word picker!`);
        }
        else {
            // set the word for the round
            game.currentRound.word = word;
            console.log(`Word picker ${nick} picked the word: ${word}`);
            sendDM(userId, `You picked the word: **${word}**. Let the round begin!`);
        }
        const starter = getRandomPlayer(activeGames[0].players);
        return sendGameChannelMessage(`The word has been picked, and <@${starter.user.id}> will start this round!`);
    }
}