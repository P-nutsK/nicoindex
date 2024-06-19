"use client";
import { VirtuosoGrid } from "react-virtuoso";
import styles from "./page.module.scss";
import { VideoEmbed } from "./VideoEmbed";
import { filterVideos, useFilterValue } from "./filter";
import type { Video } from "@/generate_videos";
import { Footer as Footer } from "./Footer";
import { useDeferredValue } from "react";

// メモ化の余地あり
export function Videos({ videos, noscriptMode }: { videos: Video[]; noscriptMode: boolean }) {
	const filter = useFilterValue();
	const filterdVideos = filterVideos(videos, filter);
	const defferdVideos = useDeferredValue(filterdVideos);
	//console.log(defferdVideos, defferdVideos?.length);
	return (
		<div>
			<h2>ヒット: {defferdVideos.length}件</h2>
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
					overscan={/* px */ 0}
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
