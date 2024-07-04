const express = require('express')
const redis = require('redis');
const bodyParser = require('body-parser');
//const fetch = require('node-fetch');
const crypto = require('crypto');
const cors = require('cors');

const admin = require("firebase-admin");

const serviceAccount={
  "type": "service_account",
  "project_id": "memeloard-4f850",
  "private_key_id": "acb333f101fb636251bb1dfc74d16afb3cc70361",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZA/IJH/xGgXcQ\nz+PUUM+4PcCUquhnuyRzTvx14/3MxpdiA82pAifu432kf2MXKf6S9zVXZimW+s+H\nLDs6Agh0e3LUBSYf1JVenqleBzS45CQtvnLdX70NbMfUs/RZR9pm2wuz0Q8klzA7\nGLIcC5tvq/UqoavNcuSAxh+4dl//z+6flaUaqLUc4BX/eSdriKPJmuB39qlGGMV1\nnDrhZD5sS8kUuGbcKSr8RKIYTlnkh59nW+w8gnawktNCb0gP8Gz/qIeEve6Blb9M\nNg63hHX2mODWP2FQNtU2i0pCMkVf75DZA3suhsyYXTWklsJVt065sCcIkUyi1QO1\nBV+yU30BAgMBAAECggEAJhlAuSRh5DjfX9a3bzM+vGAu+oqkoW1j4VB5FvNPP8+P\njRgQ135250QN7z6j9VGcjU2UEkNvwr9GhrsXrL/lnxl7F8jNoCHwlTtyjXzjXyBC\nT7uTK9Ueeghibq+nErOAHrWO8OMfbvOR9pYH0s+g2rKMKI9Ye4mTnx3pPLefc+fI\n+sShGrnJkEY2cHndKxNHSuSrtesZft1dJGtQ/MhXmdaVerKDFwI+aYdan3rp3MYC\nplNzK/0MzFpcqbc0LgyPDnu3jKRBbANz5nOcJZoAPmoq2Qi7JBiG41M6Zy7zXfah\n2za0CxRd4Iq6Bq/t7i2KHdvhoGOPTrX1uHNGTtnMCQKBgQDxVaQaxjet4wUIvJFb\nTb7mKMi701zdqrdtF5GlToyEWASEwOSGx6MNqWjQswRzNSVaFFbqye1AoVc2fFhe\nLAG1TmEhSIXXO6lSvllF7SglIeDQyyq3J9UO9FQZ0XoRy5+bAxF/nREF0wGkn1o3\nENz2phEmnxHxDKqpDyFhF5KcPQKBgQDmM/rpGMeqB5Bi66fTIGR7nnxEHSr4B8Ol\ng4L7ejoCO5F0BpM1staEexTGcOy7VmWcK6r1gv+jhYt9iGGni7GjaRT6x+kOgv34\nY0lRmjgNIvEP2YQ+5Ku2WmByex/xKhFJEO3k4LemMtlHXOz2pWtosyfAeFWRRTaS\nLOqNeG4cFQKBgBobu78xxoBHWRoS3F7WUFqx+tVnDlrkxydEL3uEverrYsHB5Hc4\nTcmClFZPp6GXFE1keeq4obQmQDsixKSbeivVKOji4afhSnYrJZlNCNTLj3jHIf3i\nj0go4phQczZNoxyv/kqiAV9x7nGS0721U1JTsPNOrjA3wJa9jkzksfW5AoGBAKg7\nGIS8nT2+5V/FRBJgu84zljDY+Avm8K3GnDRXsIjtK3EVVQOLPIX4xMf4wqhtjThC\nGV/uahAAil4lCui8iAcZxkE3UzRNuniJZo2CHLBM9spUdfbYejx7c7x2CnPeAF/b\nRV9cchm9U1h5qprdbM9JDiX0SuQtJqJQvODCQAW5AoGAUOavHNbw2mj6wDkT1NEO\n0xGmc465CA+9UWXVaORh8LasAIm6RQwH7qGmcHkNpZGW/1We6Oja2Zgt1OPKBF5F\n40Re4h8SdJl+AcvFJ1NY8nYHq3MEtMIK/82It8H86trk2CTeAbs1Q4+/VNxYfJ2y\nNpb/DhNlQ2Ze04RAx6tRj3Y=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-jj6bw@memeloard-4f850.iam.gserviceaccount.com",
  "client_id": "115976884072956714431",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jj6bw%40memeloard-4f850.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

fireapp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
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
