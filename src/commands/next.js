import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import SongButtons from '../button/song.js';
import { getMSG } from "../msg/index.js";

export default async function nextSong(interaction) {
  const { member, guild } = interaction;

  try {
    // Kiểm tra xem interaction đã trả lời hay deferred chưa
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    // Lấy hàng đợi nhạc của server
    let queue = global.queueMap.get(guild.id);

    // Kiểm tra nếu không có bài hát trong hàng đợi
    if (!queue || queue.length === 0) {
      if (!interaction.replied) {
        await interaction.followUp(getMSG('notQueue'));
      }
      global.queueMap.delete(guild.id);
      global.playerMap.delete(guild.id);
      return; // Kết thúc hàm nếu không có bài hát trong hàng đợi
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
      await interaction.followUp({
        content: getMSG('play', currentSong.title),
        components: [SongButtons],
      });
    }
    console.log(getMSG('play', currentSong.title),);

    // Khi bài hát kết thúc, phát bài tiếp theo
    player.on(AudioPlayerStatus.Idle, () => {
      nextSong(interaction);
    });

    // Xử lý lỗi
    player.on("error", (error) => {
      console.error(error);
      if (!interaction.replied) {
        interaction.followUp(getMSG('error', error.message));
      }
      nextSong(interaction); // Gọi lại next song sau khi lỗi
    });
  } catch (error) {
    console.error("Error in nextSong:", error);
    if (!interaction.replied) {
      await interaction.deferReply(); // Đảm bảo deferred reply nếu lỗi xảy ra
    }
    if (!interaction.replied) {
      interaction.followUp(getMSG('error', error.message));
    }
  }
}
