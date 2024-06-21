"use client";
import { Checkbox } from "@/components/checkbox";
import { useToggle } from "@/hooks/usetoggle";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { Tag } from "./Tag";
import { tagAtom } from "./atoms";
import { useFilterdVideos } from "./organizer/filter";
import styles from "./page.module.scss";

export default function Tags() {
	const tag = useAtomValue(tagAtom);
	const [showAll, toggle] = useToggle(false);
	const filiterdVideos = useFilterdVideos();
	const sortedTags = useMemo(() => {
		// カウントする
		const _ = new Map<string, number>();
		for (const { tags } of filiterdVideos) {
			for (const tag of tags) {
				_.set(tag.name, (_.get(tag.name) ?? 0) + 1);
			}
		}
		// カウントのエントリ
		const tagCounts = Array.from(_.entries());
		return tagCounts.toSorted((a, b) => {
			const CHECKED_WEIGHT = 100000;
			const a_weight = a[1] + (tag.includes(a[0]) ? CHECKED_WEIGHT : 0);
			const b_weight = b[1] + (tag.includes(b[0]) ? CHECKED_WEIGHT : 0);
			return b_weight - a_weight;
		});
	}, [filiterdVideos, tag]);
	return (
		<div>
			<h2>タグ</h2>
			<div className={styles["tag-container"]}>
				{sortedTags.slice(0, showAll ? undefined : 30).map(([tagName, count]) => (
					<Tag key={tagName} tagName={tagName} count={count} />
				))}
				{sortedTags.length > 30 && <ShowMore showAll={showAll} onChange={toggle} />}
			</div>
		</div>
	);
}

function ShowMore({
	showAll,
	...props
}: Omit<Parameters<typeof Checkbox>[0], "className" | "checked"> & { showAll: boolean }) {
	return (
		<Checkbox className={styles.showmore} {...props} checked={showAll}>
			{showAll ? "上位30個のみ表示" : "さらに表示"}
		</Checkbox>
	);
}
