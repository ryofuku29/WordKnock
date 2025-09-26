import express, {Request, Response} from "express";
import cors from "cors"; // 違うドメインから来たリクエストを許容するためのもの。

const app = express();
app.use(cors());
app.use(express.json()); // json文字列でフロントからデータが届く。expressでjson文字列を読むために必要。

let words: any[] = [
    { id: "1", englishWord: "apple", japaneseWord: "りんご", subject: "science" },
    { id: "2", englishWord: "banana", japaneseWord: "バナナ", subject: "science" },
]; // 一時的に保存するメモリ配列

// 単語一覧を返す
app.get("/api/words", (req: Request, res: Response) => {
  res.json(words);
});

// 単語を追加する
app.post("/api/words", (req: Request, res: Response) => {
  const newWord = req.body;
  words.push(newWord);
  res.status(201).json(newWord);
});

// 単語を削除する
app.delete("/api/words/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  words = words.filter(w => w.id !== id);
  res.status(204).send();
});

// サーバー起動
app.listen(3333, () => {
  console.log("🚀 API Server is running on http://localhost:3333");
});