import { getCss } from './Constants.js';
import { useState, useEffect } from 'react';

const Statistics =({tasks})=>{
  const [statByDate,setStatByDate] = useState();
  const [statByDomain,setStatByDomain] = useState();

  useEffect(()=>{
    console.log("changes in tasks object ",tasks);
  },[tasks]);
  return(<div className={getCss('statistics')}></div>)
}

export default Statistics;
