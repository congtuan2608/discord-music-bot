import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";

export default async function nextSong(interaction) {
  const { member, guild } = interaction;

  try {
    // Kiểm tra xem interaction đã trả lời hay deferred chưa
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    // Lấy hàng đợi nhạc của server
    let queue = global.queueMap.get(guild.id);
    if (!queue || queue.length === 0) {
      global.queueMap.delete(guild.id);
      global.playerMap.delete(guild.id);
      if (!interaction.replied) {
        await interaction.followUp("🎵 Tao đã hát hết rồi đó, đừng ép kaoo nữa!");
      }
      return;
    }

    // Lấy bài hát hiện tại và xóa nó khỏi queue
    const currentSong = queue.shift();

    // Kết nối vào kênh voice
    const connection = joinVoiceChannel({
      channelId: member.voice.channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    // Tạo audio player và lưu nó vào playerMap
    const player = createAudioPlayer();
    global.playerMap.set(guild.id, player);

    // Đăng ký player vào connection
    connection.subscribe(player);

    // Tạo audio resource từ stream của bài hát
    const resource = createAudioResource(currentSong.stream.stream, { inputType: currentSong.stream.type });
    player.play(resource);

    // Thông báo cho người dùng bài hát đang phát
    if (!interaction.replied) {
      await interaction.followUp(`🎶 Kaoo đang hát bài: ${currentSong.title}`);
    }
    console.log(`🎶 Kaoo đang hát bài: ${currentSong.title}`);

    // Khi bài hát kết thúc, phát bài tiếp theo
    player.on(AudioPlayerStatus.Idle, () => {
      nextSong(interaction);
    });

    // Xử lý lỗi
    player.on("error", (error) => {
      console.error(error);
      if (!interaction.replied) {
        interaction.followUp(`❌ Lỗi phát nhạc: ${error.message}`);
      }
      nextSong(interaction); // Gọi lại next song sau khi lỗi
    });
  } catch (error) {
    console.error("Error in nextSong:", error);
    if (!interaction.replied) {
      await interaction.deferReply(); // Đảm bảo deferred reply nếu lỗi xảy ra
    }
    if (!interaction.replied) {
      interaction.followUp(`Có lỗi xảy ra: ${error.message}`);
    }
  }
}
