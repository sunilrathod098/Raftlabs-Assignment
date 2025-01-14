
function claimbStairs(n) {
    if (n <= 1){
        return 1;
    }
    let a = 1, b= 2;

    for (let i = 2; i <= n; i++){
        let c = a+b;
        a =b;
        b=c;
    }
    return b;
}

// console.log(claimbStairs(2));
// console.log(claimbStairs(3));
// console.log(claimbStairs(4))



//fitlter even number
function evenNum(num) {
    return num % 2 === 0;
}
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenArr = arr.filter(evenNum);
// console.log(evenArr);

//swap two number
function swapTwo(n1, n2) {
    let temp = n1;
    n1 = n2;
    n2 = temp;
    return [n1, n2];
}
// console.log(swapTwo(2, 3));


function evenOrOdd(num){
    return num % 2 ===0 ? 'even': 'odd';
}
// console.log(evenOrOdd(5));
// console.log(evenOrOdd(10));


function sumOgArr(arr) {
    return arr.reduce((sum, num) => sum + num, 0)
}
// console.log(sumOgArr([1, 2, 3, 4, 5]));

function largestArr(arr){
    return Math.max(...arr)
}
// console.log(largestArr([1, 5 ,10, 20, 50, 10]));


function smallestArr(arr){
    return Math.min(...arr)
}
// console.log(smallestArr([1, 5 ,10, 20, 50, 10]));


function fibonacciSeries(n) {
    let series = [0, 1];
    for( let i = 2; i < n; i++){
        series.push(series[i-1] + series[i-2])
    }
    return series;
}
console.log(fibonacciSeries(10));




//user register route and controller
import express from "express";
import bcrypt from "bcrypt";
import { User } from "./src/model/user.model.js";


const router = express.Router();

router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "all fields are required"
        });
        try {
            const userExist = await User.findOne({ $or: [{email}, {name}]})
            if (userExist) {
                return res.status(401).json({
                    message: "user already exist"
                })
                const hashedPassword = await bcrypt.hash(password, 10)
                const user  = new User({
                    name,
                    email,
                    password: hashedPassword
                })
                await user.save()

                return res.status(201).json({
                    message: "User registered successfully"
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "Server error"
            })
        }
    }
})

//user login route and controller
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "all fields are required"
        })
    }
        try {
            const user = await User.findOne({email});
            if (!user) {
                return res.status(401).json({
                    message: "Invalid credentials"
                })
            }
            const Match = await bcrypt.compare(password, user.password)
            if (!Match) {
                return res.status(401).json({
                    message: "Invalid credentials"
                })
            }

            return res.status(201).json({
                message: "User Logged in successfully"
            })
        } catch (error) {
            return res.status(500).json({
                message: "Server error"
            })
        }
})

export default router;


//database connection
import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/basicUser")
.then( () => {
    console.log("database connected successfully");
}). catch( (error) => {
    console.log("database connection failed", error);
})


//server connection with express
import cors from "cors";

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//detailed route
app.use("/api/user", router);



const port = 8080
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})



//basic server connection with http
import http from "http";
const server = http.createServer((req, res) => {
    res.statusCode = 200,
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World\n");
})
server.listen(3000, () => {
    console.log("server running on http://localhost3000/");
    
})


//server with express
import express from "express";
const app1 = express();
app1.use(express.json())
app1.post('/data', (req, res) => {
    console.log(req.body);
    res.send('Data received')
})
app1.get("/hello", (req, res) => {
    res.send('welcome to express basic connection')
})


//error handling
app1.use((req, res, err, next) => {
    console.error(err);
    res.status(500).send("error handling perfectly")
})


//using multer file upload
import multer from "multer";
const upload = multer({dist: 'uploads/'});
app1.use('/upload',upload.single('file'),(req, res) => {
    console.log('file uploaded: ', req.file);
    res.send('Files are uploaded successfully')
})



app.listen(3000, () => {
    console.log("server running on http://localhost3000/");
})


//database connect with  mongoDB
import mongoose from "mongoose";
mongoose.connect('mongodb_url').then(() => {
    console.log("connected to mongoDB");
}).catch((err) => {
    console.log("database connection failed",err);
})

//database connect with MySQL
import Sequelize from "sequelize";
const sequelize = new Sequelize('database_name', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});
sequelize.authenticate().then(() => {
    console.log("connected to mysql database");
}).catch((err) => {
    console.log("database connection failed: ", err);
})


//schema validation JOI
import Joi from 'joi';
const userSchema = Joi.Object({
    name: Joi.string().min(3).required(),
    age: Joi.number().min(0).integer()
});
const result = userSchema.validate({name: 'sunil', age: 23})
console.log(result.error ? result.error.details : 'validation passed');


//testing mocha and chai basic
import expect from "chai"
describe('Array', () => {
    if ('should return -1 when  value is not present', () => {
        expect([1, 2, 3].indexOf(4)).to.equal(-1);
    });
});


//security using helmet
import helmet from 'helmet';
app.use(helmet());


