const Cell = ({ onClick, data, css }) => {
	return (
		<div role="button" onClick={onClick} className={css}>
			{data}
		</div>
	);
};
export default Cell;
