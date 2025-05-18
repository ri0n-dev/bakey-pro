import { create } from "zustand";

type Block = {
  id: string;
  lock: string;
  content: any[];
  redirect?: string;
  component?: string;
};

type BlockStore = {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
};

export const useBlockStore = create<BlockStore>((set) => ({
  blocks: [],
  setBlocks: (blocks) => set({ blocks }),
}));
