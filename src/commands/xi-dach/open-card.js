import { getMSG } from "../../msg/index.js";
import { newGame } from "./game-start.js";
import { statusCard } from "./view-card.js";

export function sumValueCards(cards) {
  let total = 0;
  let aceCount = 0;
  let numCards = cards.length;

  for (const card of cards) {
    if (card.rank === "A") {
      aceCount += 1;
      // Nếu có 4 lá bài trở lên, A luôn bằng 1
      total += (numCards >= 4) ? 1 : 11;
    } else if (["J", "Q", "K"].includes(card.rank)) {
      total += 10;
    } else {
      total += Number(card.rank);
    }
  }

  // Nếu có 3 lá bài, A có thể là 11, 10 hoặc 1
  while (total > 21 && aceCount > 0) {
    total -= 10; // Đổi A từ 11 → 1
    aceCount -= 1;
  }

  return total;
}

export default async function openCard(interaction) {
  try {
    const { options, member, guild } = interaction;
    const memberIndex = options.getString("index");
    const xiDachRoom = global.xiDachMap.get(guild.id);

    // Defer the reply if not already deferred or replied
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    if (!memberIndex) {
      return interaction.followUp(getMSG('error', 'Vui lòng nhập số thứ tự của người chơi'));
    }

    if (!xiDachRoom) {
      return interaction.followUp(getMSG('gameNotStarted'));
    }

    if (xiDachRoom.roomMaster.id !== member.id) {
      return interaction.followUp(getMSG('notRoomOwner'));
    }

    if (memberIndex > xiDachRoom.members.length) {
      return interaction.followUp(getMSG('error', 'Không tìm thấy người chơi'));
    }

    // Get the player's cards
    const players = xiDachRoom.members
    const playerInfo = players[Number(memberIndex)];
    const matterInfo = players.find(player => player.id === xiDachRoom.roomMaster.id);

    if (!playerInfo) {
      return interaction.followUp(getMSG('error', 'Không tìm thấy người chơi'));
    }

    if (playerInfo.opened) {
      return interaction.followUp(getMSG('error', 'Người chơi đã khui bài'));
    }

    playerInfo.opened = true;

    xiDachRoom.members = players.map(player => {
      if (player.id === playerInfo.id) {
        return playerInfo
      }
      return player
    });

    global.xiDachMap.set(guild.id, xiDachRoom);

    const sumUser = sumValueCards(playerInfo.cards)
    const sumMaster = sumValueCards(matterInfo.cards)

    if (playerInfo?.id === xiDachRoom.roomMaster.id) {
      const otherPlayers = players.filter(player => player.id !== xiDachRoom.roomMaster.id);

      await interaction.followUp({
        content: `Bài của nhà cái **(${xiDachRoom.roomMaster.nickname})**:\n${playerInfo?.cards.map(card => `**${card.rank}** ${card.symbol}`).join(' - ')}\nTổng điểm của nhà cái: **${sumMaster}đ** ${statusCard(playerInfo.cards, true)}\nBài của dân:\n${otherPlayers.map(player => `**${player.user.nickname}** - ${player.cards.map(card => `**${card.rank}** ${card.symbol}`).join(' - ')} - **Tổng điểm:** ${sumValueCards(player.cards)} - ${statusCard(player.cards)}`).join('\n')}
        `,
      });

      await interaction.followUp({
        content: `Nhà cái đã khui bài, bắt đầu ván mới`,
      });

      return newGame(interaction);
    }


    let isWin = ''
    // matter win and player lose
    if (sumMaster <= 21 && sumUser < sumMaster) {
      isWin = 'Nhà cái thắng'
    }
    // player win and matter lose
    if (sumUser <= 21 && sumMaster > 21) {
      isWin = 'Bạn thắng'
    }

    // player win and matter win
    if (sumUser === sumMaster) {
      isWin = 'Hòa'
    }

    // player win and matter lose
    if (sumUser > 21 && sumMaster > 21) {
      isWin = 'Hòa'
    }

    await interaction.followUp({
      content: `Nhà cái khui bài của ${playerInfo.user.nickname}:\n 
      ${playerInfo?.cards.map(card => `**${card.rank}** ${card.symbol}`).join(' - ')}\n
      **Tổng điểm của ${playerInfo.user.nickname}:** ${sum}\n${isWin}`,
    });

    // ================== LOGS ==================
    console.log('============== OPEN CARD ===============');
    console.log(`Room: ${guild.id}`);
    console.log(`Room Master: ${xiDachRoom.roomMaster.nickname}`);
    console.log(`Open player card: ${playerInfo.user.nickname}`);
    console.log('============== OPEN CARD ===============');
    // ================== LOGS ==================

  } catch (error) {
    console.error(error);
    return interaction.followUp(getMSG('error'));
  }
}