import { ComponentType } from 'discord.js';
import { getMSG } from '../msg/index.js';
import PageButtons from '../button/page.js';
import SongButtons from '../button/song.js';

const queueMap = global.queueMap;
const timeExpired = 5 * 60 * 1000; // 5 phút
const pageSize = 10; // Số lượng bài hát trên mỗi trang

// Hàm phân trang cho hàng đợi
function paginateQueue(queue, pageSize = 10) {
  const pages = [];
  for (let i = 0; i < queue.length; i += pageSize) {
    pages.push(queue.slice(i, i + pageSize));
  }
  return pages;
}


export default async function queue(interaction) {
  try {
    const { guild } = interaction;

    // Lấy hàng đợi nhạc của server từ queueMap
    let queue = queueMap.get(guild.id);
    if (!queue || queue.length === 0) {
      return interaction.reply(getMSG('notQueue')); // Không có bài hát trong hàng đợi
    }

    // Chia hàng đợi thành các trang (mỗi trang 10 bài hát)
    const pages = paginateQueue(queue, 10);
    let pageIndex = 0; // Bắt đầu từ trang đầu tiên

    // Tạo nội dung cho trang đầu tiên
    let pageContent = pages[pageIndex].map((song, index) => `**${index + 1}.** ${song.title}`).join('\n');

    // Trả lời tương tác ban đầu để tránh lỗi InteractionNotReplied
    await interaction.deferReply();

    // Gửi trang đầu tiên
    let message = await interaction.editReply({
      content: getMSG('queue', `\n${pageContent}`),
      components: [PageButtons, SongButtons], // Đính kèm hành động nút
    });

    // Nếu có nhiều trang, thêm nút điều hướng
    if (pages.length > 1) {

      const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: timeExpired
      });

      collector.on('collect', async (i) => {

        await i.deferUpdate(); // Đánh dấu đã nhận được sự kiện

        if (i.customId === 'prevPage' && pageIndex > 0) {
          pageIndex--; // Chuyển đến trang trước
        } else if (i.customId === 'nextPage' && pageIndex < pages.length - 1) {
          pageIndex++; // Chuyển đến trang sau
        } else {
          return; // Kết thúc nếu không phải nút điều hướng
        }

        // Cập nhật nội dung và nút điều hướng
        pageContent = pages[pageIndex].map((song, index) => {
          const songIndex = pageIndex * pageSize + index + 1;
          return `**${songIndex}.** ${song.title}`
        }).join('\n');
        
        await message.edit({
          content: getMSG('queue', `\n${pageContent}\nTrang ${pageIndex + 1}/${pages.length}`),
          components: [PageButtons, SongButtons], // Cập nhật nút điều hướng
        });

        collector.resetTimer();
      });

      collector.on('end', async () => {
        // Xóa tất cả nút điều hướng
        await message.edit({
          content: getMSG('queue', `\n${pageContent}`),
          components: [],
        });
      }); // Kết thúc lắng nghe sự kiện
    }
  } catch (error) {
    console.error("Error in queue function:", error);
    interaction.reply(getMSG('error', error.message));
  }
}
