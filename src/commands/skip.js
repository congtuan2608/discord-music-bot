import { getMSG } from "../msg/index.js";
import { playStream } from "./playStream";  // Giả sử playStream là hàm để phát nhạc mới


export default async function skipTo(interaction) {
  try {
    const { options, guild, member } = interaction;
    const skipIndex = options.getInteger('index'); // Lấy chỉ số bài hát từ người dùng (ví dụ: 3 cho bài thứ 3 trong danh sách)

    // Kiểm tra xem người dùng có ở trong kênh voice không
    if (!member.voice.channel) {
      return interaction.followUp('Bạn phải ở trong một kênh voice để bỏ qua bài hát!');
    }

    // Lấy hàng đợi nhạc của server
    let queue = global.queueMap.get(guild.id);
    if (!queue || queue.length === 0) {
      return interaction.followUp('Không có bài hát nào trong hàng đợi!');
    }

    // Kiểm tra nếu chỉ số hợp lệ
    if (skipIndex < 1 || skipIndex > queue.length) {
      return interaction.followUp('Chỉ số bài hát không hợp lệ!');
    }

    // Cập nhật lại vị trí hiện tại trong hàng đợi
    const player = global.playerMap.get(guild.id);
    if (!player) {
      return interaction.followUp('Không có player hoạt động để bỏ qua bài!');
    }

    // Cập nhật trạng thái của player (skip đến bài hát chỉ số skipIndex - 1)
    player.currentSongIndex = skipIndex - 1; // Lưu chỉ số bài hát muốn phát

    // Lấy bài hát cần phát từ hàng đợi
    const songToPlay = queue[player.currentSongIndex];
    if (!songToPlay) {
      return interaction.followUp('Không tìm thấy bài hát cần phát!');
    }

    // Phát lại bài hát mới (sử dụng hàm playStream để phát lại)
    await playStream(songToPlay.stream, member.voice.channel);

    // Thông báo cho người dùng biết đã bỏ qua đến bài hát nào
    interaction.followUp(`Đã bỏ qua đến bài hát: **${songToPlay.title}**!`);

  } catch (error) {
    console.error("Error in skipTo function:", error);
    interaction.followUp(getMSG('error', error.message));
  }
}
