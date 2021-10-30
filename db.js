let db;
let openRequest= indexedDB.open("my-db");//create database in local storage
openRequest.addEventListener("success",function(e){
    console.log("success");
    db=openRequest.result;
})
openRequest.addEventListener("error",function(e){
    console.log("error");
})
openRequest.addEventListener("upgradeneeded",function(e){
    console.log("upgradeneeded");
    db=openRequest.result;//here getting acces to database that created
    db.createObjectStore("video",{keyPath:"id"});//here we create object store EX: we create table in sql
    db.createObjectStore("image",{keyPath:"id"});
})