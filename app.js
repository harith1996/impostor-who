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

    // "join" command
    switch (name) {
      case 'join':
        // create a new game or add user to existing game
        
        const context = req.body.context;
        // User ID is in user field for (G)DMs, and member for servers
        const userObj = context === 0 ? req.body.member : req.body.user;
        handleJoinCommand(activeGames, userObj, res);
        break;
      case 'newround':
        const { word_picker, impostor } = await handleNewRoundCommand(activeGames, res);
        try {
          await sendDM(word_picker.user.id, wordPickerMessage);
          await sendDM(impostor.user.id, impostorMessage);
        } catch (err) {
          console.error('Failed to send DMs to word picker and impostor:', err);
        }
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
