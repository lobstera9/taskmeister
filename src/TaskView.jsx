import { useParams } from 'react-router-dom';
import { formatDateTime } from './Date.js';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useState,useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { SignalIcon } from '@heroicons/react/24/solid';
import { getById,deleteDataById,updateData,getAllData } from './Dao.js';
import { getStoreName } from './DaoConst.js';
import { useNavigate } from 'react-router-dom';
import Markdown from './Markdown';
import MarkdownRenderer from './MarkdownRenderer';

const TaskView=()=>{
  const navigate = useNavigate();
  const [descEdit,setDescEdit] = useState(false);
  const[domains,setDomains] = useState([]);
  const [titleEdit,setTitleEdit] = useState(false);
  const [domainEdit,setDomainEdit] = useState(false);
  const { id } = useParams();
  const[task,setTask] = useState(
    {
      'created_at': null,
      'in_progress_at': null,
      'completed_at': null,
      'title': null,
      'description': null,
      'priority': null,
      'status': null,
      'domain_name':null
    }
  );
  const handleBack=()=>{
    navigate(-1);
  }

  const handleChange=(args)=>{
    setTask({
      ...task,
      [args.target.name]:args.target.value
    });
  }

  const fetchById=async()=>{
    getById(parseInt(id),getStoreName('task_store')).then((a)=>{
      console.log(a);
      setTask(a);
    });
  }
  const handleDelete =()=>{
    deleteDataById(task.id,getStoreName('task_store'));
    handleBack()
  }
  const handleTitleEdit=async()=>{
    setTitleEdit(!titleEdit);
    if(titleEdit){
      await updateData(task,getStoreName('task_store'));
      await fetchById;
    }
  }
  const handleDescEdit=async()=>{
    setDescEdit(!descEdit);
    if(descEdit){
      await updateData(task,getStoreName('task_store'));
      await fetchById;
    }
  }
  const handleDomainEdit=async()=>{
    setDomainEdit(!domainEdit);
    if(domainEdit){
      await updateData(task,getStoreName('task_store'));
      await fetchById;
    }
  }
  const initializeDomains =async()=>{
    var domainData = await getAllData(getStoreName('domain_store'));
    setDomains(domainData);
  }
  useEffect(()=>{
    fetchById();
    initializeDomains();
  },[]);
    var backBtnCss = "h-9 w-20 text-lime-100 bg-gray-900 rounded-lg";
    var editBtnCss = "h-5 w-5 text-lime-100 bg-gray-900 rounded-lg";
    //var rowCss = "flex items-center space-x-4 mb-4";
    var rowCss = "flex items-center space-x-4 mb-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300";
    var labels = "block text-large font-medium text-gray-700 mb-2";
    return(<>
      <button onClick={handleBack}><ChevronLeftIcon className={backBtnCss}/></button>
      <div className={rowCss}><div className={labels}>Title:</div>{!titleEdit?<>{task?.title}<PencilIcon onClick={handleTitleEdit} className={editBtnCss}/></>:<><input type='text' className="border border-gray-300" value={task.title} name='title' onChange={handleChange} placeholder='enter title'/><SignalIcon onClick={handleTitleEdit} className={editBtnCss}/></>}</div>
      <div><div className={labels}>Description:</div>
          {!descEdit?<div className={rowCss}><Markdown content={task?.description}/><PencilIcon onClick={handleDescEdit} className={editBtnCss}/></div>:<div className={rowCss}><textarea className="border border-gray-300 caret-gray-900 caret-2" value={task.description} name="description" rows="12" cols="90" placeholder='enter description' onChange={handleChange}/><SignalIcon onClick={handleDescEdit} className={editBtnCss}/></div>}
      </div>
      <div className={rowCss}><div className={labels}>DOMAIN:</div>{!domainEdit?<>{task?.domain_name}<PencilIcon onClick={handleDomainEdit} className={editBtnCss}/></>:<>
        <select value={task.domain_name} className="border border-gray-300" name='domain_name' onChange={handleChange}>
          {domains.map((val,index)=>{
          return(<option key={val.domain_name} value={val.domain_name}>{val.domain_name}</option>)
          })}
        </select>
        <SignalIcon onClick={handleDomainEdit} className={editBtnCss}/></>}</div>
      <div className={rowCss}><div className={labels}>Priority:</div> {task?.priority}</div>
      <div className={rowCss}><div className={labels}>Status:</div>{task?.status}</div>
      <div className={rowCss}><div className={labels}>Task Creation date:</div> {formatDateTime(task?.created_at)}</div>
      <div className={rowCss}><div className={labels}>In Progress date:</div>{formatDateTime(task?.in_progress_at)}</div>
      <div className={rowCss}><div className={labels}>Completion Date:</div>{formatDateTime(task?.completed_at)}</div>
      <button className="bg-red-800 rounded-lg" onClick={handleDelete}>DELETE</button>
      </>);
}
  
export default TaskView;
