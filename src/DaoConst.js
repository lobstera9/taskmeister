export const schema = 'do_db';
export const cur_version = "2";

//version 1: task_store added 
//version 2: file_store added

export const stores = new Map([
  ['task_store',{'name':'task_list','keyPath':'id','autoIncrement':true}],//version 1
  ['file_store',{'name':'file_name','keyPath':'id','autoIncrement':true}] //version 2
]);

export const getStoreName =(name)=>{
  return stores.get(name)?.name;}
