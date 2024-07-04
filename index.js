const express = require('express')
const redis = require('redis');
const bodyParser = require('body-parser');
//const fetch = require('node-fetch');
const crypto = require('crypto');
const cors = require('cors');

const admin = require("firebase-admin");

fireapp = admin.initializeApp({
  credential: admin.credential.cert({
  "type": "service_account",
  "project_id": "memeloard-4f850",
  "private_key_id": "faa6debbe442d7dd0fd9f4d892f83950be70dc51",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLHv1y3jQrlQx1\nsncx/hVnCds6Wg9IjF5Drbni0U4exrros8tnuWJABzxUlVwXLCiM6not21ltd4v1\nmniQMFILCywEJ2Fzpt83PiSNddkZRCZ1YOk41KZkwGSt23PmE4LjeBO3l46IXCJ5\ndPxVMDumafoDRkt6r6TrIfwiNUCbT6efx4/mLd9IsMrXKumgXMaqFgxRBGHwJfPp\nuWpv+zhpG1lAW3Jf64E2OVtLYPehWEBnuqytqBo1/zhXH21ROVlCiq0xPOv85/la\n1YQvVBy5Umzam/3+Gga4M9ul0cZjyoygy/4fRhUAfYCWE+HUduWrERGCwIT0XzLG\nkqnI0iepAgMBAAECggEADR2YaHskG79RUWU/cJUzPRbEFuG7VGgp6w1T8CsrM+4J\noh5/7xfnmfJNqTmGu4FQsf6u+niMLvcV7Ls3dzoDhi6HvlHrpzvadHb5BcBbDxhZ\nMmGaVZ7XirBon9hIhM30OOtnPIbW/4ORf024QGjvpRh5Og5nL8oZKEymuu+81vph\nh8BmdANdenIZa5+utodOsNA9tlj/e9cHzvjLctMMsHwxzBi3rEX5/QE0eBvILtL9\nfGzkaWDge9VS4gyEyLQbBRmFJAbEdlEQLtW9PusLfCIrgFKm/ngtcagEDV5nsK2S\nGXDCgUuM67ci6AePvzjZ36+78grzUBfvW2II+ZqK4QKBgQDpekYgfevNex4V94G8\nNcnHoqsjlSYbZ1f4NHpa/xrAOcvDqpxL4e5HV40Y+4Q/oYPSup3YQrlxfqmO01Rw\nqHw4/gQZG4uXOuAr9vhGSmSxmLKVnvsG7DLAB0J6eFGRjDxFhlB+aqIO6eMrHLgU\n2KR72KiofnwGuDbgFjm7I/QoOQKBgQDetw+Z8Ma0m0/l2JeB8gV8J9y6oZnGamet\nViRPqhM1eMYnFpXNAWAawui5tdOYu2oerL3sQGMDt+AnDL6cVmljKa24JvB5N1vv\nk3LD/Ljy0nxSbnsPl+O+DtlKOhI86b++9WhPYcJVeNQJ75kgQMulsdMhcwpSGeb9\nx6jesfaa8QKBgQCVheQxXNNN1iIvaUIhucTO4EN/1z3/YNC6uUj+y89i+eCgH7xW\n8Is8Dzrim/lXEuYsZ6082YaPw9FtEbRLLevYR/1x4u0j3eXA4jqgMXaJMkR0g8s5\n5LyftEaDzlhWwRu8XsdgHoRIzsrYSl0tpIy6b8ebmN1vJDyoiDNSwTTVKQKBgGTN\n2Krllxqh/Yzb9t9jCuaCKF70y+RJvvlutuqz4RPfwVhp2Y27pKMYOzvrN4W2tjaC\nG0h2cBp7vGIQW6npVrQCZlWmkktbKiqKw3Q/y/pkGM86oEqThgo9ME5vcFfPuPEW\npIrhhZMoKFkC8Hzvtv0dOqG2LyKwBKQzHZUGWccRAoGAPrXB05fraZ1rH4e5MS2Q\nnah6Saczns3kl2DhTxTnh+NI7bQsEliVWN7mg6ZHyZLyeT57VckOYCPejaa8PuL4\nBVowTXFpYeAUQjJYX0Z7mhcBE3YgwruqrY+VBtVDVbZp/rSiSoBJHpT6nJnc8yYJ\nCI3RwzkP80sbdAK2SDA8klM=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-jj6bw@memeloard-4f850.iam.gserviceaccount.com",
  "client_id": "115976884072956714431",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jj6bw%40memeloard-4f850.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
})
});

const db = admin.firestore();
const docRef = db.collection('Rooms')//.doc('user1');

function generateUniqueCode() {
  const currentTime = Date.now().toString(); // Get current timestamp as string
  const hash = crypto.createHash('md5').update(currentTime).digest('hex'); // Generate hash
  const uniqueCode = hash.slice(0, 7); // Extract the first 7 characters of the hash
  return uniqueCode;
}

function generateNameUniqueCode(name) {
  const currentTime = Date.now().toString(); // Get current timestamp as string
  const hash = crypto.createHash('md5').update(name + currentTime).digest('hex'); // Generate hash
  const uniqueCode = hash.slice(0, 7); // Extract the first 7 characters of the hash
  return uniqueCode;
}

const app = express()
const port = 3001
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());


//Join Random Room

app.get('/hello', async (req, res) => {
  res.send("hello");
  console.log("hello");
})

app.post('/jpr', async (req, res) => {
  try {
      const name = req.body.name;
      const ncode = generateNameUniqueCode(name)
      const query = await docRef.where(admin.firestore.FieldPath.documentId(), '==', req.body.url).get();
      //console.log(query.docs[0])
      if (!query.empty) {
        const document = query.docs[0];
        if (Object.keys(document.data().players).length<9){
        await docRef.doc(document.id).update({
          ['players.'+ncode]: {name:name,face:req.body.face}
         });
        //await publisher.publish('Channel2', JSON.stringify({cmd:"update",data:{room:document.id,p:ncode}}));
        res.send({server:"Ok",uid:ncode})
      }
      else{
        res.send({server:"Room is Full"});
      }
      } else {
        res.send({server:"Room Not Found"});
      }
      
    } catch (error) {
      console.error('Error', error);
      res.status(500).send('Error');
    }
});

// Create Players Room
app.post('/cpr', async (req, res) => {
  try {
    
      const name = req.body.name;
      const code = generateUniqueCode()
      const ncode = generateNameUniqueCode(name)
      const json = {
        t: new Date().toLocaleString(),
        players:{
          [ncode]:{name:name,face:req.body.face}
        }

      }
      await docRef.doc(code).set(json)
      
      res.send({url:code,uid:ncode});
    } catch (error) {
      console.error('Error', error);
      res.status(500).send('Error');
    }
});

// Redis 
const client = redis.createClient({
    socket:{
    host: 'redis-15400.c257.us-east-1-3.ec2.redns.redis-cloud.com',
    port: 15400},
    username:'default',
    password: 'gVoXsIfzGLLxfYpwtGKXzf2uYO4ACLGO'
  });

const subscriber = client.duplicate();
const publisher = client.duplicate();

(async () => {
await subscriber.connect();
await subscriber.subscribe('Channel1', (message) => {
  json = JSON.parse(message)// 'message'
  
    if (json.cmd==="delplyr") {
      const fieldPath = new admin.firestore.FieldPath('players', json.data.p);
      docRef.doc(json.data.room).get().then((doc) => {
        if (doc.exists) {
          if (Object.keys(doc.data().players).length===1){
            docRef.doc(json.data.room).delete()
          }
          else{
            docRef.doc(json.data.room).update(fieldPath,admin.firestore.FieldValue.delete()); 
          }
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });    
    }
 
});
})();


client.on('connect', () => {
  console.log('Connected to Redis Cloud');
});

client.on('error', (error) => {
  console.error('Error connecting to Redis:', error);
});

client.connect();
publisher.connect();
app.listen(port, async () => {
  //console.log(await client.json.get('RoomDb'))
  console.log(`Listening on port ${port}`)
})
