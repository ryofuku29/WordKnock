"use client";
import { useEffect, useMemo, useState } from "react";
import { wordStore } from "@/lib/wordStore";
import { Word, Subject } from "@/types";
import Header from "../components/Header";

const subjects: Subject[] = ["math", "science", "programing"];
const uuid = () => crypto.randomUUID?.() ?? String(Date.now());

export default function AddWordsPage() {
  const [englishWord, setEnglishWord] = useState("");
  const [japaneseWord, setJapaneseWord] = useState("");
  const [subject, setSubject] = useState<Subject>("math");
  const [filter, setFilter] = useState<Subject | "ALL">("ALL");
  const [words, setWords] = useState<Word[]>([]);

  // 初期表示＆登録/削除のたび更新
  const refresh = () => setWords(wordStore.list());

  useEffect(refresh, []);

  const filtered = useMemo(
    () =>
      filter === "ALL" ? words : words.filter((w) => w.subject === filter),
    [words, filter]
  );

  const addWord = () => {
    if (!englishWord.trim() || !japaneseWord.trim())
      return alert("add some words");
    const newWord: Word = {
      id: uuid(),
      englishWord: englishWord.trim(),
      japaneseWord: japaneseWord.trim(),
      subject,
    };
    wordStore.add(newWord);
    setEnglishWord("");
    setJapaneseWord("");
    refresh();
  };

  const del = (id: string) => {
    wordStore.remove(id);
    refresh();
  };

  return (
    <div>
      <Header />
      <h1 className="mb-4">Words Note</h1>
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="english"
            value={englishWord}
            onChange={(e) => setEnglishWord(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="japanese"
            value={japaneseWord}
            onChange={(e) => setJapaneseWord(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-primary" onClick={addWord}>
            add
          </button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="ALL">All</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="align-self-center text-muted">
          words: {filtered.length}
        </span>
      </div>

      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>English</th>
            <th>Japanese</th>
            <th>Subject</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((w) => (
            <tr key={w.id}>
              <td>{w.englishWord}</td>
              <td>{w.japaneseWord}</td>
              <td>{w.subject}</td>
              <td className="text-end">
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => del(w.id)}
                >
                  {/* delete */}
                  <svg
                    className="text-secondary"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
