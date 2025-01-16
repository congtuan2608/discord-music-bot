import pkg from 'discord.js';

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = pkg;

const BUTTONS = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('pause')
      .setLabel('⏸️ Tạm dừng')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('resume')
      .setLabel('▶️ Tiếp tục')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('next')
      .setLabel('⏭️ Bài tiếp theo')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('queue')
      .setLabel('📜 Danh sách phát')
      .setStyle(ButtonStyle.Danger),
  );

export default BUTTONS;