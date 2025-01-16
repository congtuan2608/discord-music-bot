import { getVoiceConnection } from "@discordjs/voice";
import { getMSG } from "../msg/index.js";

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
      return interaction.followUp(getMSG('notInVoice'));
    }

    // Xóa hàng đợi và audio player
    global.queueMap.delete(guild.id);
    global.playerMap.delete(guild.id);

    // Thông báo cho người dùng
    await interaction.followUp("⏹️ Kaoo đã dừng hát rồi đấy!!");
    console.log(`⏹️ Bot đã dừng phát nhạc trong guild: ${guild.id}`);
  } catch (error) {
    console.error("Error in stopSong:", error);
    if (!interaction.replied) {
      await interaction.reply(getMSG('error', error.message));
    } else {
      await interaction.followUp(getMSG('error', error.message));
    }
  }
}
