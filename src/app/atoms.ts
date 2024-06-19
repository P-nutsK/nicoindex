import { atom } from "jotai";
import type { Filter } from "./filter";

export const filterAtom = atom<Filter>({ tag: [], user: null, query: [] });
