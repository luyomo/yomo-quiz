'use strict';

//importScripts('/tidbonaks/dist/lodash.js');
// importScripts('/tidbonaks/dist/lokidb.loki.js');
importScripts('https://cdn.jsdelivr.net/npm/idb@8/build/umd.js');

const DBVersion = 1;
const DBName = "eikendb";
var eikenDB;
const mapFunc = new Map();

async function loadData(event) {
//  transaction.objectStore('eikenLevelInfo').put({type: "put", functionName: "createTiDBCluster" }, "/tidbonak/api/v1/tidbcluster");

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
  return "Starting to fetch Eiken level info";
}

//
//async function putTiDBCluster(event) {
//  console.log("----- putTiDBCluster -----");
//  let clusterRes = await event.request.clone().json();
//  console.log(clusterRes);
//
//  let mapAKSCluster = new Map();
//  mapAKSCluster["ID"] = 1;
//  mapAKSCluster["JobName"] = "AKSClusterCreation";
//  mapAKSCluster["JobName"] = "AKSClusterCreation";
//  mapAKSCluster["State"  ] = "init";
//
//  let mapParams = new Map();
//  mapParams["ClusterName"  ] = clusterRes.ClusterName  ;
//  mapParams["Region"       ] = clusterRes.Region       ;
//  mapParams["Subscription" ] = clusterRes.Subscription ;
//  mapParams["ResourceGroup"] = clusterRes.ResourceGroup;
//  mapParams["SshKeyList"   ] = clusterRes.SshKeyList   ;
//  mapParams["K8SVersion"   ] = clusterRes.K8SVersion   ;
//  mapParams["CIDR"         ] = clusterRes.CIDR         ;
//
//  mapAKSCluster["Params"] = mapParams;
//
//  console.log(mapAKSCluster);
//
//  let tx = metaDB.transaction('jobs', 'readwrite');
//  let jobs = tx.objectStore('jobs');
//  jobs.put(mapAKSCluster, clusterRes.ClusterName);
////  mapAKSCluster["CreatedAT"] =  GetCurrentTimestamp;
//
//
//// {
////  "ClusterName": "localtest",
////    "ClusterVersion": "v7.5.0",
////    "Region": "eastus",
////    "Subscription": "7a04faac-a110-4796-bf3e-84afd6037b8f",
////    "ResourceGroup": "jp-presale-test",
////    "SshKeyList": "jay-key",
////    "K8SVersion": "1.29.2",
////    "TiDBNumOfNodes": 1,
////    "TiDBVMSize": "2C7G",
////    "TiKVNumOfNodes": 1,
////    "TiKVVMSize": "2C7G",
////    "TiKVDiskSize": 50,
////    "TiFlashNumOfNodes": 1,
////    "TiFlashVMSize": "2C7G",
////    "TiFlashDiskSize": 50,
////    "AppGWID": [
////            ""
////        ],
////    "CIDR": "192.168.1.1/24"
//// }
//  return "Starting to create the tidb cluster";
//}

self.addEventListener('install', event => {
  console.log('installing service worker');
 
   event.waitUntil(
     new Promise((resolve, reject) => {
       const request = self.indexedDB.open(DBName, DBVersion);
  
       request.onerror = event => {
         console.log('error opening IndexedDB');
         console.log(event);
         reject();
       };
  
       request.onsuccess = event => {
         const db = event.target.result;
  
         db.onerror = event => {
           console.log('error opening IndexedDB');
         };
  
         resolve(db);
       };
  
       request.onupgradeneeded = event => {
         event.target.result.createObjectStore('eikenHistory', { keypath: 'id'  });
         event.target.result.createObjectStore('eikenLevelInfo', { keypath: 'id' });
         event.target.result.createObjectStore('eikenWords', {keypath: 'id' });
         event.target.result.createObjectStore('userEikenLevel');
       };
     }).then(db => {
         eikenDB = db;
     })
   );

   
   const mapGetFunc = new Map();
   mapGetFunc["/example-backend/api/v1/eiken-level-info"]    = fetchEikenlevelInfo;

   mapFunc["GET"] = mapGetFunc;

   const mapPutFunc = new Map();
   mapPutFunc["/example-backend/api/v1/load-data"]    =  loadData;

   mapFunc["PUT"] = mapPutFunc;
});

self.addEventListener('activate', event => {
  console.log('activating service worker');

  startPolling(5000); 

  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', async event => {
  let url = new URL(event.request.url);
//  console.log(event.request);

//  console.log("url: ", url.pathname);
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
