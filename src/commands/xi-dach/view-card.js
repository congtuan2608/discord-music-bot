import { GET_CARD_BUTTONS, OPEN_BUTTON, PLAYER_CONTROL_BUTTONS, START_BUTTON, STATUS_BUTTONS } from "../../button/xi-dach.js";
import { getMSG } from "../../msg/index.js";
import { sumValueCards } from "./open-card.js";

export function statusCard(cards, roomMaster = false) {
  if (cards.length === 2 && cards.every(card => card.rank === 'A')) {
    return '(Xì bàn)'
  }

  if (cards.length === 2 && cards.some(card => card.rank === 'A') && cards.some(card => ['10', 'J', 'Q', 'K'].includes(card.rank))) {
    return '(Xì dách)'
  }

  if (sumValueCards(cards) === 15 && roomMaster) {
    return '(Vừa tròn 15)'
  }

  if (sumValueCards(cards) < 16) {
    return '(Em chưa 16)'
  }

  if (sumValueCards(cards) > 21) {
    return '(Quắc)'
  }

  return ''
}

export default async function viewCard(interaction) {
  try {
    const { member, guild } = interaction;

    // Defer the reply if not already deferred or replied
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    let xiDachMap = global.xiDachMap.get(guild.id);

    if (xiDachMap.members.find(member => member.id === interaction.member.id)?.cards.length === 0) {
      return interaction.followUp(getMSG('noCard', `**${member.nickname}:** đợi game sau đi rút bài nhé`));
    }

    // Check if the game is not started
    if (!xiDachMap?.isPlaying) {
      return interaction.followUp(getMSG('gameNotStarted'));
    }

    await interaction.followUp({
      content: `**${member.nickname}:** đang xem bài`,
    });

    const playerInfo = xiDachMap.members.find(member => member.id === interaction.member.id)

    if (!playerInfo) {
      return interaction.followUp(getMSG('error', 'Không tìm thấy người chơi'));
    }

    if (!playerInfo?.cards) {
      return interaction.followUp(getMSG('error', 'Không tìm thấy bài của người chơi'));
    }

    const sumCard = sumValueCards(playerInfo.cards);

    let components = []
    // if player opened
    if (playerInfo.opened) {
      components = []
    } else {
      // and if turn player
      if (playerInfo.id === xiDachMap.turn) {
        components = [PLAYER_CONTROL_BUTTONS]
      }
    }
    // if room master
    if (playerInfo.id === xiDachMap.roomMaster.id) {
      components = []
      // and if turn player
      if (playerInfo.id === xiDachMap.turn) {
        components = [GET_CARD_BUTTONS, STATUS_BUTTONS]
      }
    }

    await interaction.followUp({
      content: `Các lá bài của bạn:\n ${playerInfo?.cards.map(card => `**${card.rank}** ${card.symbol}`).join(' - ')}\nTổng: **${sumCard}đ** ${statusCard(playerInfo.cards)}`,
      ephemeral: true,
      components: components
    });

    // ================== LOGS ==================
    console.log('============== VIEW CARD ===============');
    console.log(`Room: ${guild.id}`);
    console.log(`Player: ${member.nickname}`);
    console.log('============== VIEW CARD ===============');
    // ================== LOGS ==================

  } catch (error) {
    console.error(error);
    return interaction.followUp(getMSG('error'));
  }
}