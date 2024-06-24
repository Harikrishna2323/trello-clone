import { create } from "zustand";

type CardModalStore = {
  _id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useCardModal = create<CardModalStore>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, _id: id }),
  onClose: () => set({ isOpen: false, _id: undefined }),
}));
