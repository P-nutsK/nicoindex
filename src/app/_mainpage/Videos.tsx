"use client";
import { useDeferredValue } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { Footer } from "./Footer";
import SortBy from "./SortBy";
import { VideoEmbed } from "./VideoEmbed";
import { useFilterdVideos } from "./organizer/filter";
import styles from "./page.module.scss";

// メモ化の余地あり
export function Videos({ noscriptMode }: { noscriptMode: boolean }) {
	const filterdVideos = useFilterdVideos();
	const defferdVideos = useDeferredValue(filterdVideos);
	//console.log(defferdVideos, defferdVideos?.length);
	return (
		<div>
			<h2>ヒット: {defferdVideos.length}件</h2> <SortBy />
			{defferdVideos.length > 0 ? (
				<VirtuosoGrid
					totalCount={defferdVideos.length}
					data={defferdVideos}
					listClassName={styles.flex}
					itemClassName={styles["flex-item"]}
					useWindowScroll
					components={{ Footer }}
					itemContent={(_, video) => {
						return <VideoEmbed video={video} key={video.id} />;
					}}
					overscan={/* px */ 400}
					initialItemCount={noscriptMode ? defferdVideos.length : Math.min(12, defferdVideos.length)}
				/>
			) : (
				<>
					<NotFound />
					<Footer />
				</>
			)}
		</div>
	);
}

function NotFound() {
	return (
		<div>
			お探しの動画は見つかりませんでした
			<br />
			<button>フィルタをリセットする</button>
		</div>
	);
}
