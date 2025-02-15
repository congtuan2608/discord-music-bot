import CARDS from '../../data/playing-cards/cards.js';
import { getMSG } from '../../msg/index.js';
import BUTTONS_XI_DACH from '../../button/xi-dach.js';

export async function newGame(interaction) {
  const { guild } = interaction;
  let xiDachMap = global.xiDachMap.get(guild.id);
  // new game
  xiDachMap.members = xiDachMap.members.map(member => {
    return { ...member, cards: [], opened: false }
  });
  global.xiDachMap.set(guild.id, xiDachMap);

  // Start the game
  xiDachMap.isPlaying = true;
  // Shuffle the deck
  const shuffledDeck = [...CARDS].sort(() => Math.random() - 0.5);

  // Deal 2 cards to each player
  xiDachMap.members.forEach(member => {
    member.cards = shuffledDeck.splice(0, 2)
  });

  // Set the current card
  xiDachMap.currentCard = shuffledDeck.splice(0, 1)[0];

  // Set the remaining cards
  xiDachMap.remainingCards = [...shuffledDeck]

  // Set the turn to the first player
  if (xiDachMap.members.length <= 1) {
    xiDachMap.turn = xiDachMap.members[0].id
  } else {
    xiDachMap.turn = xiDachMap.members[1].id;
  }

  global.xiDachMap.set(guild.id, xiDachMap);

  await interaction.followUp({
    content: getMSG('startGame', 'Toàn bộ người chơi đã nhận được 2 lá bài, bắt đầu từ người chơi đầu tiên'),
    components: [BUTTONS_XI_DACH],
  });

  // ================== LOGS ==================
  console.log('============== GAME START ===============');
  console.log(`Room: ${guild.id}`);
  console.log(`Playing game: ${xiDachMap.isPlaying}`);
  console.log(`Room Master: ${xiDachMap.roomMaster.nickname}`);
  console.log(`Number of players: ${xiDachMap.members.length}`);
  console.log('============== GAME START ===============');
  // ================== LOGS ==================

}

export default async function startGame(interaction) {
  try {
    const { options, guild } = interaction;

    // Defer the reply if not already deferred or replied
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    let restart = options?.getString("restart") || undefined;
    let xiDachMap = global.xiDachMap.get(guild.id);

    if (!xiDachMap) {
      return interaction.followUp(getMSG('roomNotCreated'));
    }

    // Create a new game if not exists
    if (restart) {
      await newGame(interaction)
    }

    if (xiDachMap?.isPlaying) {
      return interaction.followUp(getMSG('gameStarted'));
    }

    // // Check if there are enough players
    if (xiDachMap?.members?.length < 1) {
      return interaction.followUp(getMSG('notEnoughPlayers'));
    }

    await newGame(interaction);

  } catch (error) {
    console.error(error);
    return interaction.followUp(getMSG('error'));
  }
}