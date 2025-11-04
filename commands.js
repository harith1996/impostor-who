import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Command for starting/joining an existing game
const JOIN_COMMAND = {
  name: 'join',
  description: 'Join the Impostor Who? game!',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const NEWROUND_COMMAND = {
  name: 'newround',
  description: 'Start a new round in the Impostor Who? game!',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const RESET_COMMAND = {
  name: 'reset',
  description: 'Reset all active games!',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [JOIN_COMMAND, NEWROUND_COMMAND, RESET_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
