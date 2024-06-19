export function toUrlFrendly(arr: string[]) {
	return JSON.stringify(arr).slice(1, -1);
}
export function fromUrlFrendly(str: string): unknown {
	try {
		return JSON.parse(`[${str}]`);
	} catch (error) {
		console.error(error);
		return [];
	}
}

export function formatDate(date: Date) {
	const year = date.getFullYear().toString().substring(2, 4);
	const month = date.getMonth().toString().padStart(2, "0");
	const date_ = date.getDate().toString().padStart(2, "0");
	const hour = date.getHours().toString().padStart(2, "0");
	const minute = date.getMinutes().toString().padStart(2, "0");
	return `${year}/${month}/${date_} ${hour}:${minute}`;
}

export function formatDuration(duration: number) {
	const hour = Math.floor(duration / 3600);
	const minute = Math.floor(duration / 60) % 60;
	const seconds = duration % 60;
	const minutestr = minute.toString().padStart(2, "0");
	const secondsstr = seconds.toString().padStart(2, "0");
	if (hour > 0) {
		return `${hour}:${minutestr}:${secondsstr}`;
	} else {
		return `${minutestr}:${secondsstr}`;
	}
}
