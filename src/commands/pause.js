import { AudioPlayerStatus } from "@discordjs/voice";
import { getMSG } from "../msg/index.js";

export default async function pause(interaction) {
  try {
    const guildId = interaction.guildId;

    // Kiểm tra xem player có tồn tại không
    const playerData = global.playerMap.get(guildId);

    if (!playerData) {
      return interaction.reply({ content: getMSG('notPlaying'), ephemeral: true });
    }

    const player = playerData.player;
    // Kiểm tra trạng thái của player
    if (player.state.status === AudioPlayerStatus.Paused) {
      return interaction.reply({ content: getMSG('paused'), ephemeral: true });
    }

    // Tạm dừng trình phát
    player.pause();

    await interaction.reply({ content: getMSG('pause') });
  } catch (error) {
    console.error("Error pausing song:", error);
    await interaction.reply({ content: getMSG('error', error.message), ephemeral: true });
  }
}