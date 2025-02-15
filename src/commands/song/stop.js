import { getVoiceConnection } from "@discordjs/voice";
import { getMSG } from "../../msg/index.js";

export default async function stop(interaction) {
  const { guild } = interaction;

  try {
    // Kiểm tra xem interaction đã trả lời hay deferred chưa
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    // Kiểm tra xem bot có đang ở trong kênh voice hay không
    const connection = getVoiceConnection(guild.id);
    if (!connection) {
      return interaction.followUp(getMSG('notInVoice'), { ephemeral: true });
    }

    // Kiểm tra xem player có tồn tại không
    const playerData = global.playerMap.get(guild.id);

    if (playerData) {
      // Tạm dừng trình phát
      playerData.player.pause();
    }

    // Xóa hàng đợi và audio player
    global.queueMap.delete(guild.id);
    global.playerMap.delete(guild.id);

    // Thông báo cho người dùng
    await interaction.followUp(getMSG('stop'));
    console.log(`⏹️ Bot đã dừng phát nhạc trong guild: ${guild.id}`);
  } catch (error) {
    console.error("Error in stopSong:", error);
    if (!interaction.replied) {
      await interaction.reply(getMSG('error', error.message), { ephemeral: true });
    } else {
      await interaction.followUp(getMSG('error', error.message), { ephemeral: true });
    }
  }
}
