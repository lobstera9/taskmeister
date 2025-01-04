import { useState,useEffect } from 'react';
import { clearTable,exportDump,importDump } from './Dao.js';
const Persistence=()=>{
  const[dumpExport,setDumpExport] = useState([]);
  const[fileContent,setFileContent] = useState(null);
  const handleFileChange = async(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        var content = reader.result
        try{
          setFileContent(JSON.parse(content));
        }catch(e){
          console.log(e);
        }
        console.log(fileContent);
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };
      await reader.readAsText(file);
    }
  };
  var handleExport=async()=>{
    var data = await exportDump();
    await setDumpExport(data);
  }

  var importData=()=>{
    console.log('importing data');
    importDump(fileContent);
    window.location.reload();
  }

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(dumpExport)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "taskmeister.json";
    link.click();
    setDumpExport([]);
  };

  useEffect(()=>{
    if(Array.isArray(dumpExport) && dumpExport.length>0){
      exportData();
    }
  },[dumpExport]);
  return(<>
    <button onClick={handleExport}>EXPORT</button>
    <input type="file" onChange={handleFileChange}/>
    {(Array.isArray(fileContent) && fileContent?.length > 0)?<button onClick={importData}>ImportData</button>:<></>}
    </>)
}
export default Persistence;
