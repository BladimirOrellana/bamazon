require('dotenv').config();
const keys = require('./keys.js')
const mysql = require('mysql');
const inquirer = require('inquirer');
const link = mysql.createConnection(keys.database_confi)

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
        console.log
(
`
 Category: ${res[i].department_name}
 Product Name: ${res[i].product_name}
 Price: $${res[i].price}
 In-Stock: ${res[i].stock_quantity}
 Item Id: ${res[i].item_id}
 
`
)
    }
}


   })     
   


}

const prompt = ()=>{
    let count =0;
    setTimeout(()=>{
        inquirer.prompt([{
            type:'number',
            name: 'getId',
            message: 'To Buy Please Enter Product Id'
            
        }
        
    ]).then((answerId)=>{
        link.query('SELECT * FROM `products` WHERE `item_id` ='+answerId.getId,(err,res,fields)=>{
            if(err){
                console.log('Error')
            }else{
             for (var i = 0; i<res.length; i++){
                if(res[i].stock_quantity <= 2){
                    console.log("Hurry, Items Left "+res[i].stock_quantity)
                }
                 console.log
         (
         `
          Item Id: ${res[i].item_id}
          Category: ${res[i].department_name}
          Product Name: ${res[i].product_name}
          Price: $${res[i].price}
          In-Stock: ${res[i].stock_quantity}
         `
         )
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
                    link.query('SELECT `stock_quantity` FROM `products` WHERE `item_id` ='+answerId.getId,(err,res,fields)=>{
                        if(err){
                            console.log(err)
                        }else{

                            for (var i = 0; i<res.length; i++){
                                let sold = res[i].stock_quantity - count
                                //    console.log('In Stock: '+res[i].stock_quantity)
                                //    console.log('Costumer is Buying: '+count)
                                //    console.log('Updated: '+sold)
                                link.query("UPDATE `products` SET `stock_quantity` = "+sold+" WHERE `item_id` = "+answerId.getId,(err,res,fields)=>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                        console.log('Inserted')
                                    }
                                })
                    
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
// showProducts()
// prompt()


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
        showProducts();
        prompt();
        break;
    case 'fill':
        fillInventory(productId,fillQuantity);
        break;
        default:
            console.log("Welcome to bamazon")

}