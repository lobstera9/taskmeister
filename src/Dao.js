import { schema,getStoreName,stores } from './DaoConst.js'
const dbErrorEvent = (event)=>{
  alert(event.target.error?.message);
  console.log(event.target.error?.message);
}
const onsuccess = (event)=>{
  console.log("Sucesss",event);
}
const onerror = (event)=>{
  console.log("ERROR ::",event.target.error);
  alert(event.target.error);
}

const createConnection = async()=>{
  var db;
  var request;
  request = await indexedDB.open(schema);
  request.onsuccess=(event)=>{
    db=event.target.result;
    db.onerror=onerror;
  }
  request.onerror=onerror;
  request.onupgradeneeded = (event)=>{
    let db = event.target.result;
    stores.forEach((value,key)=>{
      if(!db.objectStoreNames.contains(value.nbme)){
        var objectStore = db.createObjectStore(value.name,{keyPath:value.keyPath,autoIncrement:value.autoIncrement});
      }
    });
  }
}

await createConnection();


export const addData =async(object, store)=>{
  try{
    var request = await indexedDB.open(schema);
    request.onsuccess=(event)=>{
      var db = event.target.result;
      var transaction = db.transaction([store],"readwrite");
      var objectStore = transaction.objectStore(store);
      console.log(object);
      var addRequest = objectStore.add(object);

    }
    request.onerror=(event)=>{
      new Error("unable to open database");
    }
  }catch(e){
    console.log(e);
  }
}

export const getAllData = async(store)=>{
  try{
      var request = await indexedDB.open(schema);
      var data = new Promise((response,reject)=>{
      request.onsuccess= async(event)=>{
        var db = event.target.result;
        var transaction = db.transaction([store],"readwrite");
        var objectStore = transaction.objectStore(store);
        var getRequest = await objectStore.getAll();
        getRequest.onsuccess=(event)=>{
          data=event.target.result
          response(data);
        }
        getRequest.onerror =(event)=>{
          alert(event.target.error);
          reject(event.target.error);
        }
      }

    })
          request.onerror=(event)=>{
      new Error("unable to open database");
    }
    return data;
  }catch(e){
    console.log(e);
  }
}

export const getById = async(id,store)=>{
  try{
      var request = await indexedDB.open(schema);
      var data = new Promise((response,reject)=>{
      request.onsuccess= async(event)=>{
        var db = event.target.result;
        var transaction = db.transaction([store],"readwrite");
        var objectStore = transaction.objectStore(store);
        var getRequest = await objectStore.get(id);
        getRequest.onsuccess=(event)=>{
          data=event.target.result
          response(data);
        }
        getRequest.onerror =(event)=>{
          alert(event.target.error);
          reject(event.target.error);
        }
      }

    })
          request.onerror=(event)=>{
      new Error("unable to open database");
    }
    return data;
  }catch(e){
    console.log(e);
  }
}

export const deleteDataById = async(id,store)=>{
  try{
    var request = await indexedDB.open(schema);
    request.onsuccess=(event)=>{
      var db = event.target.result;
      var transaction = db.transaction([store],"readwrite");
      var objectStore = transaction.objectStore(store);
      var addRequest = objectStore.delete(id);
    }
    request.onerror=(event)=>{
      new Error("unable to open database");
    }
  }catch(e){
    console.log(e);
  }

}
export const updateData = async(object,store)=>{
  try{
    var request = await indexedDB.open(schema);
    request.onsuccess=(event)=>{
      var db = event.target.result;
      var transaction = db.transaction([store],"readwrite");
      var objectStore = transaction.objectStore(store);
      var addRequest = objectStore.put(object);
    }
    request.onerror=(event)=>{
      new Error("unable to open database");
    }
  }catch(e){
    console.log(e);
  }

}
