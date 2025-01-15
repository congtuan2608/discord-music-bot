import play from "play-dl";
import ytStream from "yt-stream";
import '../global/index.js'; // Đảm bảo globals.js được import trước
import nextSong from "./skip.js";

const queueMap = global.queueMap;
const playerMap = global.playerMap;

async function playSong(interaction) {
  try {
    const { options, member, guild, channel } = interaction;
    const playerInfo = {
      count: 0,
    }

    // Kiểm tra xem đã trả lời hoặc deferred chưa
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply(); // Chỉ defer khi chưa trả lời hoặc deferred
    }

    if (!member.voice.channel) {
      return interaction.followUp('Bạn phải ở trong một kênh voice để phát nhạc!');
    }

    let query = options.getString("song");

    if (!query) {
      return interaction.followUp('Hãy nhập tên bài hát hoặc link YouTube!');
    }

    // Lấy hàng đợi nhạc của server
    let queue = queueMap.get(guild.id);
    if (!queue) {
      queue = [];
      queueMap.set(guild.id, queue);
    }

    // Xử lý nhiều bài hát nếu người dùng nhập danh sách
    const queries = query.split(","); // Nhập nhiều bài cách nhau bằng dấu phẩy
    for (const q of queries) {
      const trimmedQuery = q.trim();

      // Kiểm tra nếu query là URL YouTube có tham số list (playlist)
      if (play.yt_validate(trimmedQuery) === "playlist") {
        const playlist = await play.playlist_info(q); // Lấy thông tin playlist
        playerInfo.count += playlist.videos.length; // Tăng số lượng bài hát

        const map = await Promise.all(playlist.videos.map(async (video) => {
          const stream = await ytStream.stream(video.url);
          return { title: video.title, stream };
        }));

        map.forEach((item) => {
          queue.push(item); // Thêm các bài hát vào hàng đợi
        });
      }
      // Kiểm tra nếu query là video YouTube URL
      else if (play.yt_validate(trimmedQuery) === "video") {
        const stream = await ytStream.stream(trimmedQuery);
        queue.push({ title: trimmedQuery, stream });
        playerInfo.count += 1;
      }
      // Kiểm tra nếu query là tên bài hát
      else {
        const searchResults = await play.search(trimmedQuery, { limit: 1, filter: "audio" });
        if (searchResults.length === 0) {
          await interaction.followUp(`Không tìm thấy bài hát: ${trimmedQuery}`);
          continue;
        }
        const currentSong = searchResults[0];
        const stream = await ytStream.stream(currentSong.url);
        queue.push({ title: currentSong.title, stream });
        playerInfo.count += 1;
      }
    }

    // Nếu chưa có bài hát nào đang phát, bắt đầu phát bài đầu tiên trong hàng đợi
    if (queue.length === queries.length) {
      if (!playerMap.has(guild.id)) {
        await nextSong(interaction); // Gọi hàm để phát bài đầu tiên trong queue
      } else {
        interaction.followUp(`Đã thêm ${playerInfo.count} bài hát vào hàng đợi!`);
      }
    } else {
      interaction.followUp(`Đã thêm ${playerInfo.count} bài hát vào hàng đợi!`);
    }

  } catch (error) {
    interaction.followUp(`Cứu kaoo, hết hát được rồi (❌ Lỗi): ${error.message}`);
  }
}

export default playSong;
