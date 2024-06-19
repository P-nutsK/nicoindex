import type { VideoMap } from "@/generate_videos";
import { Provider } from "jotai";
import { Suspense } from "react";
import { Search } from "./Search";
import { Tags } from "./Tags";
import { Videos } from "./Videos";
import { QueryTracker } from "./QueryTracker";
import { readFile } from "fs/promises";
import styles from "./page.module.scss";
import { AtomsHydrator } from "./HydrateAtoms";

import { fromUrlFrendly } from "./util";
import { NoScriptDetect } from "./NoScriptWarn";
interface SearchParams {
	[x: string]: string | string[] | undefined;
}
export default async function Page({ searchParams }: { searchParams: SearchParams }) {
	const videomap = JSON.parse(await readFile(process.cwd() + "/src/app/videos.json", "utf-8")) as VideoMap;
	const videos = Object.values(videomap);
	const tag = fromUrlFrendly(searchParamsAdapter(searchParams["tag"]) ?? "") as string[];
	const query = fromUrlFrendly(searchParamsAdapter(searchParams["q"]) ?? "") as string[];
	const user = JSON.parse(searchParamsAdapter(searchParams["user"]) ?? "null") as string | null;
	const noscriptMode = searchParamsAdapter(searchParams["noscript"]) === "true";
	//console.log(filterAtom);
	return (
		<Provider>
			<AtomsHydrator atomValues={{ filter: { tag, query, user } }}>
				<Suspense>
					<QueryTracker />
				</Suspense>
				<noscript className={styles.noscript}>
					{noscriptMode ? (
						<>
							代替ページです。代替ページではパフォーマンスが大きく低下するため、JavaScriptの有効化を推奨します。
						</>
					) : (
						<>
							⚠️このサイトの機能をフルに使用するにはJavaScriptを有効にする必要があります。⚠️
							<br />
							<a href="?noscript=true">代替ページへ</a>
						</>
					)}
				</noscript>
				<NoScriptDetect noscriptMode={noscriptMode} />
				<h1>ニコニコ動画避難所インデックス</h1>
				<Search />
				<Tags videos={videos} />
				<hr />
				<Videos videos={videos} noscriptMode={noscriptMode} />
			</AtomsHydrator>
		</Provider>
	);
}

function searchParamsAdapter(param: string | string[] | undefined) {
	if (param === undefined) return undefined;
	if (typeof param === "string") {
		return param;
	}
	return param.at(-1);
}
