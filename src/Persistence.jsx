import { useState } from 'react';
const Persistence=()=>{
  const[fileData,setFileData] = useState([{'table_name':null,'table_data':[]}]);
  const[fileContent,setFileContent] = useState(null);
  const handleFileChange = async(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        var content = reader.result
        setFileContent(content);
        console.log(fileContent);
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };
      await reader.readAsText(file);
    }
  };
  return(<>
    <input type="file" onChange={handleFileChange}/>
    <div>{fileContent}</div>
    </>)
}
export default Persistence;
