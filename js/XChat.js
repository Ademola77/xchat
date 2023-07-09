
 export function Talk2() {
    alert("Hello");
}


export function Xox() {
    prompt("Hello");
}

export function Xox2() {
    prompt("Hello");
}


export function SaveChat(objToSave) //Remember to argument as string from C#.
{
    const indexedDB = window.indexedDB;//There wont be intellisense if you do this: window.indexedDB || window.msIndexedDB || window.mosIndexedDB || window.webkitIndexedDB || window.shimIndexedDB;

    let request = indexedDB.open('XChatDB', 1);

    //Create new database or check version.
    request.onupgradeneeded = () =>
    {
        let db = request.result;
        const Date_OS = db.createObjectStore('Chat', { keyPath: 'DateTime', autoIncrement: false }); //Create new  Object Store.
        Date_OS.createIndex('DateIndex', ['DateTime'], { unique: true }); //Create new index in Object Store.

    }




    //Run if error occured when opening the database.
    request.onerror = () =>
    {
        console.log('Error occured when opening the database');
    }




    //Run when database was succefully opened.
    request.onsuccess = () =>
    {
        let db = request.result;

        let trans = db.transaction('Chat', 'readwrite');
        let chatOsObj = trans.objectStore('Chat');
        let jsonObjToSave = JSON.parse(objToSave); //Convert from jsonString to jsonObject.

            let requstAdd = chatOsObj.add(jsonObjToSave);//Save one after the other.

            requstAdd.onsuccess = (e) => {
                console.log('Saved succesfully');
            }
            requstAdd.onerror = (e) => {
                console.log(e.target.result);
            }
      

        trans.oncomplete = () =>
        {
            db.close();
        }
    }       






}



export function LoadChat() //Remember to argument as string from C#.
{
    let PromiseLoadChat = new Promise((RESOLVE, REJECT) => {

        const indexedDB = window.indexedDB;//There wont be intellisense if you do this: window.indexedDB || window.msIndexedDB || window.mosIndexedDB || window.webkitIndexedDB || window.shimIndexedDB;

        let request = indexedDB.open('XChatDB', 1);

        //Create new database or check version.
        request.onupgradeneeded = () => {
            let db = request.result;
            const Date_OS = db.createObjectStore('Chat', { keyPath: 'DateTime', autoIncrement: false }); //Create new  Object Store.
            Date_OS.createIndex('DateIndex', ['DateTime'], { unique: true }); //Create new index in Object Store.

        }


        //Run if error occured when opening the database.
        request.onerror = () => {
            console.log('Error occured when opening the database');
            REJECT('Error occured when opening the database');
        }


        //Run when database was succefully opened.
        request.onsuccess = () => {
            let db = request.result;

            let trans = db.transaction('Chat', 'readonly');
            let chatOsObj = trans.objectStore('Chat');


            let requstAdd = chatOsObj.getAll();


            requstAdd.onsuccess = (e) => {
                let resultInJsonString = JSON.stringify(requstAdd.result);

                RESOLVE(resultInJsonString);
                console.log('Retrieved chat history succesfully');

            }
            requstAdd.onerror = (e) => {
                console.log(e.target.result);
            }



            //trans.oncomplete = () => {
            //    db.close();
            //}
        }
  });

    PromiseLoadChat.then(() => { console.log("Chat data succesfully returned.") });
    return PromiseLoadChat;
}
