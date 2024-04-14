const Order = require('./models/Order');
const {validationResult} = require("express-validator");
const crudFunctions = require('./crud')
const timers = require("timers");

async function createOrder(req, res){
    try{
        const {name, phoneNumber, daterange, equipsID} = req.body;
        let totalPrice = 0;
        for(let i = 0; i < equipsID.length; i++){
            const equip = await crudFunctions.getEquip(equipsID[i]);
            if(equip.quantity < 1 ){
                res.status(400).json({message: 'Equip "' + equip.productName + '" not available now'})
                return;
            }
            console.log(equip.price)
            totalPrice += parseInt(equip.price);
        }
        console.log(totalPrice)
        const dates = daterange.split(' - ')
        dates[0][dates.length - 1] += 1;
        const order = new Order({name, phoneNumber, start: dates[0], end: dates[1], equips: equipsID, totalPrice});
        await order.save();
        res.json({message: "Order successfully created<br>We will contact you soon"});
    } catch (e){
        console.log(e)
        res.status(400).json({message: 'Order Error'})
    }
}


module.exports.createOrder = createOrder;