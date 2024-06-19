"use client";
import { useCallback } from "react";
import styles from "./page.module.scss";
import { Checkbox } from "@/components/checkbox";
import { isTagChecked, useFilterValue, useSetFilter } from "./filter";

export function Tag({
	tagName,
	count,
	showCheckmark = true,
}: { tagName: string; count?: number; showCheckmark?: boolean }) {
	const filter = useFilterValue();
	const setFilter = useSetFilter();
	const changeHandler = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) {
				setFilter(filter => ({ ...filter, tag: [...filter.tag, tagName] }));
			} else {
				setFilter(filter => ({ ...filter, tag: filter.tag.filter(t => t !== tagName) }));
			}
		},
		[setFilter, tagName],
	);
	return (
		<Checkbox
			name="tags"
			value={tagName}
			className={`${styles.tag} ${showCheckmark ? styles["show-checkmark"] : ""}`}
			onChange={changeHandler}
			checked={isTagChecked(tagName, filter)}
			title={`${tagName} ${isTagChecked(tagName, filter) ? "(選択済み)" : "(選択されていません)"}`}
		>
			{tagName}
			{count &&
				(isTagChecked(tagName, filter) ? null : count > 1 ? (
					<span className={styles.count}>({count}件)</span>
				) : null)}
		</Checkbox>
	);
}
