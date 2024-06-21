import { useMemo } from "react";
import { useSetOrganizer, type Organizer } from "../organizer/filter";
import { filterStringify } from "../util";

export function useChangeTo(filter: Organizer) {
	const setFilter = useSetOrganizer();
	return useMemo(
		() => ({
			href: filterStringify(filter),
			/**
			 * filterAtomを {@param filter}の値で置き換えます
			 */
			change(this: void) {
				setFilter(filter);
			},
		}),
		[filter, setFilter],
	);
}
