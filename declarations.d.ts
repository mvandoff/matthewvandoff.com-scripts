declare module 'inline:*' {
	const content: string;
	export default content;
}

interface Window {
	IS_DEV?: boolean;
}
