"use client";
import { useMemo } from "react";
import styles from "./page.module.scss";
import { isTagChecked, filterVideos, useFilterValue } from "./filter";
import { Tag } from "./Tag";
import { useToggle } from "@/hooks/usetoggle";
import type { Video } from "@/generate_videos";

export function Tags({ videos }: { videos: Video[] }) {
	const filter = useFilterValue();
	const [showAll, toggle] = useToggle(false);

	const sortedTags = useMemo(() => {
		const filiterdVideos = filterVideos(videos, filter);

		// カウントする
		const _ = new Map<string, number>();
		for (const { tags } of filiterdVideos) {
			for (const tag of tags) {
				_.set(tag.name, (_.get(tag.name) ?? 0) + 1);
			}
		}
		// カウントのエントリ
		const tagCounts = Array.from(_.entries());
		return (
			tagCounts
				//	.filter(([, count]) => count > 1)
				.sort((a, b) => {
					const CHECKED_WEIGHT = 100000;

					const a_weight = a[1] + (isTagChecked(a[0], filter) ? CHECKED_WEIGHT : 0);
					const b_weight = b[1] + (isTagChecked(b[0], filter) ? CHECKED_WEIGHT : 0);
					return b_weight - a_weight;
				})
		);
	}, [filter, videos]);
	return (
		<div>
			<h2>タグ</h2>
			<div className={styles["tag-container"]}>
				{sortedTags.slice(0, showAll ? undefined : 30).map(([tagName, count]) => (
					<Tag key={tagName} tagName={tagName} count={count} />
				))}
				<button className={styles.showmore} onClick={toggle}>
					{showAll ? "上位30個のみ表示" : "さらに表示"}
				</button>
			</div>
		</div>
	);
}
