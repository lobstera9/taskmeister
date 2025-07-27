import { useEffect, useState } from "react";
import {
	addData,
	clearTable,
	exportDump,
	getAllData,
	importDump,
	reInitializeStore,
} from "./Dao.js";
import { getStoreName } from "./DaoConst.js";
import { getCss } from "./Constants.js";
const Persistence = () => {
	const [fileContent, setFileContent] = useState(null);
	const [fileName, setFileName] = useState({ fileName: null });
	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		const fileName = e.target.files[0]?.name;
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				var content = reader.result;
				try {
					setFileContent(JSON.parse(content));
					var data = { fileName: fileName };
					setFileName(data);
				} catch (e) {
					console.log(e);
				}
				console.log(fileContent);
			};
			reader.onerror = () => {
				console.error("Error reading file");
			};
			await reader.readAsText(file);
		}
	};
	var handleExport = async () => {
		var data = await exportDump();
		exportData(data);
	};

	var importData = async () => {
		console.log("importing data");
		console.log(getStoreName("file_store"));
		importDump(fileContent);
		await addData(fileName, getStoreName("file_store"));
		window.location.reload();
	};

	const exportData = async (data) => {
		var file = await getAllData(getStoreName("file_store"));
		var fileName = file[0];
		let importedFileName = fileName ? fileName.fileName : "TaskMeister.json";
		const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
			JSON.stringify(data),
		)}`;
		const link = document.createElement("a");
		link.href = jsonString;
		link.download = importedFileName;
		link.click();
	};

	var handleNew = async () => {
		await handleExport();
		await reInitializeStore();
		window.location.reload();
	};
	var handleClear = async () => {
		await reInitializeStore();
		window.location.reload();
	};

	return (
		<div className="p-2">
			<button className={getCss("btnSave")} onClick={handleExport}>
				Save
			</button>
			<input
				className={getCss("btnBrowser")}
				type="file"
				onChange={handleFileChange}
			/>
			{Array.isArray(fileContent) && fileContent?.length > 0 ? (
				<button className={getCss("btnImport")} onClick={importData}>
					ImportData
				</button>
			) : (
				<></>
			)}
			<button onClick={handleNew} className={getCss("btnNew")}>
				NEW
			</button>
			<button onClick={handleClear} className={getCss("btnClear")}>
				CLEAR WORKSPACE
			</button>
		</div>
	);
};
export default Persistence;
