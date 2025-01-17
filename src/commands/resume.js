import { AudioPlayerStatus } from "@discordjs/voice";
import { getMSG } from "../msg/index.js";

export default async function resume(interaction) {
  try {
    const guildId = interaction.guildId;
    const playerData = global.playerMap.get(guildId);

    if (!playerData) {
      return interaction.reply({ content: getMSG('notPlaying'), ephemeral: true });
    }

    const player = playerData.player;
    // Kiểm tra trạng thái của player
    if (player.state.status !== AudioPlayerStatus.Paused) {
      return interaction.reply({ content: getMSG('statusResume'), ephemeral: true });
    }

    // Tiếp tục phát nhạc
    const resumed = player.unpause();

    if (resumed) {
      await interaction.reply({ content: getMSG('resume') });
    } else {
      await interaction.reply({ content: getMSG('cantResume'), ephemeral: true });
    }
  } catch (error) {
    console.error("Error resuming song:", error);
    await interaction.reply({ content: `❌ Lỗi khi tiếp tục phát: ${error.message}`, ephemeral: true });
  }
}
