import create from "zustand";
import { devtools } from "zustand/middleware";

const store = create((set) => ({
  listNodeData: [{ key: 1, n: "BaoNX", s: "M", a: ["B", "H"] }],
  changeListNodeData: (person) => set((state) => ({ listNodeData: person.listNodeData })),
}));

export default store;
