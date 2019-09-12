require('dotenv').config();
var csv = require('csv')
var Table = require('cli-table');
const keys = require('./keys.js')
const mysql = require('mysql');
const inquirer = require('inquirer');
const link = mysql.createConnection(keys.database_confi)



var Table = require('cli-table');
 





let viewAs = process.argv[2]
let productId = process.argv[3]
let fillQuantity = process.argv[4]

link.connect((err)=>{
    if(err) {
        console.error('error connecting: ' + err.stack);
    return;
    }
  
})
const showProducts = () =>{
   
   link.query('SELECT * FROM `products`',(err,res,fields)=>{
if(err){
    console.log(err)
}else{
    console.log("These are The Products We Have In Stock")
    for (var i = 0; i<res.length; i++){

        // instantiate
var table = new Table({
    head: ['id','Category', 'item','Price','In-stock']
  , colWidths: [10, 20, 20, 20,20]
});
 
// table is an Array, so you can `push`, `unshift`, `splice` and friends
table.push(
    [`${res[i].item_id}`, `${res[i].department_name}`,`${res[i].product_name}`,`$${res[i].price}`,`${res[i].stock_quantity}`]
  
);
 
console.log(table.toString());

      
  
    }
}


   })     
   


}

const initialScreen = ()=>{
    let count =0;
    setTimeout(()=>{
        inquirer.prompt([{
            type:'number',
            name: 'getId',
            message: 'To Buy Please Enter Product Id'
            
        }
        
    ]).then((answerId)=>{
        link.query('SELECT * FROM `products` WHERE `item_id` = ?',[answerId.getId],(err,res,fields)=>{
            if(err){
                console.log('Error')
            }else{
             for (var i = 0; i<res.length; i++){
                if(res[i].stock_quantity <= 2){
                    console.log("Hurry, Items Left "+res[i].stock_quantity)
                }
                        // instantiate
var tableGetProductId = new Table({
    head: ['id','Category', 'item','Price','In-stock']
  , colWidths: [10, 20, 20, 20,20]
});
 
// table is an Array, so you can `push`, `unshift`, `splice` and friends
tableGetProductId.push(
    [`${res[i].item_id}`, `${res[i].department_name}`,`${res[i].product_name}`,`$${res[i].price}`,`${res[i].stock_quantity}`]
  
);
 
console.log(tableGetProductId.toString());
             }
            
             setTimeout(()=>{
                inquirer.prompt([
                    {
                        type: 'number',
                        name: 'getQuantity',
                        message: 'How many are You buying today?'
                    }
                ]).then((answerQuantity)=>{
                    count = answerQuantity.getQuantity;
                    link.query('SELECT * FROM `products` WHERE `item_id` = ?',[answerId.getId],(err,res,fields)=>{
                        if(err){
                            console.log(err)
                        }else{

                            for (var i = 0; i<res.length; i++){
                                let sold = res[i].stock_quantity - count
                              if(sold < count){
                                  console.log(`We are sorry but we have ${res[i].stock_quantity} ${res[i].product_name} left`)
                              }else{
                                link.query("UPDATE `products` SET ? WHERE ?",
                                [{
                                    stock_quantity: sold

                                },
                            {
                                item_id: answerId.getId

                            }],(err,res,fields)=>{
                                console.log('Processing Please Wait...')
                                    setTimeout(()=>{
                                        
                                        if(err){
                                            console.log(err)
                                        }else{
                                            link.query('SELECT * FROM `products` WHERE `item_id` = ?',[answerId.getId],(err,res,fields)=>{
                                                for (var i = 0; i<res.length; i++){
                                                                           // instantiate
var tableReceipt = new Table({
    head: ['Quantity','Description', 'Unit Price','Amount']
  , colWidths: [10, 20, 20, 20]
});
 
// table is an Array, so you can `push`, `unshift`, `splice` and friends
tableReceipt.push(
    [`${count}`, `${res[i].product_name}`,`${res[i].price}`,`$${res[i].price*count}`]
  
);
console.log(
`
    Thank you.
          RECEIPT
          Bamazon
          2234 Sunset st
          Palo Alto, CA 94356
          United Estates
`
    );
console.log(tableReceipt.toString());
console.log(
    `
      Come back soon.
    `
        );
                                            
                                                }

                                            })
                                            
                                        }

                                    },3000)
                                })
                              }
                    
                            }
                        }
                    })
                   
                })
    
             },500)
            }
         });
       

    })
    },500)

}



let fillInventory = (fill,id)=>{
    link.query('UPDATE `products` SET ? WHERE ?',
    [{
        stock_quantity: fill

    },{
        item_id: id


    }],function(err,res){
        if (err) {
            console.log(err)
        }else{
            console.log('We insert'+ fill + ' new Items WHERE ID = '+ id)
        }
    }
    )
}


switch(viewAs){
    case 'buyer':
            initialScreen();
            showProducts();

        break;
    case 'fill':
        fillInventory(productId,fillQuantity);
        break;
        default:
            console.log(
                `Welcome to bamazon Please Chose one of this options: 
                If You are a buyer Please Insert
                node index.js buyer
                If You are a Manager Please Insert
                node index.js fill id 3
                `
                )

}