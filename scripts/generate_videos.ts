import { writeFileSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import type { Video, VideoMap } from "../src/types";
import type { ApiWatch$Id, ResponseType } from "./types";
const sleep = (t: number) => new Promise(r => setTimeout(r, t));
async function main() {
	console.log("fetching all videos...");
	const controller = new AbortController();
	const cb = () => controller.abort();
	process.once("SIGINT", cb);
	process.once("SIGTERM", cb);
	process.once("SIGHUP", cb);
	const allvideos = await tryFetchAllVideos(
		Object.values(
			(await readFile("videos.json", "utf-8")
				.then(JSON.parse)
				.catch(() => ({}))) as VideoMap,
		),
		controller.signal,
	);
	process.off("SIGINT", cb);
	process.off("SIGTERM", cb);
	process.off("SIGHUP", cb);
	const result = [];
	for (const [i, video] of allvideos.entries()) {
		// full video
		if ("description" in (video as Video)) {
			console.log(`[${i}/${allvideos.length}] skipped ${video.id}`);
			result.push(video as Video);
		} else {
			console.log(`[${i}/${allvideos.length}] fetching ${video.id}`);
			await sleep(500);
			const videoInfo = await fetchVideoInfo(video.id);
			result.push({ ...video, ...videoInfo, registeredAtNum: new Date(videoInfo.registeredAt).valueOf() });
		}
	}
	const mapped: VideoMap = Object.fromEntries(result.map(v => [v.id, v]));
	const mappedstr = JSON.stringify(mapped);
	console.log(mappedstr);
	writeFileSync(join(process.cwd(), "videos.json"), mappedstr);
}

main().catch(e => {
	throw e;
});

async function fetchVideoInfo(id: string) {
	const { data } = await fetch(
		`https://www.nicovideo.jp/api/watch/tmp/${id}?_frontendId=6&_frontendVersion=0.0.0`,
	).then((r): Promise<ApiWatch$Id> => r.json());
	return {
		...data.video,
		tags: data.tag.items,
		ownerNickname: data.ownerNickname,
		genre: data.genre,
	};
}

async function tryFetchAllVideos(
	defaultArray: {
		id: string;
		latestCommentSummary: string;
		shortDescription: string;
	}[] = [],
	signal: AbortSignal,
	count = 999,
) {
	const videos = defaultArray;
	const knownId = new Set<string>(videos.map(v => v.id));
	let i = 0;
	try {
		while (count >= videos.length) {
			const { data } = await fetch(
				"https://nvapi.nicovideo.jp/v1/tmp/videos?count=10&_frontendId=6&_frontendVersion=0.0.0",
			).then((r): Promise<ResponseType> => r.json());
			const vids = data.videos
				.map(video => ({
					id: video.id,
					latestCommentSummary: video.latestCommentSummary,
					shortDescription: video.shortDescription,
				}))
				.filter(
					v =>
						/* 未知のidか */ knownId.has(v.id) === false &&
						/* 既知の集合に追加 */ (console.log(`video:${v.id}`), knownId.add(v.id)),
				);
			videos.push(...vids);
			console.log(`fetch count:${++i} ${videos.length}`);
			await sleep(500);
			if (signal.aborted) throw new Error("Aborted");
		}
	} catch (e) {
		if (e instanceof Error && e.message === "Aborted") {
			console.log("ビデオ一覧の取得を中断");
		} else {
			console.error(e);
		}
		return videos;
	}
	return videos;
}
