export default function generateTitle(user: string | null) {
	return user ? `${user} さんがアップロードした動画 | nicoindex` : `ニコニコ動画（Re:仮）検索 | nicoindex`;
}
