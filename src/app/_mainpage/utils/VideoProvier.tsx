"use client";
// unused
import { Video } from "@/types";
import { useAtomValue } from "jotai";
import { createContext, use, useState } from "react";
import { sortAtom } from "../atoms";
import type { Order, SortAlgorithm, SortType } from "../organizer/filter";

const VideoContext = createContext<Video[]>([]);
export default function VideoProvider({
	videos: initialVideos,
	children,
}: { videos: Video[]; children: React.ReactNode }) {
	const [videos, setVideos] = useState<Video[]>(initialVideos);

	const sort = useAtomValue(sortAtom);
	const [prevSort, setPrevSort] = useState<SortType | null>(null);
	console.log("video sorter check...", sort, prevSort);
	if (sort !== prevSort) {
		setPrevSort(sort);
		const compat = calcSortMethod(prevSort, sort);
		switch (compat) {
			case SortMethod.DoNothing:
				// do nothing
				break;
			case SortMethod.Reverse:
				console.log("reverse video");
				setVideos(video => {
					return video.toReversed();
				});
				break;
			case SortMethod.FullSort: {
				console.log("sorting video to ", sort);
				setVideos(video => {
					const [algorithm, order] = sort.split("_") as [SortAlgorithm, Order];
					switch (algorithm) {
						case "views":
							return video.toSorted((a, b) =>
								order === "asc" ? compareViews(b, a) : compareViews(a, b),
							);
						case "likes":
							return video.toSorted((a, b) =>
								order === "asc" ? compareLikes(b, a) : compareLikes(a, b),
							);
						case "comment":
							return video.toSorted((a, b) =>
								order === "asc" ? compareComments(b, a) : compareComments(a, b),
							);
						case "mylist":
							return video.toSorted((a, b) =>
								order === "asc" ? compareMylist(b, a) : compareMylist(a, b),
							);
						case "upload":
							return video.toSorted((a, b) =>
								order === "asc" ? compareUploaded(b, a) : compareUploaded(a, b),
							);
					}
				});
			}
		}
	}

	return <VideoContext.Provider value={videos}>{children}</VideoContext.Provider>;
}

const enum SortMethod {
	DoNothing,
	Reverse,
	FullSort,
}

function calcSortMethod(a: SortType | null, b: SortType) {
	if (a === null) return SortMethod.FullSort;
	if (a === b) return SortMethod.DoNothing;

	const [a_algorithm] = a.split("_");
	const [b_algorithm] = b.split("_");
	if (a_algorithm === b_algorithm) {
		return SortMethod.Reverse;
	}
	return SortMethod.FullSort;
}

export function useVideos() {
	return use(VideoContext);
}

export function compareViews(a: Video, b: Video) {
	return b.count.view - a.count.view;
}

export function compareLikes(a: Video, b: Video) {
	return b.count.like - a.count.like;
}

export function compareComments(a: Video, b: Video) {
	return b.count.comment - a.count.comment;
}

export function compareMylist(a: Video, b: Video) {
	return b.count.mylist - a.count.mylist;
}

export function compareUploaded(a: Video, b: Video) {
	return b.registeredAtNum - a.registeredAtNum;
}
