import ReactMarkDown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
const Markdown = ({ content }) => {
	const renderers = {
		code: ({ language, value }) => (
			<SyntaxHighlighter style={prism} language={language}>
				{value}
			</SyntaxHighlighter>
		),
	};
	return (
		<>
			<div className="border-2 border-gray-300 h-[400px] w-[1200px] overflow-auto">
				<ReactMarkDown component={renderers}>{content}</ReactMarkDown>
			</div>
		</>
	);
};
export default Markdown;
