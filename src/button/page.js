import pkg from 'discord.js';

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = pkg;

const BUTTONS = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('prevPage')
      .setEmoji('🔙')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('nextPage')
      .setEmoji('🔜')
      .setStyle(ButtonStyle.Secondary),
  );

export default BUTTONS;