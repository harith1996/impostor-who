import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, DiscordRequest } from './utils.js';
import { sendDM } from './utils/messageUtils.js';
import { getShuffledOptions, getResult } from './game.js';
import handleJoinCommand from './commands/join.js';
import handleNewRoundCommand from './commands/newround.js';
import handleResetCommand from './commands/reset.js';
import { wordPickerMessage, impostorMessage } from './assets/messages.js';
import handlePickWordCommand from './commands/pickWord.js';
// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = [];

const TOKEN = process.env.DISCORD_TOKEN;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  const { id, type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    const context = req.body.context;
    // User ID is in user field for (G)DMs, and member for servers
    const userObj = context === 0 ? req.body.member : req.body.user;
    switch (name) {
      case 'join':
        handleJoinCommand(activeGames, userObj, res);
        break;
      case 'newround':
        await handleNewRoundCommand(activeGames, res);
        break;
      case 'pickword':
        await handlePickWordCommand(activeGames, userObj, data.options[0].value, res);
        break;
      case 'reset':
        handleResetCommand(activeGames, res);
        break;
      default:
        console.error(`unknown command: ${name}`);
        return res.status(400).json({ error: 'unknown command' });
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
