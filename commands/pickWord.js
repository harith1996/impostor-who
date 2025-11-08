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
        }
        const starter = getRandomPlayer(activeGames[0].players);
        //DM the word to everyone except the impostor
        for (const player of game.players) {
            if (player.user.id !== game.currentRound.impostor.user.id) {
                await sendDM(player.user.id, `⚠️ TOP SECRET : The word for this round is: **${word}**. When it's your turn, say a similar word!`);
            }
        }
        return sendDM(starter.user.id, `You will start this round!`);
    }
}