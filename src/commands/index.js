import play from "./play.js";
import queue from "./queue.js";
import next from "./next.js";
import stop from "./stop.js";
import pause from "./pause.js";
import resume from "./resume.js";
import skipTo from "./skip.js";
import sayText from "./say.js";
import join from "./join.js";


const COMMANDS = {
  play: {
    func: play,
    description: "Phát bài hát từ youtube",
    options: [
      {
        name: "song",
        description: "Tên bài hát hoặc link youtube",
        type: 3,
        required: true,
      },
    ],
  },
  stop: {
    func: stop,
    description: "Dừng bài hát đang phát",
    options: []
  },
  next: {
    func: next,
    description: "Chuyển bài hát",
    options: []
  },
  queue: {
    func: queue,
    description: "Danh sách bài hát đang chờ",
    options: []
  },
  pause: {
    func: pause,
    description: "Tạm dừng bài hát",
    options: []
  },
  resume: {
    func: resume,
    description: "Tiếp tục bài hát",
    options: []
  },
  skip: {
    func: skipTo,
    description: "Bỏ qua bài hát",
    options: [
      {
        name: "index",
        description: "Chỉ số bài hát cần bỏ qua",
        type: 3,
        required: true,
      },
    ],
  },
  say: {
    func: sayText,
    description: "Nói gì đó",
    options: [
      {
        name: "content",
        description: "Nội dung cần nói",
        type: 3,
        required: false,
      },
    ],
  },
  join:{
    func: join,
    description: "Tham gia kênh voice",
    options: []
  }
}

export default COMMANDS;