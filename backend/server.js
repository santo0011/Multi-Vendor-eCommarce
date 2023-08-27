require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./utiles/db')

const socket = require("socket.io");

const server = http.createServer(app);

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));


const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true
    }
});

var allCustomer = [];
var allSeller = [];


const addCustomer = (customerId, socketId, userInfo) => {

    const checkUser = allCustomer.some(u => u.customerId === customerId)
    if (!checkUser) {
        allCustomer.push({
            customerId,
            socketId,
            userInfo
        })
    }

}


const addSeller = (sellerId, socketId, userInfo) => {
    const checkSeller = allSeller.some(u => u.sellerId === sellerId)
    if (!checkSeller) {
        allSeller.push({
            sellerId,
            socketId,
            userInfo
        })
    }
}


// findCustomer
const findCustomer = (customerId) => {
    return allCustomer.find(c => c.customerId === customerId)
}

// findSeller
const findSeller = (sellerId) => {
    return allSeller.find(c => c.sellerId === sellerId)
}


// remove
const remove = (socketId) => {
    allCustomer = allCustomer.filter(s => s.socketId !== socketId)
    allSeller = allSeller.filter(s => s.socketId !== socketId)
}


io.on('connection', (soc) => {
    console.log("Socket is connected")

    soc.on('add_user', (customerId, userInfo) => {
        addCustomer(customerId, soc.id, userInfo)
        // console.log("allCustomer", allCustomer)
    })

    soc.on('add_seller', (sellerId, userInfo) => {
        addSeller(sellerId, soc.id, userInfo)
        // console.log(sellerId, userInfo)
    })

    // send_seller_message
    soc.on('send_seller_message', (msg) => {
        const customer = findCustomer(msg.receverId)
        if (customer !== undefined) {
            soc.to(customer.socketId).emit('seller_message', msg)

        }
    })


    // send_customer_message
    soc.on('send_customer_message', (msg) => {
        const seller = findSeller(msg.receverId)
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('customer_message', msg)
        }
    })


    soc.on('disconnect', () => {
        console.log("user dsiconnect")
        remove(soc.id)
        io.emit('activeSeller', allSeller)
        io.emit('activeCustomer', allCustomer)
    })

})


app.use(bodyParser.json());
app.use(cookieParser());


// import router

app.use('/api', require('./routes/chatRoutes'));

app.use('/api/home', require('./routes/home/homeRoutes'));
app.use('/api/home', require('./routes/order/orderRoutes'));
app.use('/api', require('./routes/home/cardRoutes'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/home/customerAuthRoutes'));
app.use('/api', require('./routes/dashboard/categoryRoutes'));
app.use('/api', require('./routes/dashboard/productRoutes'));
app.use('/api', require('./routes/dashboard/sellerRoutes'));


const port = process.env.PORT;
dbConnect();
server.listen(port, () => console.log(`Server is running on port ${port}!`));