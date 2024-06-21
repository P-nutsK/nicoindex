import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import type { Organizer, SortType } from "./organizer/filter";
export const sort_default: SortType = "views_desc";
export const organizerAtom = atom<Organizer>({ query: null, user: null, tag: [], sort: sort_default });

export const queryAtom = focusAtom(organizerAtom, o => o.prop("query"));
export const userAtom = focusAtom(organizerAtom, o => o.prop("user"));
export const tagAtom = focusAtom(organizerAtom, o => o.prop("tag"));
export const filterAtom = focusAtom(organizerAtom, o => o.pick(["query", "tag", "user"]));
export const sortAtom = focusAtom(organizerAtom, o => o.prop("sort"));
