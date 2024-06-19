"use client";
import { useHydrateAtoms } from "jotai/utils";
import type { Filter } from "./filter";
import { filterAtom } from "./atoms";
export function AtomsHydrator({
	atomValues,
	children,
}: {
	atomValues: { filter: Filter };
	children: React.ReactNode;
}) {
	//console.log(atomValues);
	useHydrateAtoms([[filterAtom, atomValues.filter]]);
	return children;
}
