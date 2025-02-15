import noiTu from "./noi-tu.js";

const COMMANDS = {
  'noi-tu': {
    func: noiTu,
    description: "Chơi game nối từ",
    options: [
      {
        name: "word",
        description: "Nối từ với từ cuối cùng",
        type: 3,
        required: true,
      },
      {
        name: "restart",
        description: "Bắt đầu lại từ đầu",
        type: 5,
        required: false,
      }
    ]
  },
}
export default COMMANDS;