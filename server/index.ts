import express, {Request, Response} from "express";
import cors from "cors"; // 違うドメイン(nextjsなど)から来たリクエストを許容するためのもの。
import { MongoClient, ObjectId, Collection } from "mongodb";

export type Subject = "math" | "science" | "programing";
export type Word = {
  id: string;
  englishWord: string;
  japaneseWord: string;
  subject: Subject;
};

const app = express();
app.use(cors());
app.use(express.json()); // json文字列でフロントからデータが届く。expressでjson文字列を読むために必要。

const client = new MongoClient("mongodb://localhost:27017");
const dbName = "wordknock";
let wordsCollection: Collection<Word>;

async function connectDB() {
  await client.connect();
  console.log("MongoDB connected");
  wordsCollection = client.db(dbName).collection<Word>("words");

  app.listen(3333, () => {
    console.log("🚀 API Server is running on http://localhost:3333");
  });
}

app.get("/api/words", async (rep: Request, res: Response) => {
  const words = await wordsCollection.find().toArray();
  res.json(words);
});

// 単語を追加する
app.post("/api/words", async(req: Request, res: Response) => {
  try {
    const newWord = req.body;
    if (!newWord.japaneseWord || !newWord.englishWord || !newWord.subject) {
      return res.status(400).json({ error: "必須項目が不足しています" });
    }
    const result = await wordsCollection.insertOne(newWord);
    res.status(201).json({ ...newWord, _id: result.insertedId });
  } catch (err) {
    console.log("Error inserting word:", err);
  }
});

// 単語を削除する
app.delete("/api/words/:id", async(req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "IDが必要です" });
    }
    const result = await wordsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.json(404).json({ error: "単語が見つかりません。削除できませんでした。" });
    }
    res.status(204).send();
  } catch (err) {
    console.log("Error deleting word: ", err);
    res.status(500).json({ error: "サーバーエラー" });
  }
});

// サーバー起動
connectDB().then(() => {
  app.listen(3333, () => {
    console.log("API Server is running on http://localhost:3333")
  })
});