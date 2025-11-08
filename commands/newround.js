import { get_word_picker_and_impostor } from "../utils/gameUtils.js";
import respond from "../utils/messageUtils.js";
import { sendDM } from "../utils/messageUtils.js";
import { wordPickerMessage, impostorMessage } from "../assets/messages.js";

export default async function handleNewRoundCommand(activeGames, res) {
  console.log('Handling newround command');
  if (activeGames.length === 0) {
    return respond(res, 'No active games. Please join a game first!');
  }
  const game = activeGames[0]; // For simplicity, use the first active game
  if (game.players.length < 2) {
    return respond(res, 'Not enough players to start a new round. Please wait for more players to join!');
  }
  const { word_picker, impostor } = get_word_picker_and_impostor(game);
  console.log(`New round: Word Picker - ${word_picker.nick}, Impostor - ${impostor.nick}`);
  activeGames[0].currentRound = { word_picker, impostor };
  await sendDM(word_picker.user.id, wordPickerMessage);
  await sendDM(impostor.user.id, impostorMessage);

  respond(res, `New round started! Wait for the word picker to choose a word! 👀`);
  //send a DM to everyone else 
  for (const player of game.players) {
    if (player.user.id !== word_picker.user.id && player.user.id !== impostor.user.id) {
      await sendDM(player.user.id, `You're innocent! Try to figure out who the impostor is this round.`);
    }
  }
  return { word_picker, impostor };
}