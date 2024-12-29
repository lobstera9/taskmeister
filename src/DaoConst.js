export const schema = 'do_db';

export const stores = new Map([
  ['task_store',{'name':'task_list','keyPath':'id','autoIncrement':true}]
]);

export const getStoreName =(name)=>{
  return stores.get(name)?.name;
}
