const express = require('express');
const mqtt = require('./mqtt')
const mysql = require('mysql2')
const { dbConn_1, dbConn_2 } = require('./model')

// server config
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);

dbConn_1.connect(function (err) {
    if (err) {
        throw err.stack;
    }
    else
        console.log("[*] connect mindsdb success port 43375");
})

dbConn_2.connect(function (err) {
    if (err) {
        console.log("[mysql error] ", err);
    }
    else
        console.log("[*] connect mysql success port 3306");
})

app.get('/get_model_predictor', function (req, res) {
    dbConn_1.query('SELECT * FROM mindsdb.predictors;', function (err, records) {
        if (err)
            console.log(err)
        res.send(records);
    })
});


app.get('/predict_fats', function (req, res) {
    let data_input = mqtt.get_data_input()
    if (data_input.length >= 8) {
        dbConn_1.query(`SELECT fats, fats_confidence FROM mindsdb.fat_predictor_final WHERE w610 = ${data_input[0]} AND w680 = ${data_input[1]} AND w705 = ${data_input[2]} AND w730 = ${data_input[3]} AND w760 = ${data_input[4]} AND w810 = ${data_input[5]} AND w860 = ${data_input[6]} AND w900 = ${data_input[7]}`, function (err, records) {
            if (err)
                console.log(err);
            add_predicted_data(records[0].fats, records[0].fats_confidence, data_input.join(' '));
            res.send(records);
        })
    } else res.send('[*] data input not found')
})