const openai = require("openai");
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const port = 8080 || process.env.PORT;

//db////////////////////////////////////////////////////////////
const { MongoClient, cursor } = require("mongodb");
const Db = process.env.ATLAS_URI;
const PORT = process.env.PORT;

const uri = Db;
const client = new MongoClient(uri);
const database = client.db("medicalRecords");
////////////////////////////////////////////////////////////////

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//Configure OpenAI
const configuration = new openai.Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const openaiapi = new openai.OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/chat", async (req, res) => {
  let messages = req.body.messages;
  const model = req.body.model;
  const temp = req.body.temp;
  const patient = req.body.patient;
  let message1 = req.body.message1;
  //console.log("pacienti: " + patient);

  var collection = database.collection("patients");

  //   collection.insertOne(
  //     {
  //       patient: patient,
  //       condition: [
  //         ["condition1", "80"],
  //         ["condition2", "105mg/dl"],
  //         ["condition3", "120/80mmHg"],
  //         ["condition4", "Female"],
  //         ["condition5", "25"],
  //         ["condition6", "Diabetes"],
  //       ],
  //     },
  //     function (err, res) {}
  //   );

  let helperArr = [];
  let helperArr1 = [
    "heart beats per minute",
    "sugar levels",
    "bloop pressure",
    "gender",
    "age",
    "past seroius sicknesses",
  ];
  const cursor = await collection.find({ patient: patient });

  await cursor.forEach((element) => {
    for (let i = 0; i < 6; i++) {
      helperArr[i] = element.condition[i][1];
    }
    console.log(helperArr);
  });
  let report = "";

  for (i = 0; i < 6; i++) {
    report = report + ", " + helperArr1[i] + ": " + helperArr[i];
  }
  console.log(report);
  messages =
    "Based on the following report: " +
    report +
    " . If the following question asks for any specific data that is located within the report then take that data from the report and return it. If the following question asks about the condition of the patient than generate a summary based on the report i provided. If the question isnt related to the report than answer as you wish. The question is: " +
    message1;
  console.log(messages);

  //   const completion = await openaiapi.createChatCompletion({
  //     model: model,
  // messages: [{ role: "user", content: messages }],
  //     temperature: temp,
  //   });
  res.status(200).json({
    //result: completion.data.choices
  });
  helperArr.length = 0;
  res.end();
});

//////////////////
app.post("/getRecords", async (req, res) => {
  const user = req.body.user;
  var collection = database.collection("patients");
  const cursor = await collection.find({ user: user });

  await cursor.forEach((element) => {
    arr.push(element);
    arr2.push(element.value);
  });

  res.json({ data: arr2 });
  console.log(arr2);
  arr2.length = 0;
  res.end();
});
///////////////////

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
