import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Error from './Error';
import Form from './Form';
import TaskView from './TaskView';
function App() {
  return (<div className="font-mono text-2xl antialiased ">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form/>}/>
        <Route path="/form" element={<Form/>}/>
        <Route path="/taskview/:id" element={<TaskView/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </BrowserRouter>
    </div>);
}

export default App;
