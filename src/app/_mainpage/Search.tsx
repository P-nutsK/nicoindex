"use client";
import { useAtomValue } from "jotai";
import { useCallback, useRef, useState } from "react";
import { queryAtom } from "./atoms";
import { useSetOrganizer } from "./organizer/filter";
import styles from "./page.module.scss";

export function Search() {
	const query = useAtomValue(queryAtom);
	const isProcessing = useRef(false);
	const setFilter = useSetOrganizer();
	const [value, setValue] = useState(query ?? "");
	const [prevQuery, setPrevQuery] = useState(query);
	if (prevQuery !== query) {
		setPrevQuery(query);
		setValue(query ?? "");
	}

	const commitFilter = useCallback(
		(value: string) => {
			console.log("filter comitted");
			setFilter(prev => {
				// 前回と一致しているとき
				if (value === prev.query) return prev;
				if (value === "") {
					return { ...prev, query: null };
				}
				return { ...prev, query: value };
			});
		},
		[setFilter],
	);

	return (
		<input
			type="search"
			aria-label="検索ボックス"
			placeholder="タイトル・説明・タグ・ユーザー名で検索"
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
				console.log(isProcessing.current ? "commit skiped" : "comitted");
				if (isProcessing.current === true) return;
				commitFilter(new_value);
			}}
			value={value}
		/>
	);
}
