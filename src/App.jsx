import { BrowserRouter, Route, Routes,useParams } from "react-router-dom";
import Error from "./Error";
import Form from "./Form";
import TaskView from "./TaskView";
const TaskViewWrapper = () => {
  const { id } = useParams();
  return <TaskView key={id} />;
};
function App() {
	return (
		<div className="font-mono text-2xl antialiased ">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Form />} />
					<Route path="/form" element={<Form />} />
					<Route path="/taskview/:id" element={<TaskViewWrapper />} />
					<Route path="*" element={<Error />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
