'use strict';

importScripts('/example/lib/lodash.js');
//importScripts('/example/lib/lokidb.loki.js');
importScripts('https://cdn.jsdelivr.net/npm/idb@8/build/umd.js');

const DBVersion = 1;
const DBName = "eikendb";
var eikenDB;
const mapFunc = new Map();

async function loadData(event) {
  fetch("/example-backend/api/v1/eiken-level-info")
    .then(response => console.log(response.status) || response)
    .then(response => response.text())
    .then(body => {
      console.log(`Fetched data from service: ${body}`);
      try {
        let jsonObj = JSON.parse(body);
        // console.log(jsonObj);
        const transaction = eikenDB.transaction(['eikenLevelInfo'], 'readwrite');
        const objectStore = transaction.objectStore("eikenLevelInfo");
        jsonObj.map((row) => { 
          // console.log(row);
          objectStore.add(row, row.id);
	})
      } catch(err) {
        console.log(err);
      }
    }).catch(err => {
      console.log(err);
    });
  return "Data update request has been done.";
}

async function fetchEikenlevelInfo(event) {

  const transaction = eikenDB.transaction(['eikenLevelInfo'], 'readwrite');
  const objectStore = transaction.objectStore("eikenLevelInfo");
  let data = await objectStore.getAll();
  console.log("Fetching data from fetchEikenLevelInfo");
  console.log(data);
  return JSON.stringify(data); 
}

async function fetchEikenGroups(event) {
  const transaction = eikenDB.transaction(['eikenLevelInfo'], 'readwrite');
  const objectStore = transaction.objectStore("eikenLevelInfo");
  let data = await objectStore.getAll();
  console.log("Fetching data from  fetchEikenGroups");
  console.log(data);
  let groups = _(data).map("sublevel").uniq();
  console.log(groups);
  return JSON.stringify(groups); 
}
async function fetchEikenGroupSections(event) {
  const transaction = eikenDB.transaction(['eikenLevelInfo'], 'readwrite');
  const objectStore = transaction.objectStore("eikenLevelInfo");
  let data = await objectStore.getAll();
  console.log("Fetching data from  fetchEikenGroups");
  console.log(data);
  let sections = _(data).map("section").uniq();
  console.log(sections);
  return JSON.stringify(sections); 
}

self.addEventListener('install', async event => {
  console.log('installing service worker');
 
  eikenDB = await idb.openDB(DBName, DBVersion, {
    upgrade(db, oldVersion, newVersion, transaction, event) {
      event.target.result.createObjectStore('eikenHistory'  , { keypath: 'id' });
      event.target.result.createObjectStore('eikenLevelInfo', { keypath: 'id' });
      event.target.result.createObjectStore('eikenWords'    , { keypath: 'id' });
      event.target.result.createObjectStore('userEikenLevel');
    },
  });

   // mapping initialization  
   const mapGetFunc = new Map();
   mapGetFunc["/example-backend/api/v1/eiken-level-info"]    = fetchEikenlevelInfo;
   mapGetFunc["/example-backend/api/v1/eiken/groups"]        = fetchEikenGroups;
   mapGetFunc["/example-backend/api/v1/eiken/sections"]      = fetchEikenGroupSections;
   mapFunc["GET"] = mapGetFunc;

   const mapPutFunc = new Map();
   mapPutFunc["/example-backend/api/v1/load-data"]    =  loadData;
   mapFunc["PUT"] = mapPutFunc;

   const mapPostFunc = new Map();
   mapFunc["POST"] = mapPostFunc;
});

self.addEventListener('activate', event => {
  console.log('activating service worker');

  startPolling(5000); 

  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', async event => {
  let url = new URL(event.request.url);
  console.log(event.request);

  console.log(`method: ${event.request.method} url: ${url.pathname}`);
  let theFunc = await mapFunc[event.request.method][url.pathname]
  if(theFunc) {
    console.log("func: ------------------------");
    console.log(theFunc);
    event.respondWith(
      (async () => {
        let res;
        try {
          res = await theFunc(event);
        } catch (err) {
          return await new Response(`Failed to handle the request: ${err}`, {status: 404});
        }

        return await new Response(res);
      })()
    //   new Response(theFunc(event))
    );
  }
});

async function fetchCount() {
  return new Promise((resolve, reject) => {
    let tx = metaDB.transaction('routes', 'readwrite');
    let store = tx.objectStore('routes');

    let request = store.get("count");

    request.onerror = (err) => {
      reject(dbevent)
    };

    request.onsuccess = (dbevent) => {
      if (request.result === undefined) {
        store.put(1, "count");
        resolve(1);
      }else {
        store.put(request.result + 1, "count");
        resolve(request.result)
      }
    };
  })
}

function startPolling(interval) {

  function poll() {
    console.log("Pooling is working.");
    setTimeout(poll, interval);
  }

  poll();
}

function GetCurrentTimestamp() {
  pad2 = (n) => { return n < 10 ? '0' + n : n };
  var date = new Date();
  return  date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() ) ;
}
