import { useCallback, useState } from "react";

export function useToggle(initial: boolean): [boolean, () => void] {
	const [value, setValue] = useState(initial);
	const toggle = useCallback(() => setValue(prev => !prev), []);
	return [value, toggle];
}
