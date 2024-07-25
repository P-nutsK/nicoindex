import { readFileSync } from "fs";
import { join } from "path";
import type { VideoMap } from "../src/types";
import { ResponseType } from "./types";
const prev_videomap = JSON.parse(readFileSync(join(import.meta.dirname, "../videos.json"), "utf-8")) as VideoMap;
const videos = await fetch("https://nvapi.nicovideo.jp/v1/tmp/videos?count=10&_frontendId=6&_frontendVersion=0.0.0")
	.then((r): Promise<ResponseType> => r.json())
	.then(d => d.data.videos);

const iscovered = videos.every(({ id }) => id in prev_videomap);

if (iscovered) {
	console.log("The video file is up to date.");
} else {
	console.log("Update the video list.");
	await import("./generate_videos.js");
}
