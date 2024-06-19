import { writeFileSync } from "fs";
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
	ownerNickname: string;
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
		middleUrl: null;
		largeUrl: null;
		player: string;
		ogp: string;
	};
	registeredAt: string;
};
export type VideoMap = { [id: string]: Video };

const sleep = (t: number) => new Promise(r => setTimeout(r, t));
async function main() {
	console.log("fetching all videos...");
	const { data } = await fetch(
		"https://nvapi.nicovideo.jp/v1/tmp/videos?count=-1&_frontendId=6&_frontendVersion=0.0.0",
		{
			next: { revalidate: false },
		},
	).then((r): Promise<ResponseType> => r.json());
	const allvideos = data.videos.map(video => ({
		id: video.id,
		latestCommentSummary: video.latestCommentSummary,
		shortDescription: video.shortDescription,
	}));
	const result_v2 = [];
	for (const [i, video] of allvideos.entries()) {
		console.log(`[${i}/${allvideos.length}] fetching ${video.id}`);
		await sleep(500);
		const videoInfo = await fetchVideoInfo(video.id);
		result_v2.push({ ...video, ...videoInfo });
	}

	const mapped: VideoMap = Object.fromEntries(result_v2.map(v => [v.id, v]));
	writeFileSync("public/videos_v2.json", JSON.stringify(mapped));
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
