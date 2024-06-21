"use client";

import { useHydrateAtoms } from "jotai/utils";
import { organizerAtom } from "../atoms";
import type { Organizer } from "../organizer/filter";
export function AtomsHydrator({
	atomValues,
	children,
}: {
	atomValues: { organizer: Organizer };
	children: React.ReactNode;
}) {
	console.log("atom hydrated");
	useHydrateAtoms([[organizerAtom, atomValues.organizer]]);
	return children;
}
