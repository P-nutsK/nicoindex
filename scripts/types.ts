export type ResponseType = {
	meta: {
		status: number;
	};
	data: {
		videos: ApiVideos;
	};
};
export type ApiVideos = {
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
export type ApiWatch$Id = {
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
