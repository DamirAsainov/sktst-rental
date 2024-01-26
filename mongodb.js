const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'myProject';
  

const getAllcategories = async () => {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('categories');
    const documents = await collection.find({}).toArray();
    const titlesArray = documents.map(document => document.title);
    console.log('All Categories', titlesArray);

    client.close;
}
const uploadImage = async(req) => {
    try {
        await client.connect();

        const database = client.db(dbName);
        let collection = database.collection('images');

        const result = await collection.insertOne({
            filename: req.file.filename,
            path: req.file.path
        });
        console.log(`File uploaded with ID: ${result.insertedId}`);
        console.log(req.body.productName);
        
        collection = database.collection('equipments');
        await collection.insertOne({
            productName: req.body.productName,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category,
            imageID: result.insertedId
        })
    } catch (error) {
        console.error('Error uploading file:', error);
    } finally {
        await client.close();
    }
}
getAllcategories()