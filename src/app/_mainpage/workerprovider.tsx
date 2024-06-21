/*
"use client";
import { createContext, use, useEffect, useRef } from "react";
const isWorkerAvialiable = typeof Worker !== "undefined";
import type { RemoteImpl } from "@/workerimpl";
import { wrap, type RemoteCall } from "minlink/dist/browser.dev";
//import Worker from "../api.worker"
const WorkerContext = createContext<RemoteCall<RemoteImpl> | undefined>(undefined);

 default function WorkerProvider({ children }: { children: React.ReactNode }) {
	console.log("WorkerProvider");
	const api = useRef<RemoteCall<RemoteImpl> | undefined>(undefined);
	if (api.current === undefined) {
		console.log(import.meta.url);
		// if (isWorkerAvialiable) {
		// 	const worker = new Worker(new URL("../api.worker.ts", import.meta.url), { type: "module" });
		// 	console.log(worker);
		// 	api.current = wrap(worker);
		//} else {
		api.current = use(import("../workerfallback").then(r => r.default));
		//}
	}
	useEffect(() => {
		return () => {
			void api.current?.terminate();
		};
	}, []);

	return <WorkerContext.Provider value={api.current}>{children}</WorkerContext.Provider>;
}
 function useWorker() {
	const worker = use(WorkerContext);
	if (worker === undefined) {
		throw new Error("useworker should only be called within a <WorkerProvider>");
	}
	return worker;
}
*/
