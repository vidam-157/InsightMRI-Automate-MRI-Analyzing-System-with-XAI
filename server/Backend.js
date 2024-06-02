// const express = require('express');  //express middleware
// const app = express();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mysql = require("mysql");

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'workflow_data'
// });

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.urlencoded({extended:true}));

// //API for the form feilds
// app.get("/submission/:workflowId", (req, res) => {

//     const workflowID = req.params.workflowId;
//     const sqlSelect = `SELECT * FROM wf_form_data INNER JOIN request_types 
//     ON wf_form_data.WF_ID = request_types.WF_ID WHERE wf_form_data.WF_ID = ${workflowID}`;

//     db.query(sqlSelect, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// //API for styling
// app.get("/color/:workflowId", (req, res) => {

//     const workflowID = req.params.workflowId;
//     const sqlSelect = `SELECT CHARACTERISTIC_VALUE FROM wf_form_characteristic_data WHERE 
//     wf_form_characteristic_data.WORKFLOW_ID = ${workflowID}`;

//     db.query(sqlSelect, (err, result) => {
//         // if (err) throw err;
//         res.send(result);
//     });
// });

// //API for adding css to the form
// app.get("/color/:workflowId/:formType", (req, res) => {

//     const workflowID = req.params.workflowId;
//     const formTyp = req.params.formType;

//     const sqlSelect = `SELECT CHARACTERISTIC_VALUE, CHARACTERIST_NAME FROM wf_form_characteristic_data INNER JOIN 
//     wf_form_characteristic_master ON wf_form_characteristic_data.WORKFLOW_ID = ${workflowID} AND 
//     wf_form_characteristic_data.FORM_TYPE = ${formTyp} WHERE
//     wf_form_characteristic_master.CHARACTERISTIC_ID = wf_form_characteristic_data.CHARACTERISTIC_ID`;

//     db.query(sqlSelect, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// //API for inserting from inputs to database.
// app.post("/wf/instance", (req, res) => {

//     let data = {INSTANCE_ID: req.body.INSTANCE_ID, WF_ID: req.body.WF_ID, CREATED_USER: req.body.CREATED_USER, 
//                 STATUS: req.body.STATUS, ASSIGNED_USER: req.body.ASSIGNED_USER,
//                 REQUEST_PAYLOAD: req.body.REQUEST_PAYLOAD }
    
//     const sqlInsert = "INSERT INTO process_instance SET ?"
    
//     db.query(sqlInsert, data, (err, result) =>{
//         if (err) throw err;
//         res.send(result);
//     });
// });

// //API to display the inputed data
// app.get("/wf/details", (req, res) => {

//     // const workflowID = req.params.formType;
//     const sqlSelect = `SELECT REQUEST_PAYLOAD FROM process_instance`;

//     db.query(sqlSelect, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//         console.log("xoxoxoxox") //The API is calling twice
//     });      
// });

// app.get("/wf/leavedata" , (req, res) => {

//     // const workflowID = req.params.workflowId;
//     const sqlSelect = `SELECT ELIGIBLE_LEAVES, TAKEN_LEAVES, ELIGIBLE_LEAVES - TAKEN_LEAVES AS REMAINING_LEAVES, 
//     ELIGIBLE_CLAIMS, TAKEN_CLAIMS, ELIGIBLE_CLAIMS - TAKEN_CLAIMS AS REMAINING_CLAIMS FROM leave_details WHERE USER_ID = 1`;

//     db.query (sqlSelect, (err, result) => {
//         if (err) throw err; 
//         res.send(result);
//     })
// });

// // Starting the server
// app.listen(3002, () => {
//     console.log("running in port 3002");
// });