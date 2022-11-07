const mysql = require('mysql2')


// database config
const dbConn_1 = mysql.createConnection({
    host: '127.0.0.1',
    port: '47335',
    user: 'mindsdb',
    password: '',
    database: ''
});

const dbConn_2 = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'admin',
    database: 'predicted_fats'
});

function add_predicted_data(fats, score, input) {
    dbConn_2.query(`INSERT INTO data_fats (fats, score, input, timer) VALUES (${fats}, ${score}, '${input}', CURRENT_TIMESTAMP);`, function (err, records) {
        if (err)
            console.log(err)
    })
}

function predict_fats(data_input, cb) {
    let str_data = ''
    if (data_input.length >= 8) {
        dbConn_1.query(`SELECT fats, fats_confidence FROM mindsdb.fats_traning_set WHERE w610 = ${data_input[0]} AND w680 = ${data_input[1]} AND w705 = ${data_input[2]} AND w730 = ${data_input[3]} AND w760 = ${data_input[4]} AND w810 = ${data_input[5]} AND w860 = ${data_input[6]} AND w900 = ${data_input[7]}`, function (err, records) {
            if (err)
                console.log(err);
            else {
                console.log('[*] [2] Query excute success')
                // add_predicted_data(records[0].fats, records[0].fats_confidence, data_input.join(' '));
                console.log('[*] [3] Add data fats to mysql')
                str_data = records[0].fats.toString() + ' ' + records[0].fats_confidence.toString()
                console.log(`[*] [4] data after query: ${str_data}`)
                cb(str_data)
            }
        })
    } else console.log('[*] [2] data input not found')
}

module.exports = { dbConn_1, dbConn_2, predict_fats, add_predicted_data }