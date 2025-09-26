"use client";

import { wordStore } from "@/lib/wordStore";
import Header from "../components/Header";
import { useState } from "react";

export default function CardPage() {
  const words = wordStore.list();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const currentWord = words[index];
  const handleNext = () => {
    if (flipped) {
      setFlipped(false);
      setIndex((prev) => (prev + 1) % words.length);
    } else {
      setFlipped(true);
    }
  };

  const handleBack = () => {
    if (!flipped) {
      setFlipped(true);
      setIndex((prev) => (prev - 1 + words.length) % words.length);
    } else {
      setFlipped(false);
    }
    return;
  };
  return (
    <div>
      <Header />
      <div>
        <div className="fs-3">mode</div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
          />
          <label className="form-check-label" htmlFor="flexRadioDefault1">
            normal mode
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
          />
          <label className="form-check-label" htmlFor="flexRadioDefault1">
            random mode
          </label>
        </div>
      </div>
      <div className="d-flex flex-column align-item-center mt-5">
        <div className="card text-center py-5 fs-1" onClick={handleNext}>
          {flipped ? currentWord.japaneseWord : currentWord.englishWord}
        </div>
        <div onClick={handleBack}>reverse</div>
      </div>
    </div>
  );
}
