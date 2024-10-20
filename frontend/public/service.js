'use strict';

importScripts('/example/lib/lodash.js');
//importScripts('/example/lib/lokidb.loki.js');
importScripts('https://cdn.jsdelivr.net/npm/idb@8/build/umd.js');

const DBVersion = 1;
const DBName = "eikendb";
var eikenDB;
const mapFunc = new Map();

async function loadData(event) {
  fetch("/example-backend/api/v1/eiken-words")
    .then(response => console.log(response.status) || response)
    .then(response => response.text())
    .then(body => {
      console.log(`Fetched data from service: ${body}`);
      try {
        let jsonObj = JSON.parse(body);
        // console.log(jsonObj);
        const transaction = eikenDB.transaction(['eikenWords'], 'readwrite');
        const objectStore = transaction.objectStore("eikenWords");
        jsonObj.map((row) => { 
          // console.log(row);
          objectStore.put(row, row.enword);
	})
      } catch(err) {
        console.log(err);
      }
    }).catch(err => {
      console.log(err);
    });

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
          objectStore.put(row, row.id);
	})
      } catch(err) {
        console.log(err);
      }
    }).catch(err => {
      console.log(err);
    });
  return "Data update request has been done.";
}
async function postUserInfo(event) {
  console.log("---------- posting user info");
//  let bodyData = await event.request.body.getReader().read();
//  console.log(bodyData);
  const json = await event.request.json();
  console.log(json);

  const transaction = eikenDB.transaction(['userInfo'], 'readwrite');
  const objectStore = transaction.objectStore("userInfo");
  await objectStore.clear();
  await objectStore.put(json, json.email);
  return "Pushed the user info";
}
  
async function fetchSectionID(event) {
  let url = new URL(event.request.url);
  let level = url.searchParams.get('level');
  let group = url.searchParams.get('group');
  let section = url.searchParams.get('section');

  const transaction = eikenDB.transaction(['eikenLevelInfo'], 'readwrite');
  const objectStore = transaction.objectStore("eikenLevelInfo");
  let data = await objectStore.getAll();
  let ids = _(data).filter(row => { return (row.level === level && row.sublevel === group && row.section === section)}).map("id").uniq().value();
  if (ids.length === 1) {
    return ids[0];
  }else{
    return 0;
  }
}

async function saveCompleteTest(event){
  let url = new URL(event.request.url);
  let level = url.searchParams.get('level');
  let group = url.searchParams.get('group');
  let section = url.searchParams.get('section');

  const jsonData = await event.request.json();
  console.log(`received data from complete test. level: ${level} , group: ${group}, section: ${section} `);
  console.log(jsonData);
  let convertedJsonData;
  try {
    convertedJsonData = _(jsonData).map(row => {
      if(row.answer.toLowerCase().trim() === row.enword.toLowerCase().trim()) {
        row["isCorrect"] = true;
        row["answerSpeed"] = row.time_taken/row.enword.length;
      } else {
        row["isCorrect"] = false;
      }
      return row;
    }).value();

    const transaction = eikenDB.transaction(['eikenHistory'], 'readwrite');
    const objectStore = transaction.objectStore("eikenHistory");
    objectStore.put({ "level": level, "sublevel": group, "section": section, "seq": 1, "data": convertedJsonData}, [level, group, section, 1]);
    let searchData = await objectStore.get([level, group, section, 1]);
    console.log("Fetched data from the compisite keys");
    console.log(searchData);

    const keyRangeValue = IDBKeyRange.bound(['level 2-1', 'A', '0'], ['level 2-1', 'A', '3']);

    let idxRes = await objectStore.getAll(keyRangeValue);
    console.log("Fetched the data from index");
    console.log(idxRes);
  } catch (err) {
    console.log(err);
  }
  console.log(convertedJsonData);
  return "Complete upload data"
}

async function fetchWords4Audio(event) {
  // According to the level/group/section to get the id to fetch the words
  let levelid = await fetchSectionID(event);
  console.log("----- Data from fetchWords4Audio");
  console.log(levelid);

  const transaction = eikenDB.transaction(['eikenWords'], 'readwrite');
  const objectStore = transaction.objectStore("eikenWords");
  let data = await objectStore.getAll();

  console.log("Fetch words in the fetchWords4Audio");
  console.log(data);
  let words = _(data).filter(row => { return (row.levelid === levelid)} ).map(_v => _.pick(_v, ["id", "enword"])).sortBy(["id"]).value();
  // let words = _(data).filter(row => { return (row.levelid === 1)} ).value();
  console.log(words);
  return JSON.stringify(words); 
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
  let url = new URL(event.request.url);
  let level = url.searchParams.get('level');

  const transaction = eikenDB.transaction(['eikenLevelInfo'], 'readwrite');
  const objectStore = transaction.objectStore("eikenLevelInfo");
  let data = await objectStore.getAll();
  console.log("Fetching data from  fetchEikenGroups");
  console.log(data);
  let groups = _(data).filter(row => { return (row.level === level)} ).map("sublevel").uniq();
  console.log(groups);
  return JSON.stringify(groups); 
}

async function fetchEikenGroupSections(event) {
  let url = new URL(event.request.url);
  let level = url.searchParams.get('level');
  let sublevel = url.searchParams.get('group');

  const transaction = eikenDB.transaction(['eikenLevelInfo'], 'readwrite');
  const objectStore = transaction.objectStore("eikenLevelInfo");
  let data = await objectStore.getAll();
  console.log("Fetching data from  fetchEikenGroups");
  console.log(data);
  let sections = _(data).filter(row => { return (row.level === level && row.sublevel === sublevel) }).map("section").uniq();
  console.log(sections);
  return JSON.stringify(sections); 
}

self.addEventListener('install', async event => {
  console.log('installing service worker');
 
  eikenDB = await idb.openDB(DBName, DBVersion, {
    upgrade(db, oldVersion, newVersion, transaction, event) {
      const eikenHistoryStore = event.target.result.createObjectStore('eikenHistory'  , { keypath: ["level", "sublevel", "section", "seq"] } );
      eikenHistoryStore.createIndex('eikenHistoryIdx01', ["level", "sublevel", "section"], {unique: false});

      event.target.result.createObjectStore('eikenLevelInfo', { keypath: 'id' });
      event.target.result.createObjectStore('eikenWords'    , { keypath: 'id' });
      event.target.result.createObjectStore('userEikenLevel');



      event.target.result.createObjectStore('userInfo');
    },
  });

   // mapping initialization  
   const mapGetFunc = new Map();
   mapGetFunc["/example-backend/api/v1/eiken-level-info"]         = fetchEikenlevelInfo;
   mapGetFunc["/example-backend/api/v1/eiken/groups"]             = fetchEikenGroups;
   mapGetFunc["/example-backend/api/v1/eiken/sections"]           = fetchEikenGroupSections;
   mapGetFunc["/example-backend/api/v1/data/word-audio-2-write"]  = fetchWords4Audio;
   mapFunc["GET"] = mapGetFunc;

   const mapPutFunc = new Map();
   mapPutFunc["/example-backend/api/v1/load-data"]    =  loadData;
   mapFunc["PUT"] = mapPutFunc;

   const mapPostFunc = new Map();
   mapPostFunc["/example-backend/api/v1/user-info"]   =  postUserInfo;
   mapPostFunc["/example-backend/api/v1/data/complete-test"]   =  saveCompleteTest;
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

  console.log(`method: ${event.request.method} url: ${url}, pathname: ${url.pathname}, level: ${url.searchParams.get('level')}`);
  console.log(url);
  if(url === undefined) { return }
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
