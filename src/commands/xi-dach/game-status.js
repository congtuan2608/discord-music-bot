import { getMSG } from "../../msg/index.js";

export default async function gameStatus(interaction) {
  try {
    const { guild } = interaction;
    const xiDachRoom = global.xiDachMap.get(guild.id);

    // Defer the reply if not already deferred or replied
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }


    if (!xiDachRoom) {
      return interaction.followUp(getMSG('gameNotStarted'));
    }

    const players = xiDachRoom.members

    await interaction.followUp({
      content: getMSG('gameStatus',
        `**Danh sách người chơi và số lá:**\n${players.map((player, idx) => `**${player.user.nickname}** - ${player.cards.length} lá - (${player?.opened ? 'Đã khui' : 'Chưa khui'}) - STT: ${idx}`).join('\n')}\n**Lượt chơi:** ${players.find(player => player.id === xiDachRoom.turn).user.nickname + (xiDachRoom.roomMaster.id === xiDachRoom.turn && '(Nhà cái)')}\n
        `
      ),
    });

    // ================== LOGS ==================
    console.log('============== GAME STATUS ===============');
    console.log(`Room: ${guild.id}`);
    console.log(`Status: ${xiDachRoom.isPlaying}`);
    console.log(`Turn: ${xiDachRoom.turn}`);
    console.log(`Room Master: ${xiDachRoom.roomMaster.nickname}`);
    console.log(`Number of players: ${players.length}`);
    console.log('============== GAME STATUS ===============');
    // ================== LOGS ==================

  } catch (error) {
    console.error(error);
    return interaction.followUp(getMSG('error'));
  }
}