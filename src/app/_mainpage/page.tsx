import type { VideoMap } from "@/generate_videos";
import { readFile } from "fs/promises";
import { Provider } from "jotai";
import { join } from "path";
import { Suspense } from "react";
import { styleText } from "util";
import type { SearchParams } from "../../types";
import { Search } from "./Search";
import Tags from "./Tags";
import { UploadedBy } from "./UploadedBy";
import { Videos } from "./Videos";
import styles from "./page.module.scss";
import { filterStringify, parseSearchParams } from "./util";
import { AtomsHydrator } from "./utils/HydrateAtoms";
import { NoScriptDetect } from "./utils/NoScriptDetect";
import { QueryTracker } from "./utils/QueryTracker";
import VideoProvider from "./utils/VideoProvier";

export default async function Page({ searchParams, user }: { searchParams: SearchParams; user: string | null }) {
	console.log(styleText("cyan", `New Request ${new Date().toLocaleString()}`));
	const videomap = JSON.parse(await readFile(join(process.cwd() + "videos.json"), "utf-8")) as VideoMap;
	const videos = Object.values(videomap);
	const filterInit = {
		...parseSearchParams({
			tag: searchParamsAdapter(searchParams["tag"]),
			query: searchParamsAdapter(searchParams["query"]),
			sort: searchParamsAdapter(searchParams["sort"]),
		}),
		user,
	};
	console.log("filter is ", filterInit);
	const noscriptMode = searchParamsAdapter(searchParams["noscript"]) === "true";
	//console.log(filterAtom);
	return (
		<Provider>
			<AtomsHydrator atomValues={{ organizer: filterInit }}>
				<VideoProvider videos={videos}>
					<Suspense>
						<QueryTracker />
					</Suspense>
					<noscript className={styles.noscript}>
						{noscriptMode ? (
							<>
								代替ページです。
								<br />
								代替ページではユーザ体験が損なわれるため、JavaScriptの有効化を推奨します。
							</>
						) : (
							<>
								⚠️このサイトの機能をフルに使用するにはJavaScriptを有効にする必要があります。⚠️
								<br />
								実験的:<a href={filterStringify(filterInit, [["noscript", "true"]])}>代替ページへ</a>
							</>
						)}
					</noscript>
					<NoScriptDetect noscriptMode={noscriptMode} />
					<h1>ニコニコ動画避難所インデックス</h1>
					<UploadedBy />
					<Search />
					<Tags />
					<hr />
					<Videos noscriptMode={noscriptMode} />
				</VideoProvider>
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
