const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mission_scic:lZvKF8IaSMWHTijq@itnabil.agyee9s.mongodb.net/?appName=ItNabil";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("tree_service");
    const serviceCollection = db.collection("services");
    const orderCollection = db.collection("orders");

    // Create Service
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    // Get All Services
    app.get("/services", async (req, res) => {
      const { category } = req.query;
      let query = {};

      if (category) {
        query.category = category;
      }

      const results = await serviceCollection.find(query).toArray();
      res.send(results);
    });

    // Get Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await serviceCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // My Services
    app.get("/my-services", async (req, res) => {
      const { email } = req.query;
      const query = { email };
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });

    // Update Service
    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const result = await serviceCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );
      res.send(result);
    });

    // Delete Service
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await serviceCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // =======================
    // 🔥 ORDER ROUTES
    // =======================

    // Create Order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    // Get Orders by Email (My Orders Page)
    app.get("/orders", async (req, res) => {
      const email = req.query.email;  
      const query = { email };
      const result = await orderCollection.find(query).toArray();
      res.send(result);
    });

    // Delete Order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const result = await orderCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Update Order Status
    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;

      const result = await orderCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );

      res.send(result);
    });

    console.log("Connected to MongoDB!");
  } finally {}
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Backend 10 server");
});

app.listen(port, () => {
  console.log(`Backend 10 server is running on port: ${port}`);
});
