import Chart from "react-apexcharts";
const Charts = ({ options, series, type, width }) => {
	return (
		<>
			<Chart options={options} series={series} type={type} width={width} />
		</>
	);
};

export default Charts;
