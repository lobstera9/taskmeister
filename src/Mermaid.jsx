import mermaid from 'mermaid';
import React, { useEffect,useRef } from 'react';

const Mermaid =({chart})=>{
  const mermaidRef = useRef(null);
  useEffect(()=>{
    if(mermaidRef.current){
      mermaid.initialize({
        startOnLoad:true,
        theme:'default'
      });
      mermaid.contentLoaded();
      const mermaidElement = mermaidRef.current;
      mermaidElement.style.width = "100%";  // Make it 100% width
      mermaidElement.style.height = "1000px";
    }
  },[chart]);
  return (<div ref={mermaidRef} className="mermaid">
      {chart}
    </div>)
}
export default Mermaid;
