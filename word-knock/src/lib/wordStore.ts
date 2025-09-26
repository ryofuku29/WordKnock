// とりあえずローカルストレージに保存。今後DBへ差し替え可能な型に
import { Word } from "@/types";

const Key = "words_v1";

export const wordStore = {
    list(): Word[] { // 全て読む
        if (typeof window === 'undefined') return []; // なんでwindowって名前にしてるの？
        const raw = localStorage.getItem(Key);
        return raw ? JSON.parse(raw) : [];
    },
    save(words: Word[]) { // 丸ごと保存(上書き)
        if (typeof window === 'undefined') return;
        localStorage.setItem(Key, JSON.stringify(words));
    },
    add(newWord: Word) { // wordの追加
        const all = wordStore.list();
        all.push(newWord);
        wordStore.save(all);
    },
    remove(id: string) { // wordの削除
        const all = wordStore.list().filter(w => w.id !== id);
        wordStore.save(all);
    }
};