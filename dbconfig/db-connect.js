let MongoClient=require('mongodb').MongoClient;

let state={
    db:null,
};

module.exports.connect=function (done) {
    if(state.db)return done();
// conection url
    const url='mongodb+srv://optimist:optimist@rin123-vtkzy.mongodb.net/test?retryWrites=true&w=majority'||'mongodb://localhost:27017';

    //database name

    const dbName='complaintRoad';

    //create new mongo client

    const client=new MongoClient(url,{useNewUrlParser:true});
    
//using connect method to connect to server
    client.connect(function (err) {
        if(err) return done(err)
//connection succesfully
        console.log("Connected successfully to Database");

        const dbs=client.db(dbName);

        state.db=dbs;
        done();
    })

};


module.exports.get=function () {
    return state.db;

};