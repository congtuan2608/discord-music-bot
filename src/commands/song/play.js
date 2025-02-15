import play from "play-dl";
import { ytStream } from '../../auth/youtube.js'
import nextSong from "./next.js";
import { getMSG } from "../../msg/index.js";

const queueMap = global.queueMap;
const playerMap = global.playerMap;

export default async function playSong(interaction) {
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
    console.log('Query input: ', query);

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
        let playlist = await play.playlist_info(q); // Lấy thông tin playlist

        playlist = playlist.videos


        playerInfo.count += playlist.length; // Tăng số lượng bài hát

        const map = await Promise.all(playlist.map(async (video) => {
          const stream = await ytStream.stream(video.url);

          return { title: video.title, stream };
        }));

        map.forEach((item) => {
          queue.push(item); // Thêm các bài hát vào hàng đợi
        });
      }
      // Kiểm tra nếu query là video YouTube URL
      else if (play.yt_validate(trimmedQuery) === "video") {
        const videoInfo = await play.video_info(trimmedQuery);
        // const stream = await ytStream.stream(trimmedQuery);
        const stream = await ytStream.stream(trimmedQuery);

        queue.push({ title: videoInfo.video_details.title || 'unknown', stream });
        playerInfo.count += 1;
      }
      // Kiểm tra nếu query là tên bài hát
      else {
        const searchResults = await play.search(trimmedQuery, { limit: 1, filter: "audio" });
        if (searchResults.length === 0) {
          await interaction.followUp(`Không tìm thấy bài hát: ${trimmedQuery}`);
          return
        }
        const currentSong = searchResults[0];
        const stream = await ytStream.stream(currentSong.url);
        queue.push({ title: currentSong.title, stream });
        playerInfo.count += 1;
      }
    }

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
    console.error("Error playing song:", error);

    interaction.followUp(getMSG('error', error));
  }
}

