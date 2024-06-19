export function Checkbox({
	children,
	title,
	className,
	...props
}: Omit<React.ComponentProps<"input">, "className"> & { className?: string }) {
	return (
		<label className={className} title={title}>
			<input type="checkbox" {...props} />
			{children}
		</label>
	);
}
