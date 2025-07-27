import { cur_version, getStoreName, schema, stores } from "./DaoConst.js";
const dbErrorEvent = (event) => {
	alert(event.target.error?.message);
	console.log(event.target.error?.message);
};
const onsuccess = (event) => {
	console.log("Sucesss", event);
};
const onerror = (event) => {
	console.log("ERROR ::", event.target.error);
	alert(event.target.error);
};
const createConnection = async () => {
	var db;
	var request;
	request = await indexedDB.open(schema, cur_version);
	request.onsuccess = (event) => {
		db = event.target.result;
		db.onerror = onerror;
	};
	request.onerror = onerror;
	request.onupgradeneeded = (event) => {
		let db = event.target.result;
		stores.forEach((value, key) => {
			if (!db.objectStoreNames.contains(value.name)) {
				var objectStore = db.createObjectStore(value.name, {
					keyPath: value.keyPath,
					autoIncrement: value.autoIncrement,
				});
			}
		});
	};
};
await createConnection();
export const addData = async (object, store) => {
	try {
		console.log(
			"Initiating a db open request for Schema ",
			schema,
			" with veriosn ",
			cur_version,
			" to save object ",
			object,
			" in store ",
			store,
		);
		var request = await indexedDB.open(schema, cur_version);
		request.onsuccess = (event) => {
			var db = event.target.result;
			var transaction = db.transaction([store], "readwrite");
			var objectStore = transaction.objectStore(store);
			console.log(object);
			var addRequest = objectStore.add(object);
		};
		request.onerror = (event) => {
			new Error("unable to open database");
		};
	} catch (e) {
		console.log(e);
	}
};
export const getAllData = async (store) => {
	try {
		var request = await indexedDB.open(schema, cur_version);
		var data = new Promise((response, reject) => {
			request.onsuccess = async (event) => {
				var db = event.target.result;
				var transaction = db.transaction([store], "readwrite");
				var objectStore = transaction.objectStore(store);
				var getRequest = await objectStore.getAll();
				getRequest.onsuccess = (event) => {
					data = event.target.result;
					response(data);
				};
				getRequest.onerror = (event) => {
					alert(event.target.error);
					reject(event.target.error);
				};
			};
		});
		request.onerror = (event) => {
			new Error("unable to open database");
		};
		return data;
	} catch (e) {
		console.log(e);
	}
};
export const getById = async (id, store) => {
	try {
		var request = await indexedDB.open(schema, cur_version);
		var data = new Promise((response, reject) => {
			request.onsuccess = async (event) => {
				var db = event.target.result;
				var transaction = db.transaction([store], "readwrite");
				var objectStore = transaction.objectStore(store);
				var getRequest = await objectStore.get(id);
				getRequest.onsuccess = (event) => {
					data = event.target.result;
					response(data);
				};
				getRequest.onerror = (event) => {
					alert(event.target.error);
					reject(event.target.error);
				};
			};
		});
		request.onerror = (event) => {
			new Error("unable to open database");
		};
		return data;
	} catch (e) {
		console.log(e);
	}
};
export const deleteDataById = async (id, store) => {
	try {
		var request = await indexedDB.open(schema, cur_version);
		request.onsuccess = (event) => {
			var db = event.target.result;
			var transaction = db.transaction([store], "readwrite");
			var objectStore = transaction.objectStore(store);
			var addRequest = objectStore.delete(id);
		};
		request.onerror = (event) => {
			new Error("unable to open database");
		};
	} catch (e) {
		console.log(e);
	}
};
export const updateData = async (object, store) => {
	try {
		var request = await indexedDB.open(schema, cur_version);
		request.onsuccess = (event) => {
			var db = event.target.result;
			var transaction = db.transaction([store], "readwrite");
			var objectStore = transaction.objectStore(store);
			var addRequest = objectStore.put(object);
		};
		request.onerror = (event) => {
			new Error("unable to open database");
		};
	} catch (e) {
		console.log(e);
	}
};
export const importDump = async (data) => {
	data.forEach(async (a) => {
		if (!a) {
			return;
		}
		var table = a.table_name;
		await clearTable(table);
		a.table_data?.forEach((data) => {
			addData(data, table);
		});
	});
};
export const exportDump = async () => {
	var request = await indexedDB.open(schema, cur_version);
	return new Promise((resolve, reject) => {
		request.onsuccess = async (event) => {
			var db = event.target.result;
			var stores = db.objectStoreNames;
			var data = [];
			for (const store of stores) {
				var storeDump = await getAllData(store);
				var dumpData = {
					table_name: store,
					table_data: storeDump,
				};
				data.push(dumpData);
			}
			resolve(data);
		};
		request.onerror = (event) => {
			new Error(event.target.error);
			reject(null);
		};
	});
};
export const reInitializeStore = async () => {
	var request = indexedDB.open(schema, cur_version);
	request.onsuccess = (event) => {
		var db = event.target.result;
		var stores = db.objectStoreNames;
		for (const store of stores) {
			clearTable(store);
		}
	};
	request.onerror = (event) => {
		console.log(event.target.error);
	};
};
export const clearTable = async (store) => {
	var request = await indexedDB.open(schema, cur_version);
	request.onsuccess = (event) => {
		var db = event.target.result;
		var transaction = db.transaction([store], "readwrite");
		var objectStore = transaction.objectStore(store);
		objectStore.clear();
	};
	request.onerror = (event) => {
		console.log(event.target.error);
		new Error("unable to open database");
	};
};
