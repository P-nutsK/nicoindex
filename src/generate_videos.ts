import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
type ResponseType = {
	meta: {
		status: number;
	};
	data: {
		videos: ApiVideos;
	};
};
type ApiVideos = {
	type: string;
	id: string;
	title: string;
	registeredAt: string;
	count: {
		view: number;
		comment: number;
		mylist: number;
		like: number;
	};
	thumbnail: {
		url: string;
		middleUrl: null;
		largeUrl: null;
		listingUrl: string;
		nHdUrl: string;
	};
	duration: number;
	shortDescription: string;
	latestCommentSummary: string;
	isChannelVideo: boolean;
	isPaymentRequired: boolean;
	playbackPosition: null;
	owner: {
		ownerType: "hidden";
		type: "unknown";
		visibility: "hidden";
		id: null;
		name: null;
		iconUrl: null;
	};
	requireSensitiveMasking: false;
	videoLive: null;
	isMuted: boolean;
	"9d091f87": boolean;
	acf68865: boolean;
}[];
type ApiWatch$Id = {
	meta: {
		status: number;
	};
	data: {
		client: {
			nicosid: string;
			watchId: string;
			watchTrackId: string;
		};
		genre: {
			key: string;
			label: string;
			isImmoral: boolean;
			isDisabled: boolean;
			isNotSet: boolean;
		};
		media: {
			domand: {
				videos: unknown[];
				audios: unknown[];
				isStoryboardAvailable: false;
				accessRightKey: string;
			};
			delivery: null;
			deliveryLegacy: null;
		};
		tag: {
			items: {
				name: string;
				isLocked: boolean;
			}[];
		};
		video: {
			id: string;
			title: string;
			description: string;
			count: {
				view: number;
				comment: number;
				mylist: number;
				like: number;
			};
			duration: number;
			thumbnail: {
				url: string;
				middleUrl: null;
				largeUrl: null;
				player: string;
				ogp: string;
			};
			registeredAt: string;
		};
		ownerNickname: string;
	};
};
export type Video = {
	latestCommentSummary: string;
	shortDescription: string;
	tags: {
		name: string;
		isLocked: boolean;
	}[];
	ownerNickname: string | null;
	genre: {
		key: string;
		label: string;
		isImmoral: boolean;
		isDisabled: boolean;
		isNotSet: boolean;
	};
	id: string;
	title: string;
	description: string;
	count: {
		view: number;
		comment: number;
		mylist: number;
		like: number;
	};
	duration: number;
	thumbnail: {
		url: string;
		middleUrl: string | null;
		largeUrl: string | null;
		player: string;
		ogp: string;
	};
	registeredAt: string;
	registeredAtNum: number;
};
export type VideoMap = { [id: string]: Video };

const sleep = (t: number) => new Promise(r => setTimeout(r, t));
async function main() {
	console.log("fetching all videos...");
	const controller = new AbortController();
	process.on("SIGTERM", () => controller.abort());
	process.on("SIGINT", () => controller.abort());
	const allvideos = await tryFetchAllVideos(
		Object.values(JSON.parse(readFileSync("videos.json", "utf-8")) as VideoMap),
		controller.signal,
	);
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
		console.error(e);
		return videos;
	}
	return videos;
}
