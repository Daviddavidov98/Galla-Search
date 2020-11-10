const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
// Creates a client
const client = new vision.ImageAnnotatorClient();

//CHECK CACHE NOT WORKING

// function checkCache(url, name, res){
    
//     const cacheData = require('./cache.json');
//     if(cacheData.length === 0){
//         console.log('Cache is empty');
//         readText(url, name, cacheData, res);
//     }
//     else{
//         for(var i = 0; i < cacheData.length; i++){
//             var imgItem = cacheData[i];
//             //doesnt need to call API
//             if(imgItem.name === name){
//                 console.log(`Item in cache! READ DESCRIPTION FOR ${name} FROM CACHE`)
//                 res.send(imgItem.desc)
//                 return;
//             }
//             //item not in cache
//             if(i === cacheData.length-1){
//                 console.log('Item not in cache; using API');
//                 //Use API 
//                 readText(url, name, cacheData, res);
//             }
//         }
//     }
// }

function readText(url, name, res){
    // Performs label detection on the image files via firebase URL
  client
  .textDetection(`${url}`)
  .then(results => {
      const desc = results[0].fullTextAnnotation.text; 
      res.send(desc);
    //   const newCache = {name: name, desc: desc};
    //   cacheData.push(newCache);
    //   //writes new data pulled from API to CacheFile
    //   fs.writeFile('./cache.json', JSON.stringify(cacheData), 'utf8', function(err){
    //       if(err){
    //           console.log(`Error Updating Cache File: ${err}`);
    //       }
    //       res.send(desc);
    //   })
  })
  .catch(err =>{
      console.log('ERROR:', err);
      res.send('UNKNOWN');
  })
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/readImage', (req, res) => {
    const url = req.body.url
    const name = req.body.name
    readText(url, name, res)
    //checkCache(url, name, res);
});

app.listen(port, () => console.log(`Listening on port ${port}`));