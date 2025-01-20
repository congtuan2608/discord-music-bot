import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import say from "say";
import { getMSG } from "../msg/index.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Lấy đường dẫn thư mục hiện tại
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function sayText(interaction) {
  try {
    const { options, member, guild } = interaction;
    const text = options.getString('content') || getMSG('noText');

    // Kiểm tra xem người dùng có ở trong voice channel không
    if (!member.voice.channel) {
      return interaction.followUp(getMSG('notInVoice'), { ephemeral: true });
    }

    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply(); // Hoãn phản hồi nếu chưa được thực hiện
    }

    // Connect to the voice channel
    const connection = joinVoiceChannel({
      channelId: member.voice.channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    // Đảm bảo thư mục temp tồn tại
    const tempDir = path.join(__dirname, "../audio/temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Đường dẫn tuyệt đối đến file âm thanh
    const audioFilePath = path.join(tempDir, `audio-${new Date().getTime()}.mp3`);

    // Tạo audio resource từ say.speak (đọc văn bản thành file âm thanh tạm thời)
    say.export(text, null, 1.0, audioFilePath, (error) => {
      if (error) {
        console.error("Error in sayText function:", error);
        interaction.followUp(`❌ Lỗi: ${error.message}`);
        return;
      }

      // Tạo một AudioPlayer
      const player = createAudioPlayer();

      // Tạo audio resource từ file đã lưu
      const resource = createAudioResource(audioFilePath);

      // Đăng ký player vào kênh voice
      connection.subscribe(player);

      // Phát bài hát
      player.play(resource);

      // Gửi phản hồi cho người dùng sau khi phát xong
      interaction.followUp(text);

      console.log(`Đã nói: ${text}`);

      // Lắng nghe sự kiện khi bài hát kết thúc
      player.on(AudioPlayerStatus.Idle, () => {
        // Xóa file sau khi phát xong
        try {
          fs.unlinkSync(audioFilePath);  // Xóa tệp âm thanh sau khi phát xong
        } catch (error) {
          console.error("Error while deleting the audio file:", error);
        }
      });
    });

  } catch (error) {
    console.error("Error in sayText function:", error);
    interaction.followUp(`❌ Lỗi: ${error.message}`);
  }
}
