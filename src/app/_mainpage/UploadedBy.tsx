"use client";
import { useChangeTo } from "./hooks/useChangeTo";
import { useOrgnizerValue } from "./organizer/filter";
import styles from "./page.module.scss";
import CustomAnchor from "./utils/CustomAnchor";

export function UploadedBy() {
	const filter = useOrgnizerValue();
	const { change, href } = useChangeTo({ ...filter, user: null });
	return filter.user ? (
		<>
			<h2>{filter.user} さんがアップロードした動画</h2>
			<CustomAnchor href={href} onLocalNavigationClick={change} className={styles.back}>
				戻る
			</CustomAnchor>
			<hr />
		</>
	) : null;
}
