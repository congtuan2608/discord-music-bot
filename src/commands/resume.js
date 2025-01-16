import { AudioPlayerStatus } from "@discordjs/voice";

export default async function resume(interaction) {
  try {
    const guildId = interaction.guildId;

    // Kiểm tra xem player có tồn tại không
    const player = global.playerMap.get(guildId);
    if (!player) {
      return interaction.reply({ content: "❌ Không có bài hát nào đang phát!", ephemeral: true });
    }

    // Kiểm tra trạng thái của player
    if (player.state.status !== AudioPlayerStatus.Paused) {
      return interaction.reply({ content: "▶️ Bài hát đang được phát hoặc chưa tạm dừng!", ephemeral: true });
    }

    // Tiếp tục phát nhạc
    const resumed = player.unpause();
    if (resumed) {
      await interaction.reply({ content: "▶️ Đã tiếp tục phát nhạc!" });
    } else {
      await interaction.reply({ content: "❌ Không thể tiếp tục phát nhạc!", ephemeral: true });
    }
  } catch (error) {
    console.error("Error resuming song:", error);
    await interaction.reply({ content: `❌ Lỗi khi tiếp tục phát: ${error.message}`, ephemeral: true });
  }
}
