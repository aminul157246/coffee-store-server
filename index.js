const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;

// middleware
app.use(cors())
app.use(express.json())

// MONGODB 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.6v8amsy.mongodb.net/?retryWrites=true&w=majority`;


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
    await client.connect();
    
    // const database = client.db("insertDB");
    // const haiku = database.collection("haiku");
    const coffeeCollection = client.db('coffeeDB').collection('coffee')
    const userCollection = client.db('coffeeDB').collection('user')
    





  // send __COFFEE__ data in server from here
  app.post('/coffee', async(req, res)=> {
    const newCoffee = req.body
    console.log(newCoffee);
    const result = await coffeeCollection.insertOne(newCoffee);
    res.send(result)
  })

  // USER 

  // get READ ?
  app.get('/user', async(req, res)=> {
    const cursor = userCollection.find()
    const users = await cursor.toArray()
    res.send(users)
  })

  app.post('/user' , async(req, res) => {
    const user = req.body
    console.log(user);
    const result = await userCollection.insertOne(user)
    res.send(result)
  })
// delete 
app.delete('/user/:id', async(req, res)=> {
  const id = req.params.id
  const query = {_id : new ObjectId(id)}
  const result = await userCollection.deleteOne(query)
  res.send(result)
})


// update 
  app.patch('/user', async(req, res)=> {
    const user = req.body
    const filter = {email : user.email}
    const updatedDoc = {
      $set : {
        lastLoggedAt  : user.lastLoggedAt
      }
    }
    const result = await userCollection.updateOne(filter, updatedDoc)
    res.send(result)
  })








  // data show in client site (---- READ[many]----)
  app.get('/coffee', async(req,res) => {
    const cursor = coffeeCollection.find()
    const result = await cursor.toArray()
    res.send(result)
  })



//update 
  // find one 
  app.get('/coffee/:id', async(req, res) => {
    const id = req.params.id;
    const query =  {_id : new ObjectId(id)}
    const result = await coffeeCollection.findOne(query)
    res.send(result)
  })

// update 
  app.put('/coffee/:id', async(req, res) => {
    const id = req.params.id
    const filter = {_id : new ObjectId(id)}
    const options = {upsert : true}
    const updatedCoffee = req.body
    const coffee = {
      $set : {
        name : updatedCoffee.name,
        quantity : updatedCoffee.quantity,
        supplier : updatedCoffee.supplier, 
        taste : updatedCoffee.taste, 
        category : updatedCoffee.category, 
        details : updatedCoffee.details, 
        photo  : updatedCoffee.photo,
      }
    } 
    const result = await coffeeCollection.updateOne(filter,coffee,options)
    res.send(result)
  })


  // delete a operation
  app.delete('/coffee/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await coffeeCollection.deleteOne(query)
    res.send(result)
  })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/',(req, res)=> {
    res.send('coffee-server-shop-running')
})

app.listen(port, () => {
    console.log(`Coffee server is running on port : ${port} `);
})