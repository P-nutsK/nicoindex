"use client";

//COMPLETED: クエリパラメータで永続化可能にする & 戻るボタンが機能するように

import type { VideoMap, Video } from "@/generate_videos";
import { atom, createStore, Provider, useAtomValue, useSetAtom } from "jotai";
import type { SetStateAction } from "jotai/experimental";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, type Dispatch } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import useSWR from "swr";
import styles from "./page.module.scss";
import { VideoEmbed } from "./VideoEmbed";
import { Checkbox } from "@/components/checkbox";
const store = createStore();
const filterAtom = atom<Filter>({ tag: [], user: null, contain: [] });

export type Filter = {
	tag: string[];
	user: string | null;
	contain: string[];
};

async function fetcher<T>(url: string) {
	const r = await fetch(url);
	return (await r.json()) as T;
}
export default function Page() {
	return (
		<Provider store={store}>
			<QueryTracker />
			<div>
				<h1>ニコニコ動画避難所インデックス</h1>
				<Tags />
				<Videos />
			</div>
		</Provider>
	);
}

function Tags() {
	const videos = useVideos();
	const filter = useAtomValue(filterAtom);

	const sortedTags = useMemo(() => {
		const filiterdVideos = videos ? filterVideos(videos, filter) : [];

		// カウントする
		const _ = new Map<string, number>();
		for (const { tags } of filiterdVideos) {
			for (const tag of tags) {
				_.set(tag.name, (_.get(tag.name) ?? 0) + 1);
			}
		}
		// カウントのエントリ
		const tagCounts = Array.from(_.entries());
		return tagCounts
			.filter(([, count]) => count > 1)
			.sort((a, b) => {
				const CHECKED_WEIGHT = 100000;

				const a_weight = a[1] + (isTagChecked(a[0]) ? CHECKED_WEIGHT : 0);
				const b_weight = b[1] + (isTagChecked(b[0]) ? CHECKED_WEIGHT : 0);
				return b_weight - a_weight;
			});
	}, [filter, videos]);
	return (
		<div className={styles["tag-container"]}>
			{sortedTags.slice(0, 30).map(([tagName, count]) => (
				<Tag key={tagName} tagName={tagName} count={count} />
			))}
		</div>
	);
}

function Tag({ tagName, count }: { tagName: string; count: number }) {
	const setFilter = useSetFilter();
	const changeHandler = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) {
				setFilter(filter => ({ ...filter, tag: [...filter.tag, tagName] }));
			} else {
				setFilter(filter => ({ ...filter, tag: filter.tag.filter(t => t !== tagName) }));
			}
		},
		[setFilter, tagName],
	);
	return (
		<Checkbox
			className={styles.tag}
			onChange={changeHandler}
			checked={isTagChecked(tagName)}
			title={`${tagName} ${isTagChecked(tagName) ? "(選択済み)" : "(選択されていません)"}`}
		>
			{isTagChecked(tagName) ? null : <span className={styles.count}>({count})</span>}
			{tagName}
		</Checkbox>
	);
}

function isTagChecked(tag: string) {
	const filter = store.get(filterAtom);
	return filter.tag.includes(tag);
}

function filterVideos(videos: Video[], filter: Filter) {
	return videos.filter(v => {
		return (
			filter.tag.every(tag => v.tags.some(t => t.name === tag)) &&
			(filter.user ? v.ownerNickname === filter.user : true) &&
			filter.contain.every(text => v.title.includes(text))
		);
	});
}
function Videos() {
	const filter = useAtomValue(filterAtom);
	const videos = useVideos();
	const filterdVideos = videos ? filterVideos(videos, filter) : null;
	if (filterdVideos === null) return null;
	return (
		<VirtuosoGrid
			totalCount={filterdVideos.length}
			data={filterdVideos}
			listClassName={styles.flex}
			itemClassName={styles["flex-item"]}
			useWindowScroll
			itemContent={(_, video) => <VideoEmbed video={video} key={video.id} />}
			overscan={/* px */ 0}
		/>
	);
}

function useVideoMap() {
	const { data } = useSWR("/videos.json", fetcher<VideoMap>);
	return data ?? null;
}
function useVideos() {
	const map = useVideoMap();
	return useMemo(() => (map ? Object.values(map) : null), [map]);
}

export function formatDate(date: Date) {
	const year = date.getFullYear().toString().substring(2, 4);
	const month = date.getMonth().toString().padStart(2, "0");
	const date_ = date.getDate().toString().padStart(2, "0");
	const hour = date.getHours().toString().padStart(2, "0");
	const minute = date.getMinutes().toString().padStart(2, "0");
	return `${year}/${month}/${date_} ${hour}:${minute}`;
}

export function formatDuration(duration: number) {
	const hour = Math.floor(duration / 3600);
	const minute = Math.floor(duration / 60) % 60;
	const seconds = duration % 60;
	const minutestr = minute.toString().padStart(2, "0");
	const secondsstr = seconds.toString().padStart(2, "0");
	if (hour > 0) {
		return `${hour}:${minutestr}:${secondsstr}`;
	} else {
		return `${minutestr}:${secondsstr}`;
	}
}

function useSetFilter(): Dispatch<SetStateAction<Filter>> {
	const setFilterValue = useSetAtom(filterAtom);
	const router = useRouter();
	const pathname = usePathname();
	const setFilter = useCallback(
		(setStateAction: SetStateAction<Filter>) => {
			setFilterValue(prev => {
				let incomming: Filter;
				if (typeof setStateAction === "function") {
					incomming = setStateAction(prev);
				} else {
					incomming = setStateAction;
				}
				// 同じときは副作用を起こさない
				if (prev === incomming) return prev;
				const searchParams = new URLSearchParams();
				if (incomming.tag.length > 0) {
					searchParams.set("tag", toUrlFrendly(incomming.tag));
				}
				if (incomming.contain.length > 0) {
					searchParams.set("contain", toUrlFrendly(incomming.contain));
				}
				if (incomming.user !== null) {
					searchParams.set("user", JSON.stringify(incomming.user));
				}
				const searchString = searchParams.toString();
				router.push(searchString ? `${pathname}?${searchParams.toString()}` : pathname);

				return incomming;
			});
		},
		[setFilterValue, pathname, router],
	);
	return setFilter;
}

function QueryTracker() {
	const setFilter = useSetAtom(filterAtom);
	const searchParams = useSearchParams();
	useEffect(() => {
		console.log(...searchParams.entries());
		const tag = fromUrlFrendly(searchParams.get("tag") ?? "") as string[];
		const contain = fromUrlFrendly(searchParams.get("contain") ?? "") as string[];
		const user = JSON.parse(searchParams.get("user") ?? "null") as string | null;
		setFilter({
			contain,
			tag,
			user,
		});
	}, [setFilter, searchParams]);
	return null;
}

function toUrlFrendly(arr: string[]) {
	return JSON.stringify(arr).slice(1, -1);
}
function fromUrlFrendly(str: string): unknown {
	try {
		return JSON.parse(`[${str}]`);
	} catch (error) {
		console.error(error);
		return [];
	}
}
