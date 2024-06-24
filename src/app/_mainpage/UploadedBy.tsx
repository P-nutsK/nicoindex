"use client";
import { useAtomValue } from "jotai";
import { userAtom } from "./atoms";
import { useChangeTo } from "./hooks/useChangeTo";
import { useOrgnizerValue } from "./organizer/filter";
import styles from "./page.module.scss";
import CustomAnchor from "./utils/CustomAnchor";

export function ShowUploadedBy() {
	const user = useAtomValue(userAtom);
	return user && <UploadedBy />;
}

function UploadedBy() {
	const filter = useOrgnizerValue();
	const { change, href } = useChangeTo({ ...filter, user: null });
	return (
		<>
			<h2>{filter.user} さんがアップロードした動画</h2>
			<CustomAnchor href={href} onLocalNavigationClick={change} className={styles.back}>
				戻る
			</CustomAnchor>
			<hr />
		</>
	);
}
