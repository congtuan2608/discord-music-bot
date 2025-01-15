import dotenv from "dotenv";
import { Client, GatewayIntentBits, SlashCommandBuilder } from "discord.js";
import callbackRouter from './src/routers/callback.js'
import express from "express";
import COMMANDS from "./src/commands/index.js";


dotenv.config();

const app = express();

app.get("/", async function (req, res) {
  return res.status(200).json({ message: "Welcome to bot discord baprangbo 🥰😘😝" });
});

app.use("/v1/callback", callbackRouter);

app.listen(process.env.PORT || 3333, () => console.log(`Server running on http://localhost:${process.env.PORT || 3333}`));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});


// Đăng ký lệnh slash command
client.once('ready', async () => {
  console.log(`Bot đã sẵn sàng, đăng nhập với tên ${client.user.tag}`);

  const commands = Object.entries(COMMANDS).map(([key, value]) => {
    if (value?.options) {
      const result = new SlashCommandBuilder().setName(key).setDescription(value.description)

      value.options.forEach(optionValue => {
        result.addStringOption(option => option.setName(optionValue.name).setDescription(optionValue.description).setRequired(optionValue.required));
      });

      return result.toJSON();
    }
    return new SlashCommandBuilder().setName(key).setDescription(value.description).toJSON();
  });

  // Đăng ký lệnh cho tất cả các server
  await client.application.commands.set(commands);
  console.log('Lệnh Slash đã được đăng ký!');
});

// Xử lý interaction (lệnh slash command)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (Object.hasOwnProperty.call(COMMANDS, commandName)) {
    await COMMANDS[commandName]?.func(interaction);
  }
});

// Đăng nhập bot
try {
  await client.login(process.env.TOKEN);
  console.log('🚀 Đăng nhập thành công!');
  console.log('Author:', process.env.AUTHOR);
} catch (error) {
  console.log(`❌ Đăng nhập không thành công: ${error.message}`);
}
