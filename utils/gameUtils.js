const create_game = (userIds) => {
    return {
        'players': userIds,
        'state': 'waiting',
    };
}
const find_player_in_game = (game, userId) => {
    return game.players.find(player => player.id === userId);
}
const get_word_picker_and_impostor = (game) => {
    //pick two random players as the word picker and impostor
    const shuffledPlayers = game.players.sort(() => 0.5 - Math.random());
    return {
        word_picker: shuffledPlayers[0],
        impostor: shuffledPlayers[1],
    };
}
export { create_game, find_player_in_game, get_word_picker_and_impostor };