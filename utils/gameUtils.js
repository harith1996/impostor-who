const create_game = (userIds) => {
    return {
        'players': userIds,
        'state': 'waiting',
    };
}
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
const find_player_in_game = (game, member) => {
    return game.players.find(player => player.user.id === member.user.id);
}
const get_word_picker_and_impostor = (game) => {
    //pick two random players as the word picker and impostor
    shuffle(game.players); 
    return {
        word_picker: game.players[0],
        impostor: game.players[1],
    };
}
const getRandomPlayer = (players) => {
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
}
    
export { create_game, find_player_in_game, get_word_picker_and_impostor, getRandomPlayer };