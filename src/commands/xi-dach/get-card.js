import { getMSG } from "../../msg/index.js";
import BUTTONS_XI_DACH, { GET_CARD_BUTTONS, OPEN_BUTTON, PLAYER_CONTROL_BUTTONS, STATUS_BUTTONS } from '../../button/xi-dach.js';
import skipCard from "./skip-card.js";
import { sumValueCards } from "./open-card.js";
import { statusCard } from "./view-card.js";

export default async function getCard(interaction) {
  try {
    const { member, guild } = interaction;
    let xiDachMap = global.xiDachMap.get(guild.id);

    // Defer the reply if not already deferred or replied
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    // Check if the game is not started
    if (!xiDachMap?.isPlaying) {
      return interaction.followUp(getMSG('gameNotStarted'));
    }

    let player = xiDachMap.members.find(member => member.id === interaction.member.id);

    // Check if the player has 5 cards
    if (player.cards.length === 5) {
      return interaction.followUp(getMSG('maxLengthCard', `**${member.nickname}**`));
    }

    // Check if it's not the player's turn
    if (member.id !== xiDachMap.turn) {
      return interaction.followUp(getMSG('notYourTurn', `**${member.nickname}:**`));
    }

    // Get the player's cards
    xiDachMap.members = xiDachMap.members.map(member => {
      if (member.id === interaction.member.id) {
        return {
          ...member,
          cards: [...member.cards, xiDachMap.currentCard]
        }
      }
      return member
    });

    // Set the current card
    xiDachMap.currentCard = xiDachMap.remainingCards.splice(0, 1)[0];

    global.xiDachMap.set(guild.id, xiDachMap);

    await interaction.followUp({
      content: getMSG('getCardSuccess', `**${member.nickname}:** vừa rút bài`),
      // components: [BUTTONS_XI_DACH],
    });

    // Check if the player has 5 cards
    if (xiDachMap.members.find(member => member.id === interaction.member.id).cards.length === 5) {
      skipCard(interaction);
    }

    xiDachMap = global.xiDachMap.get(guild.id);
    player = xiDachMap.members.find(member => member.id === interaction.member.id);

    const sumCard = sumValueCards(player.cards);
    let components = []

    // if player opened
    if (player.opened) {
      components = []
    } else {
      // and if turn player
      if (player.id === xiDachMap.turn) {
        components = [PLAYER_CONTROL_BUTTONS]
      }
    }
    // if room master
    if (player.id === xiDachMap.roomMaster.id) {
      components = []
      // and if turn player
      if (player.id === xiDachMap.turn) {
        components = [GET_CARD_BUTTONS, STATUS_BUTTONS]
      }
    }

    await interaction.followUp({
      content: `Các lá bài của bạn: ${xiDachMap.members.find(member => member.id === interaction.member.id).cards.map(card => `**${card.rank}**${card.symbol}`).join(' - ')}\nTổng: **${sumCard}đ** ${statusCard(player.cards)}`,
      ephemeral: true,
      components: components
    });

    // ================== LOGS ==================
    console.log('============== GET CARD ===============');
    console.log(`Room: ${guild.id}`);
    console.log(`Turn: ${xiDachMap.turn}`);
    console.log(`Player: ${member.nickname}`);
    console.log('============== GET CARD ===============');
    // ================== LOGS ==================

  } catch (error) {
    console.error(error);
    return interaction.followUp(getMSG('error'));
  }
}