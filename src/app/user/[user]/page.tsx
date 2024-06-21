import type { SearchParams } from "@/types";
import Page_ from "../../_mainpage/page";

export default function Page({
	searchParams,
	params: { user },
}: { searchParams: SearchParams; params: { user: string } }) {
	return Page_({ searchParams, user: decodeURIComponent(user) });
}

// export function generateMetadata({ params: { user } }: { params: { user: string } }): Metadata {
// return { title: `${decodeURIComponent(user)}さんのアップロードした動画 | nicoindex`, };
// }
