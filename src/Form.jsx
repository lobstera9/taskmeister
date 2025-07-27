import { useEffect, useState } from "react";
import {
	addData,
	deleteDataById,
	getAllData,
	getById,
	updateData,
} from "./Dao.js";
import { getStoreName } from "./DaoConst.js";
import { formatDate } from "./Date.js";
import { SignalIcon } from "@heroicons/react/24/solid";
import { getCss, priority } from "./Constants.js";
import Card from "./Card";
import Persistence from "./Persistence";
import Statistics from "./Statistics";
const Form = () => {
	const [task, setTask] = useState({
		title: "",
		domain_name: "",
		description: "",
		priority: 0,
		status: "PENDING",
		created_at: "",
		in_progress_at: "",
		completed_at: "",
	});
	const [domainEdit, setDomainEdit] = useState(false);
	const [domains, setDomains] = useState([]);
	const [domain, setDomain] = useState({ domain_name: "" });
	const [taskList, setTaskList] = useState([]);
	useEffect(() => {
		populateTaskList();
	}, []);
	const populateTaskList = async () => {
		var data = await getAllData(getStoreName("task_store"));
		setTaskList(data);
		var domainsData = await getAllData(getStoreName("domain_store"));
		setDomains(domainsData);
	};
	const handleDomainChange = (arg) => {
		setDomain({
			...domain,
			[arg.target.name]: arg.target.value,
		});
	};
	const handleSubmit = () => {
		var data = {
			created_at: new Date(),
			in_progress_at: null,
			completed_at: null,
			title: task.title,
			description: task.description,
			priority: task.priority,
			status: task.status,
			diagram: null,
			domain_name: task.domain_name,
		};
		addData(data, getStoreName("task_store"));
		setTask({
			title: "",
			description: "",
			priority: 0,
			status: "PENDING",
			created_at: "",
			in_progress_at: "",
			completed_at: "",
			domain_name: "",
		});
		populateTaskList();
	};
	const handleChange = (arg) => {
		setTask({
			...task,
			[arg.target.name]: arg.target.value,
		});
	};

	const handleDelete = (id) => {
		deleteDataById(id, getStoreName("task_store"));
		populateTaskList();
	};

	const incrementPriorities = async () => {
		var data = await getAllData(getStoreName("task_store"));
		data.forEach((a) => {
			a.priority = a.priority === 10 ? a.priority : parseInt(a.priority) + 1;
			updateData(a, getStoreName("task_store"));
		});
	};
	const updateStatus = async (id, status) => {
		if (status) {
			console.log("updating status for id ", id, status);
			var data = await getById(id, getStoreName("task_store"));
			if (status === "COMPLETED") {
				await incrementPriorities();
				data.completed_at = new Date();
			} else if (status === "IN_PROGRESS") {
				data.in_progress_at = new Date();
			}
			data.status = status;
			await updateData(data, getStoreName("task_store"));
			populateTaskList();
		}
	};

	const handleDomainEdit = async () => {
		setDomainEdit(!domainEdit);
		if (domainEdit && domain.domain_name && domain.domain_name !== "") {
			await addData(domain, getStoreName("domain_store"));
			await populateTaskList();
			setDomain({ domain_name: "" });
		}
	};

	return (
		<>
			<div id="display-sect" className="p-2 flex space-x-4">
				<Card
					nodes={{ prev: null, next: "IN_PROGRESS" }}
					cellClickFunc={updateStatus}
					cell="bg-white-700 "
					data={taskList
						.filter((a) => a.status === "PENDING")
						.sort((a, b) => b.priority - a.priority)}
					label={{ title: "Pending", color: "bg-blue-500" }}
					css="flex-1 border-2 rounded-lg border-blue-500"
				/>
				<Card
					nodes={{ prev: "PENDING", next: "COMPLETED" }}
					cellClickFunc={updateStatus}
					cell="bg-green-200 "
					data={taskList.filter((a) => a.status === "IN_PROGRESS")}
					label={{ title: "In Progress", color: "bg-blue-500" }}
					css="flex-1 border-2 rounded-lg border-blue-500"
				/>
				<Card
					nodes={{ prev: "IN_PROGRESS", next: null }}
					cellClickFunc={updateStatus}
					cell="bg-blue-500"
					data={taskList
						.filter((a) => a.status === "COMPLETED")
						.sort(
							(a, b) => new Date(b.completed_at) - new Date(a.completed_at),
						)}
					label={{ title: "Completed", color: "bg-blue-500" }}
					css="flex-1 border-2 rounded-lg border-blue-500"
				/>
			</div>
			<div className="flex">
				<div id="input-form" className="p-10 border w-[1000px] border-gray-300">
					<div>
						TITLE:
						<input
							type="text"
							className="border border-gray-300"
							value={task.title}
							name="title"
							onChange={handleChange}
							placeholder="enter title"
						/>
					</div>
					<div>
						PRIORITY:
						<select
							value={task.priority}
							className="border border-gray-300"
							name="priority"
							onChange={handleChange}
						>
							{priority.map((val, index) => {
								return (
									<option key={val} value={val}>
										{val}
									</option>
								);
							})}
						</select>
					</div>
					<div className="flex">
						DOMAIN:
						<select
							value={task.domain_name}
							className="border border-gray-300"
							name="domain_name"
							onChange={handleChange}
						>
							{domains.map((val, index) => {
								return (
									<option key={val.domain_name} value={val.domain_name}>
										{val.domain_name}
									</option>
								);
							})}
						</select>
						{!domainEdit ? (
							<button onClick={handleDomainEdit} className={getCss("btnSave")}>
								ADD DOMAIN
							</button>
						) : (
							<>
								<input
									type="text"
									name="domain_name"
									value={domain.domain_name}
									onChange={handleDomainChange}
									placeholder="enter domain name"
								/>
								<SignalIcon
									onClick={handleDomainEdit}
									className={getCss("btnEdit")}
								/>
							</>
						)}
					</div>
					<div>
						<textarea
							className="border border-gray-300"
							value={task.description}
							name="description"
							rows="10"
							cols="50"
							placeholder="enter description"
							onChange={handleChange}
						/>
					</div>
					<button className={getCss("btnSave")} onClick={handleSubmit}>
						submit
					</button>
					<div id="persistence-section" className="w-[900px]">
						<Persistence />
					</div>
				</div>
				<div
					id="stats-section"
					className="p-2 border border-gray-300 w-[1000px]"
				>
					<Statistics tasks={taskList} />
				</div>
			</div>
		</>
	);
};
export default Form;
