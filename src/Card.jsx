import Cell from './Cell';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { getStoreName } from './DaoConst.js';
const Card =({data,label,nodes,css,cell,cellClickFunc,deleteFunction})=>{
  const navigate = useNavigate();
  var labelcss = `${css} border-t ${label.color}`;
  var cellCss = `${cell} flex-1 text-center rounded-lg p-2 border`;
  var cardCss = `${css} h-[500px] overflow-auto`
  const routeToTaskView=(a)=>{
    var url = `/taskview/${a}`;
    navigate(url);
  }
  return(<div className={cardCss}>
    <div className={labelcss}>
      {label.title}
      </div>
      {data.map((a)=>{
        return(<div className="flex items-center justify-between w-full space-x-4"><button className={cellCss} onClick={()=>cellClickFunc(a.id,nodes.prev)}><ChevronLeftIcon className="h-6 w-9"/></button><Cell onClick={()=>routeToTaskView(a.id)} data={a.title} css={cellCss} /><button className={cellCss} onClick={()=>cellClickFunc(a.id,nodes.next)}><ChevronRightIcon className="h-6 w-9"/></button></div>)
      })}
      </div>);
}

export default Card;
