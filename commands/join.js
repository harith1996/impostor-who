import {create_game} from "../utils/gameUtils.js";
import {find_player_in_game} from "../utils/gameUtils.js";
import sendMsg from "../utils/messageUtils.js";

export default async function handleJoinCommand(activeGames, userObj, res) {
    console.log(`Handling join command for user: ${userObj.username}`);
    // check if any games exist
    if (activeGames.length === 0) {
        // create a new game with this user
        const newGame = create_game([userObj]);
        activeGames.push(newGame);
    } else {
        // add user to the first existing game (for simplicity)
        const existingGame = activeGames[0];
        if(find_player_in_game(existingGame, userObj.id)) {
            return sendMsg(res, `User <@${userObj.id}> is already in the game!`);
        }
        else {
            existingGame.players.push(userObj);
        }
    }
    console.log('Active games:', activeGames);
    return sendMsg(res, `User <@${userObj.id}> joined the game!`);
}