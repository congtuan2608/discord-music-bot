import pkg from 'discord.js';

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = pkg;

const START_BUTTON = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('start_xi-dach')
      .setLabel('🃏 Bắt đầu game!')
      .setStyle(ButtonStyle.Primary)
  )

const OPEN_BUTTON = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('open-card_xi-dach')
      .setLabel('🃏 Mở bài cái!')
      .setStyle(ButtonStyle.Primary)
  )

const GET_CARD_BUTTONS = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('get-card_xi-dach')
      .setLabel('🃏 Rút bài')
      .setStyle(ButtonStyle.Primary)
  )

const SKIP_BUTTONS = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('skip-card_xi-dach')
      .setLabel('⏭️ Bỏ qua rút bài')
      .setStyle(ButtonStyle.Success)
  )

const STATUS_BUTTONS = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('game-status_xi-dach')
      .setLabel('👀 Xem trạng thái trò chơi')
      .setStyle(ButtonStyle.Secondary)
  )

const PLAYER_CONTROL_BUTTONS = [GET_CARD_BUTTONS, SKIP_BUTTONS];

const BUTTONS = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('get-card_xi-dach')
      .setLabel('🃏 Rút bài')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('skip-card_xi-dach')
      .setLabel('⏭️ Bỏ qua rút bài')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('view-card_xi-dach')
      .setLabel('👀 Xem bài của tôi')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('game-status_xi-dach')
      .setLabel('👀 Xem trạng thái trò chơi')
      .setStyle(ButtonStyle.Secondary),
  );

export { START_BUTTON, OPEN_BUTTON, GET_CARD_BUTTONS, SKIP_BUTTONS, PLAYER_CONTROL_BUTTONS, BUTTONS, STATUS_BUTTONS };
export default BUTTONS;