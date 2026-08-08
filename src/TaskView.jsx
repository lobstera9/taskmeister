import { useParams, useNavigate } from "react-router-dom";
import { formatDateTime } from "./Date.js";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { SignalIcon } from "@heroicons/react/24/solid";
import { deleteDataById, getAllData, getById, updateData, addData } from "./Dao.js";
import { getStoreName } from "./DaoConst.js";
import { getCss, priority } from "./Constants.js";
import Markdown from "./Markdown";
import MarkdownRenderer from "./MarkdownRenderer";
import Mermaid from "./Mermaid";
import Card from "./Card";

const TaskView = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	// State managing the dynamic inline viewing chain
	const [activeTaskId, setActiveTaskId] = useState(parseInt(id));
	const [taskHistory, setTaskHistory] = useState([]);

	const [descEdit, setDescEdit] = useState(false);
	const [domains, setDomains] = useState([]);
	const [titleEdit, setTitleEdit] = useState(false);
	const [domainEdit, setDomainEdit] = useState(false);
	const [diagramEdit, setDiagramEdit] = useState(false);

	const [subtasks, setSubtasks] = useState([]);
	const [newSubtask, setNewSubtask] = useState({
		title: "",
		description: "",
		priority: 0,
	});

	const [task, setTask] = useState({
		created_at: null,
		in_progress_at: null,
		completed_at: null,
		title: null,
		description: null,
		priority: null,
		status: null,
		diagram: null,
		domain_name: null,
		parent_id: null,
	});

	// Handle Back button with historical context memory
	const handleBack = () => {
		if (taskHistory.length > 0) {
			const previousHistory = [...taskHistory];
			const prevId = previousHistory.pop();
			setTaskHistory(previousHistory);
			setActiveTaskId(prevId);
		} else {
			navigate(-1); // Exit completely back to Form landing page
		}
	};

	// Drill down into a subtask without changing page routes
	const handleDrillDown = (subtaskId) => {
		setTaskHistory([...taskHistory, activeTaskId]);
		setActiveTaskId(subtaskId);
	};

	const handleChange = (args) => {
		setTask({
			...task,
			[args.target.name]: args.target.value,
		});
	};

	const handleNewSubtaskChange = (args) => {
		setNewSubtask({
			...newSubtask,
			[args.target.name]: args.target.value,
		});
	};

	const fetchTaskData = async () => {
		const currentTask = await getById(activeTaskId, getStoreName("task_store"));
		setTask(currentTask);

		const allTasks = await getAllData(getStoreName("task_store"));
		const directChildren = allTasks.filter((t) => t.parent_id === activeTaskId);
		setSubtasks(directChildren);
	};

	const handleDelete = () => {
		deleteDataById(task.id, getStoreName("task_store"));
		handleBack();
	};

	const handleTitleEdit = async () => {
		setTitleEdit(!titleEdit);
		if (titleEdit) {
			await updateData(task, getStoreName("task_store"));
			await fetchTaskData();
		}
	};

	const handleDiagramEdit = async () => {
		setDiagramEdit(!diagramEdit);
		if (diagramEdit) {
			await updateData(task, getStoreName("task_store"));
			await fetchTaskData();
		}
	};

	const handleDescEdit = async () => {
		setDescEdit(!descEdit);
		if (descEdit) {
			await updateData(task, getStoreName("task_store"));
			await fetchTaskData();
		}
	};

	const handleDomainEdit = async () => {
		setDomainEdit(!domainEdit);
		if (domainEdit) {
			await updateData(task, getStoreName("task_store"));
			await fetchTaskData();
		}
	};

	const handleAddSubtask = async () => {
		if (!newSubtask.title.trim()) return;

		var data = {
			created_at: new Date(),
			in_progress_at: null,
			completed_at: null,
			title: newSubtask.title,
			description: newSubtask.description,
			priority: newSubtask.priority,
			status: "PENDING",
			diagram: null,
			domain_name: task.domain_name || "",
			parent_id: activeTaskId, // Bound to current task context
		};

		await addData(data, getStoreName("task_store"));
		setNewSubtask({ title: "", description: "", priority: 0 });
		await fetchTaskData();
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
			var data = await getById(id, getStoreName("task_store"));
			if (status === "COMPLETED") {
				await incrementPriorities();
				data.completed_at = new Date();
			} else if (status === "IN_PROGRESS") {
				data.in_progress_at = new Date();
			}
			data.status = status;
			await updateData(data, getStoreName("task_store"));
			await fetchTaskData();
		}
	};

	const initializeDomains = async () => {
		var domainData = await getAllData(getStoreName("domain_store"));
		setDomains(domainData);
	};

	useEffect(() => {
		fetchTaskData();
		initializeDomains();
	}, [activeTaskId]);

	var backBtnCss = "h-9 w-20 text-lime-100 bg-gray-900 rounded-lg cursor-pointer";
	var editBtnCss = "h-5 w-5 text-lime-100 bg-gray-900 rounded-lg cursor-pointer";
	var rowCss = "flex items-center space-x-4 mb-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300";
	var labels = "block text-large font-medium text-gray-700 mb-2";

	return (
		<div className="p-4">
			<button onClick={handleBack} className="mb-4">
				<ChevronLeftIcon className={backBtnCss} />
			</button>

			{/* Breadcrumb Trail Header indicator */}
			{taskHistory.length > 0 && (
				<div className="text-xs text-blue-600 font-semibold mb-2">
					Subtask Level: {taskHistory.length}
				</div>
			)}

			<div className={rowCss}>
				<div className={labels}>Title:</div>
				{!titleEdit ? (
					<>
						{task?.title}
						<PencilIcon onClick={handleTitleEdit} className={editBtnCss} />
					</>
				) : (
					<>
						<input
							type="text"
							className="border border-gray-300"
							value={task.title || ""}
							name="title"
							onChange={handleChange}
							placeholder="enter title"
						/>
						<SignalIcon onClick={handleTitleEdit} className={editBtnCss} />
					</>
				)}
			</div>

			<div>
				<div className={labels}>Description:</div>
				{!descEdit ? (
					<div className={rowCss}>
						<Markdown content={task?.description || ""} />
						<PencilIcon onClick={handleDescEdit} className={editBtnCss} />
					</div>
				) : (
					<div className={rowCss}>
						<textarea
							className="border border-gray-300 caret-gray-900 caret-2"
							value={task.description || ""}
							name="description"
							rows="6"
							cols="90"
							placeholder="enter description"
							onChange={handleChange}
						/>
						<SignalIcon onClick={handleDescEdit} className={editBtnCss} />
					</div>
				)}
			</div>

			<div className={rowCss}>
				<div className={labels}>DOMAIN:</div>
				{!domainEdit ? (
					<>
						{task?.domain_name}
						<PencilIcon onClick={handleDomainEdit} className={editBtnCss} />
					</>
				) : (
					<>
						<select
							value={task.domain_name || ""}
							className="border border-gray-300"
							name="domain_name"
							onChange={handleChange}
						>
							{domains.map((val) => (
								<option key={val.domain_name} value={val.domain_name}>
									{val.domain_name}
								</option>
							))}
						</select>
						<SignalIcon onClick={handleDomainEdit} className={editBtnCss} />
					</>
				)}
			</div>

			<div className="flex space-x-8">
				<div className={rowCss}>
					<div className={labels}>Priority:</div> {task?.priority}
				</div>
				<div className={rowCss}>
					<div className={labels}>Status:</div> {task?.status}
				</div>
			</div>

			<div className="text-xs text-gray-500 mb-4 space-y-1">
				<div><strong>Created:</strong> {formatDateTime(task?.created_at)}</div>
				<div><strong>In Progress:</strong> {formatDateTime(task?.in_progress_at)}</div>
				<div><strong>Completed:</strong> {formatDateTime(task?.completed_at)}</div>
			</div>

			{/* --- SUBTASK KANBAN BOARD SECTION --- */}
			<div className="my-8 border-t pt-6">
				<h3 className="text-xl font-bold text-gray-800 mb-4">Subtasks Board</h3>
				
				<div id="display-sect" className="p-2 flex space-x-4 mb-6">
					<Card
						nodes={{ prev: null, next: "IN_PROGRESS" }}
						cellClickFunc={updateStatus}
						cell="bg-white-700"
						data={subtasks
							.filter((a) => a.status === "PENDING")
							.sort((a, b) => b.priority - a.priority)}
						label={{ title: "Pending Subtasks", color: "bg-blue-500" }}
						css="flex-1 border-2 rounded-lg border-blue-500"
						// Note: If Card component contains a trigger callback for viewing details, 
						// bind it to handleDrillDown(clickedId) instead of standard routing link.
					/>
					<Card
						nodes={{ prev: "PENDING", next: "COMPLETED" }}
						cellClickFunc={updateStatus}
						cell="bg-green-200"
						data={subtasks.filter((a) => a.status === "IN_PROGRESS")}
						label={{ title: "In Progress Subtasks", color: "bg-blue-500" }}
						css="flex-1 border-2 rounded-lg border-blue-500"
					/>
					<Card
						nodes={{ prev: "IN_PROGRESS", next: null }}
						cellClickFunc={updateStatus}
						cell="bg-blue-500"
						data={subtasks
							.filter((a) => a.status === "COMPLETED")
							.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))}
						label={{ title: "Completed Subtasks", color: "bg-blue-500" }}
						css="flex-1 border-2 rounded-lg border-blue-500"
					/>
				</div>

				{/* Quick-list fallback layout block to allow absolute inline infinite click traversal */}
				<div className="bg-gray-50 p-4 rounded-lg border mb-6">
					<div className="font-semibold text-gray-700 mb-2">Subtasks Direct-Drill Hierarchy View:</div>
					{subtasks.length === 0 ? (
						<p className="text-sm italic text-gray-400">No deep nested subtasks yet.</p>
					) : (
						<div className="flex flex-wrap gap-2">
							{subtasks.map(sub => (
								<button 
									key={sub.id} 
									onClick={() => handleDrillDown(sub.id)}
									className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 font-medium rounded-lg border shadow-sm text-sm transition-all"
								>
									{sub.title} ➔
								</button>
							))}
						</div>
					)}
				</div>

				{/* Add Nested Subtask Mini-Form Form */}
				<div className="p-4 border border-gray-300 rounded-lg bg-gray-50 w-[600px]">
					<div className="font-semibold mb-2 text-sm text-gray-700">Add Inner Child Task:</div>
					<div className="space-y-2">
						<input
							type="text"
							className="border border-gray-300 w-full p-1 text-sm bg-white"
							value={newSubtask.title}
							name="title"
							onChange={handleNewSubtaskChange}
							placeholder="Subtask Title"
						/>
						<div className="flex items-center space-x-2">
							<span className="text-xs">Priority:</span>
							<select
								value={newSubtask.priority}
								className="border border-gray-300 text-sm bg-white"
								name="priority"
								onChange={handleNewSubtaskChange}
							>
								{priority.map((val) => (
									<option key={val} value={val}>
										{val}
									</option>
								))}
							</select>
						</div>
						<textarea
							className="border border-gray-300 w-full p-1 text-sm bg-white"
							value={newSubtask.description}
							name="description"
							rows="2"
							placeholder="Subtask Description"
							onChange={handleNewSubtaskChange}
						/>
						<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition" onClick={handleAddSubtask}>
							Create Subtask
						</button>
					</div>
				</div>
			</div>

			{/* Diagram mapping context block rendering */}
			<div>
				<div className={labels}>Task Map:</div>
			</div>
			{!diagramEdit ? (
				<div className="flex items-center">
					<div className={getCss("overflow-content")}>
						<Mermaid chart={task.diagram || ""} />
					</div>
					<PencilIcon onClick={handleDiagramEdit} className={editBtnCss} />
				</div>
			) : (
				<div className={rowCss}>
					<textarea
						className="border border-gray-300 caret-gray-900 caret-2"
						value={task.diagram || ""}
						name="diagram"
						rows="6"
						cols="90"
						placeholder="enter mermaid code"
						onChange={handleChange}
					/>
					<SignalIcon onClick={handleDiagramEdit} className={editBtnCss} />
				</div>
			)}

			<div className="mt-8 border-t pt-4">
				<button className="bg-red-800 rounded-lg text-white px-4 py-2 hover:bg-red-900 transition" onClick={handleDelete}>
					DELETE TASK
				</button>
			</div>
		</div>
	);
};

export default TaskView;
