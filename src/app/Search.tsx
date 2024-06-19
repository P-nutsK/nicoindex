"use client";
import styles from "./page.module.scss";
import { useFilterValue, useSetFilter } from "./filter";
import { useCallback, useEffect, useRef, useState } from "react";
import { filterAtom } from "./atoms";
import { getDefaultStore } from "jotai";
export function Search() {
	const filter = useFilterValue();
	const isProcessing = useRef(false);
	const setFilter = useSetFilter();
	const [value, setValue] = useState(() => filter.query.join(" "));
	// filterAtomの変更を登録する
	// FIXME: doesn't work
	const store = getDefaultStore();
	useEffect(() => {
		console.log("filter store subscribed");
		const unsub = store.sub(filterAtom, () => {
			console.log("filter changed(sub)");
			const filter = store.get(filterAtom);
			setValue(filter.tag.join(" "));
		});
		return () => {
			console.log("filter unsubscribed");
			unsub();
		};
	}, [store]);
	useEffect(() => console.log("filter changed(effect)"), [filter]);

	const commitFilter = useCallback(
		(value: string) => {
			console.log("filter comitted");
			setFilter(prev => {
				// 前回と一致しているとき
				if (value === prev.tag.join(" ")) return prev;
				if (value === "") {
					return { ...prev, tag: [] };
				}
				return { ...prev, query: value.split(" ") };
			});
		},
		[setFilter],
	);

	return (
		<input
			type="search"
			aria-label="検索ボックス"
			placeholder="タイトル・説明・タグで検索"
			className={styles.search}
			onCompositionStart={() => (isProcessing.current = true)}
			onCompositionEnd={() => {
				isProcessing.current = false;
				commitFilter(value);
			}}
			onChange={e => {
				const new_value = e.target.value;
				console.log("new value:", new_value, "isProcessing:", isProcessing.current);
				setValue(new_value);
				if (isProcessing.current === true) return;
				commitFilter(new_value);
			}}
			value={value}
		/>
	);
}
