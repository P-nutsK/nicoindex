/* eslint-disable @next/next/no-img-element */
"use client";
import type { Video } from "@/generate_videos";
import styles from "./page.module.scss";
import { Tag } from "./Tag";
import { formatDate, formatDuration } from "./util";

export function VideoEmbed({ video, className }: { video: Video; className?: string }) {
	const url = `https://www.nicovideo.jp/watch_tmp/${video.id}`;
	const f = new Intl.NumberFormat();
	return (
		<div className={`${styles.nicovideo} ${className}`}>
			<div className={styles.header}>
				<a href="https://www.nicovideo.jp/" target="_blank" tabIndex={-1}>
					<img src="/logo_w.gif" alt="ニコニコ動画" />
				</a>
				<img src="/txt_video.gif" alt="VIDEO" />
			</div>

			<div style={{ padding: 4 }}>
				<p className={styles.TXT10}>
					再生：<strong>{f.format(video.count.view)}</strong>
					<wbr />
					コメント：
					<wbr />
					<strong>{f.format(video.count.comment)}</strong>
					<wbr />
					いいね！：
					<wbr />
					<strong>{f.format(video.count.like)}</strong>
					<wbr />
					マイリスト：
					<wbr />
					<strong>{f.format(video.count.mylist)}</strong>
					<wbr />
				</p>

				<table className={styles.body}>
					<tbody>
						<tr style={{ verticalAlign: "top" }}>
							<td>
								<p>
									<a href={url} target="_blank" tabIndex={-1}>
										<img
											alt="thumbnail"
											loading="lazy"
											src={video.thumbnail.url}
											className={styles.video_img}
										/>
									</a>
								</p>
								<p className={styles.TXT10} style={{ marginTop: 2 }}>
									<strong>{formatDuration(video.duration)}</strong>
								</p>
							</td>
							<td style={{ paddingLeft: 4 }}>
								<p className={styles.TXT10}>
									<strong>{formatDate(new Date(video.registeredAt))}</strong> 投稿
								</p>
								<p className={styles.TXT12}>
									<a href={url} target="_blank" className={styles.video}>
										{video.title}
									</a>
								</p>
								<p className={styles.TXT10}>{video.shortDescription}...</p>
							</td>
						</tr>
					</tbody>
				</table>
				<div className={styles.tags}>
					{video.tags.map(tag => {
						return <Tag key={tag.name} tagName={tag.name} showCheckmark={false} />;
					})}
				</div>
				<div className={styles.video_res}>{video.latestCommentSummary}</div>
			</div>
		</div>
	);
}
