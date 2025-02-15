import { START_BUTTON } from "../../button/xi-dach.js";
import { getMSG } from "../../msg/index.js";

export default async function joinGame(interaction) {
  try {
    const { member, guild } = interaction;
    let xiDachMap = global.xiDachMap.get(guild.id);

    // Defer the reply if not already deferred or replied
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }


    // Create a new game if not exists
    if (!xiDachMap) {
      xiDachMap = {
        members: [],
        remainingCards: [],
        turn: 0,
        currentCard: null,
        isPlaying: false,
        roomMaster: member
      }
      global.xiDachMap.set(guild.id, xiDachMap);
    }

    // add the user to the game
    if (xiDachMap.members.find(member => member.id === interaction.member.id)) {
      return interaction.followUp(getMSG('alreadyJoin'));
    }

    xiDachMap.members.push({ id: member.id, cards: [], user: member, opened: false });
    global.xiDachMap.set(guild.id, xiDachMap);

    await interaction.followUp({
      content: getMSG('joinSuccess', `Danh sách người chơi: \n${xiDachMap.members.map(member => `**${member.user.nickname}**`).join('\n')}`),
      components: [START_BUTTON]
    });

    // ================== LOGS ==================
    console.log('============== JOIN GAME ===============');
    console.log(`Room: ${guild.id}`);
    console.log(`Playing game: ${xiDachMap.isPlaying}`);
    console.log(`Room Master: ${xiDachMap.roomMaster.nickname}`);
    console.log(`Number of players: ${xiDachMap.members.length}`);
    console.log('============== JOIN GAME ===============');
    // ================== LOGS ==================
  } catch (error) {
    console.error(getMSG('error', error.message));
    return interaction.followUp(getMSG('error', error.message));
  }
}