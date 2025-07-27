import {
	chartGroups,
	chartTypes,
	getChartTitleByKey,
	getCss,
} from "./Constants.js";
import { useEffect, useState } from "react";
import { formatDate } from "./Date.js";
import { dailyStats } from "./StatsUtils.js";
import Charts from "./Charts";

const Statistics = ({ tasks }) => {
	const [chartStyle, setChartStyle] = useState("bar");
	const [chartData, setChartData] = useState();
	const [groupBy, setGroupBy] = useState({
		key: "status",
		chartTitle: "Total number of tasks by status",
	});
	const [dateRange, setDateRange] = useState({
		startDate: formatDate(new Date()),
		endDate: formatDate(new Date()),
	});

	const handleDateChange = (arg) => {
		setDateRange({
			...dateRange,
			[arg.target.name]: arg.target.value,
		});
	};
	const createStats = () => {
		var data = dailyStats(tasks, groupBy, chartStyle, "STATUS", dateRange);
		setChartData(data);
	};
	useEffect(() => {
		if (tasks) {
			createStats(tasks);
		}
	}, [tasks, groupBy, chartStyle, dateRange]);

	const handleChange = async (arg) => {
		await setGroupBy({
			...groupBy,
			[arg.target.name]: arg.target.value,
		});
	};

	return (
		<div className={getCss("statistics")}>
			<div className={getCss("flex-content-2-items")}>
				<select
					className={getCss("flex-item-half-space")}
					value={groupBy.key}
					name="key"
					onChange={handleChange}
				>
					{chartGroups.map((val, index) => {
						return (
							<option key={val.key} value={val.key}>
								{val.display}
							</option>
						);
					})}
				</select>
				<select
					className={getCss("flex-item-half-space")}
					value={chartStyle}
					onChange={(arg) => setChartStyle(arg.target.value)}
				>
					{chartTypes.map((val, index) => {
						return (
							<option key={val} value={val}>
								{val}
							</option>
						);
					})}
				</select>
				<input
					className={getCss("flex-item-half-space")}
					type="date"
					name="startDate"
					value={dateRange.startDate}
					onChange={handleDateChange}
				/>
				<input
					className={getCss("flex-item-half-space")}
					type="date"
					name="endDate"
					value={dateRange.endDate}
					onChange={handleDateChange}
				/>
			</div>
			<div id="chart-section">
				{!chartData ? (
					<>NO DATA</>
				) : (
					<Charts
						options={chartData.options}
						series={chartData.series}
						type={chartData.type}
						width={chartData.width}
					/>
				)}
			</div>
		</div>
	);
};

export default Statistics;
