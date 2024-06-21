"use client";
import { Checkbox } from "@/components/checkbox";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { tagAtom } from "./atoms";
import { useSetOrganizer } from "./organizer/filter";
import styles from "./page.module.scss";

export function Tag({
	tagName,
	count,
	showCheckmark = true,
}: { tagName: string; count?: number; showCheckmark?: boolean }) {
	const selectedTags = useAtomValue(tagAtom);
	const isTagchecked = selectedTags.includes(tagName);
	const setOrganizer = useSetOrganizer();
	const changeHandler = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) {
				setOrganizer(organizer => ({ ...organizer, tag: [...organizer.tag, tagName] }));
			} else {
				setOrganizer(organizer => ({ ...organizer, tag: organizer.tag.filter(t => t !== tagName) }));
			}
		},
		[setOrganizer, tagName],
	);
	return (
		<Checkbox
			//	name="tags"
			//	value={tagName}
			className={`${styles.tag} ${showCheckmark ? styles["show-checkmark"] : ""}`}
			onChange={changeHandler}
			checked={isTagchecked}
			title={`${tagName} ${isTagchecked ? "(選択済み)" : "(選択されていません)"}`}
		>
			{tagName}
			{count && (isTagchecked ? null : count > 1 ? <span className={styles.count}>({count}件)</span> : null)}
		</Checkbox>
	);
}
