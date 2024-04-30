require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const cors = require('cors');
const app = express();

//middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-jajctcs-shard-00-00.cmkpjft.mongodb.net:27017,ac-jajctcs-shard-00-01.cmkpjft.mongodb.net:27017,ac-jajctcs-shard-00-02.cmkpjft.mongodb.net:27017/?ssl=true&replicaSet=atlas-g9xula-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

//console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    

    const artCollection = client.db('artDB').collection('artCraft');
    const categoryCollection = client.db('artDB').collection('categoryCraft');


    app.get('/allCategory/:subCategory',async(req,res)=>{
      const subCategory= req.params.subCategory;
      const query = { subCategory:  subCategory}
      const result= await artCollection.find(query).toArray();
      res.send(result);

    })

    app.get('/category', async(req,res)=>{
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


   


    app.get('/craft',async(req,res) =>{
      const cursor = artCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/art/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email: email}
      const result = await artCollection.find(query).toArray();
      res.send(result);
    })


    app.get('/art', async(req,res) => {
        const cursor = artCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/list/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {
          _id: new ObjectId(id)
      }
      const result= await artCollection.findOne(query);
      res.send(result);
  })

  
    app.post('/art',async(req, res) =>{
        const newArt = req.body;
        console.log(newArt);
        const result = await artCollection.insertOne(newArt);
        res.send(result);
        
    })


    app.put('/art/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {
          _id: new ObjectId(id)
      }
      const optional = { upsert: true };
      const updatedArt = req.body;
      const Art = {
        $set: {
          subCategory: updatedArt.subCategory,
          item  : updatedArt.item,
          description: updatedArt.description,
          photo: updatedArt.photo,
          price: updatedArt.price,
          rating: updatedArt.rating,
          customization: updatedArt.customization,
          time: updatedArt.time,
          stockStatus:updatedArt.stockStatus
        },
      };
      const result= await artCollection.updateOne(filter,Art,optional);
      res.send(result);
      })


    app.delete('/art/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {
          _id: new ObjectId(id)
      }
      const result= await artCollection.deleteOne(query);
      res.send(result);
  })






    // Send a ping to confirm a successful connection
   // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res) => {
    res.send('ArtCrafts making server is running')
 })
 
 app.listen(port, () =>{
     console.log(`ArtCrafts Server is running on port: ${port}`)
 })