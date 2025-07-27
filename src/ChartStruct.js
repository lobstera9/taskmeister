class ChartStruct {
	constructor(options, series) {
		this.options = options || {};
		this.series = series || [];
		this.type = options?.chart?.type || "";
		this.height = options?.chart?.height || 700;
		this.width = options?.chart?.width || 900;
	}
}

export { ChartStruct };
