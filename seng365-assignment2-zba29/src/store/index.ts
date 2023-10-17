import { create } from "zustand";
import { Film } from "../types/filmTypes";

interface FilmState {
  Films: Film[];
  setFilms: (Films: Array<Film>) => void;
}

const getLocalStorage = (key: string): Array<Film> =>
  JSON.parse(window.localStorage.getItem(key) as string);

const setLocalStorage = (key: string, value: Array<Film>) =>
  window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<FilmState>((set) => ({
  Films: getLocalStorage("Films") || [],
  setFilms: (Films: Array<Film>) =>
    set(() => {
      setLocalStorage("Films", Films);
      return { Films: Films };
    }),
}));

export const useFilmStore = useStore;
