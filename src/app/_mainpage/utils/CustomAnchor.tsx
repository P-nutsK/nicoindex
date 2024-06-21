import { memo } from "react";

function CustomAnchor({
	onLocalNavigationClick,
	...props
}: { onLocalNavigationClick: React.MouseEventHandler<HTMLAnchorElement> } & Omit<
	React.ComponentPropsWithRef<"a">,
	"onClick"
>) {
	return (
		<a
			{...props}
			onClick={e => {
				if (e.button === 1 || e.shiftKey || e.ctrlKey || e.metaKey) {
					return;
				}
				e.preventDefault();
				return onLocalNavigationClick(e);
			}}
		></a>
	);
}

export default memo(CustomAnchor);
