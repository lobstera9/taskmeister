import { useState,useEffect } from 'react';
import { clearTable,exportDump,importDump,reInitializeStore } from './Dao.js';
import { getCss } from './Constants.js';
const Persistence=()=>{
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
    exportData(data);
  }

  var importData=()=>{
    console.log('importing data');
    importDump(fileContent);
    window.location.reload();
  }

  const exportData = (data) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "taskmeister.json";
    link.click();
  };

  var handleNew=async()=>{
    debugger;
    await handleExport();
    await reInitializeStore();
    window.location.reload();
  }

  return(<div className="p-2">
    <button className={getCss('btnSave')} onClick={handleExport}>Save</button>
    <input className={getCss('btnBrowser')} type="file" onChange={handleFileChange}/>
    {(Array.isArray(fileContent) && fileContent?.length > 0)?<button className={getCss('btnImport')} onClick={importData}>ImportData</button>:<></>}
    <button onClick={handleNew} className={getCss('btnNew')}>NEW</button>
    </div>)
}
export default Persistence;
