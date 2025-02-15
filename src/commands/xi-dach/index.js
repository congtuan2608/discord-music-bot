import join from "./join-game.js";
import start from "./game-start.js";
import getCard from "./get-card.js";
import viewCard from "./view-card.js";
import skipCard from "./skip-card.js";
import gameStatus from "./game-status.js";
import openCard from "./open-card.js";

const XI_DACH_COMMANDS = {
  'join_xi-dach': {
    func: join,
    description: "Tham gia game xì dách",
    options: []
  },
  'start_xi-dach': {
    func: start,
    description: "Bắt đầu game xì dách",
    options: [
      {
        name: "restart",
        description: "Bắt đầu lại từ đầu",
        type: 5,
        required: false,
      }
    ]
  },
  'get-card_xi-dach': {
    func: getCard,
    description: "Bóc bài trong game xì dách",
    options: []
  },
  'skip-card_xi-dach': {
    func: skipCard,
    description: "Bỏ qua lượt trong game xì dách",
    options: []
  },
  'view-card_xi-dach': {
    func: viewCard,
    description: "Xem bài của mình trong game xì dách",
    options: []
  },
  'game-status_xi-dach': {
    func: gameStatus,
    description: "Xem trạng thái game xì dách",
    options: []
  },
  'open-card_xi-dach': {
    func: openCard,
    description: "Mở bài trong game xì dách",
    options: [
      {
        name: "index",
        description: "Chỉ số người chơi cần mở",
        type: 4,
        required: true,
      }
    ]
  },
}

export default XI_DACH_COMMANDS