"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Word, Subject } from "@/types";
import Header from "../components/Header";

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [englishWord, setEnglishWord] = useState("");
  const [japaneseWord, setJapaneseWord] = useState("");
  const [subject, setSubject] = useState<Subject>("math");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3333/api/words")
      .then((res) => res.json())
      .then((data) => {
        setWords(data);
      })
      .catch((err) => {
        console.error("API fetch failed", err);
      });
  }, []);

  const wordSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // formのデフォルト動作であるページリロードを防ぐ

    if (!englishWord.trim() || !japaneseWord.trim()) {
      setError("Please add the word");
      return;
    }
    const newWord: Word = {
      id: uuidv4(),
      englishWord,
      japaneseWord,
      subject,
    };

    const res = await fetch("http://localhost:3333/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWord),
    });

    if (res.ok) {
      setWords([...words, newWord]);
      setEnglishWord("");
      setJapaneseWord("");
      setSubject("math");
    } else {
      console.log("Failed to add");
    }
  };

  const wordDelete = async (id: string) => {
    const res = await fetch(`http://localhost:3333/api/words/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setWords((prev) => prev.filter((w) => w.id !== id));
    } else {
      alert("Failed to delete");
    }
  };

  return (
    <div className="container mt-5">
      <Header />
      <h2>words list</h2>

      <form onSubmit={wordSubmit} className="">
        <div>
          <input
            placeholder="English word"
            value={englishWord}
            onChange={(e) => setEnglishWord(e.target.value)}
          ></input>
        </div>
        <div>
          <input
            placeholder="Japanese word"
            value={japaneseWord}
            onChange={(e) => setJapaneseWord(e.target.value)}
          ></input>
        </div>
        <div>
          <select
            className="form-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
          >
            <option value="math">math</option>
            <option value="science">science</option>
            <option value="proggramming">programming</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          add
        </button>
      </form>
      {words.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>English</th>
              <th>Japanese</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {words.map((w) => (
              <tr key={w.id}>
                <td>{w.englishWord}</td>
                <td>{w.japaneseWord}</td>
                <td>{w.subject}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => wordDelete(w.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
