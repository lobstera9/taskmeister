export const box1="bg-auto bg-gradient-to-l from-gray-100 to-gray-200 rounded-lg shadow-2xl hover:bg-gray-800";
export const box2="bg-auto hover:bg-gray-800 bg-gradient-to-l from-gray-100 to bg-gray-200 rounded-lg shadow-2xl";
export const grid1 = "grid grid-cols-4 gap-4";
export const priority = [1,2,3,4,5,6,7,8,9,10];
export const compCss = new Map([
  ['btnSave',"bg-green-500 text-white p-2 rounded hover:bg-blue-600"],
  ['btnBrowse',"bg-gray-500 p-2 text-white font-semibold py-2 px-4 rounded-md cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"],
  ['btnImport',"bg-blue-500 p-2 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"],
  ['btnNew',"bg-gray-900 text-white p-2 rounded hover:bg-gray-600"],
  ['btnClear',"bg-red-500 text-white p-2 rounded hover:bg-gray-600"],
  ['btnEdit',"h-5 w-5 text-lime-100 bg-gray-900 rounded-lg"],
  ['overflow-content',"border-2 border-gray-300 h-[800px] w-[1200px] overflow-auto flex"]
])

export const getCss = (name)=>{
  return compCss.get(name);
}
