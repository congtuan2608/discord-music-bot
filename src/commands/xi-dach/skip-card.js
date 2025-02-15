import { getMSG } from "../../msg/index.js";
import BUTTONS_XI_DACH from '../../button/xi-dach.js';

export default async function skipCard(interaction) {
  try {
    const {  member, guild } = interaction;

    // Defer the reply if not already deferred or replied
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    let xiDachMap = global.xiDachMap.get(guild.id);

    // Check if the game is not started
    if (!xiDachMap?.isPlaying) {
      return interaction.followUp(getMSG('gameNotStarted'));
    }

    // Set the turn to the next player
    let nextPlayerIndex = xiDachMap.members.findIndex(member => member.id === xiDachMap.turn) + 1;
    if (nextPlayerIndex >= xiDachMap.members.length) {
      nextPlayerIndex = 0;
    }

    xiDachMap.turn = xiDachMap.members[nextPlayerIndex].id;

    global.xiDachMap.set(guild.id, xiDachMap);

    const nextPlayerInfo = xiDachMap.members.find(member => member.id === xiDachMap.turn)

    await interaction.followUp({
      content: getMSG('skipTurn', `**${nextPlayerInfo.user.nickname}:** sẽ đến lượt của bạn`),
      components: [BUTTONS_XI_DACH],
    })

    // ================== LOGS ==================
    console.log('============== SKIP MY TURN ===============');
    console.log(`Room: ${guild.id}`);
    console.log(`Player: ${member.nickname}`);
    console.log(`Next player: ${nextPlayerInfo.user.nickname}`);
    console.log('============== SKIP MY TURN ===============');
    // ================== LOGS ==================

  } catch (error) {
    console.error(error);
    return interaction.followUp(getMSG('error'));
  }
}