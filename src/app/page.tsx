import type { SearchParams } from "@/types";
import Page_ from "./_mainpage/page";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
	return Page_({ searchParams, user: null });
}
