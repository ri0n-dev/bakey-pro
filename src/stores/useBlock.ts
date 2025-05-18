import { create } from "zustand";

type Block = {
  id: string;
  lock: string;
  content: any[];
  redirect?: string;
  component?: string;
};

type BlockState = {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
};

export const useBlockStore = create<BlockState>((set) => ({
  blocks: [],
  setBlocks: (blocks) => set({ blocks }),
}));
