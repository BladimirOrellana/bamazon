const mysql = require('mysql');

const link = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bladi1010',
    database: 'bamazon'
})

if(link.connect()){
    console.log('CONNECTED')
}else{
    console.log('Fail') 
}
