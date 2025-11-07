import {create_game} from "../utils/gameUtils.js";
import {find_player_in_game} from "../utils/gameUtils.js";
import respond from "../utils/messageUtils.js";

export default async function handleJoinCommand(activeGames, memberObj, res) {
    const nick = memberObj.nick;
    const userId = memberObj.user.id
    console.log(`Handling join command for user: ${nick}`);
    // check if any games exist
    if (activeGames.length === 0) {
        // create a new game with this user
        const newGame = create_game([memberObj]);
        activeGames.push(newGame);
    } else {
        // add user to the first existing game (for simplicity)
        const existingGame = activeGames[0];
        if(find_player_in_game(existingGame, memberObj)) {
            return respond(res, `User <@${userId}> is already in the game!`);
        }
        else {
            existingGame.players.push(memberObj);
        }
    }
    console.log('Active games:', activeGames);
    return respond(res, `User <@${userId}> joined the game!`);
}