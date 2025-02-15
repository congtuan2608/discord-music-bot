const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suitsAndSymbols = [
  { symbol: "♠️", suit: "Spades" },
  { symbol: "❤️", suit: "Hearts" },
  { symbol: "🔶", suit: "Diamonds" },
  { symbol: "♣️", suit: "Clubs" }
]

let CARDS = suitsAndSymbols.map(({ symbol, suit }) => {
  return ranks.map((rank) => {
    return { rank, suit, symbol };
  });
}).flat();



export default CARDS;
