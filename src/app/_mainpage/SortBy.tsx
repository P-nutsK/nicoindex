"use client";
import { useAtomValue } from "jotai";
import { sortAtom } from "./atoms";
import { useSetOrganizer, type SortType } from "./organizer/filter";
const textMap: { [x in SortType]: string } = {
	views_desc: "再生数が多い順",
	views_asc: "再生数が少ない順",
	comment_desc: "コメントが多い順",
	comment_asc: "コメントが少ない順",
	likes_desc: "いいねが多い順",
	likes_asc: "いいねが少ない順",
	mylist_desc: "マイリストが多い順",
	mylist_asc: "マイリストが少ない順",
	upload_desc: "投稿が新しい順",
	upload_asc: "投稿が古い順",
};
const sortType = Object.keys(textMap) as SortType[];
export default function SortBy() {
	const sort = useAtomValue(sortAtom);
	const setOrganizer = useSetOrganizer();
	return (
		<select
			value={sort}
			onChange={e => {
				const value = e.target.value as SortType;
				console.log("change to ", value);
				setOrganizer(prev => ({ ...prev, sort: value }));
			}}
		>
			{sortType.map(type => {
				return (
					<option value={type} key={type}>
						{textMap[type]}
					</option>
				);
			})}
		</select>
	);
}
