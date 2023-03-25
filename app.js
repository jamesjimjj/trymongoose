// import
require("dotenv").config();
const express = require("express");
const path = require("path");
const {check,validationResult} = require("express-validator");
const {Subscriber} = require("./models/subscribers");

// create express web app
const app = express();
const port = 4031;

// set up body parser
app.use(express.urlencoded({extended: false}));

// set up static content
app.use(express.static(path.join(__dirname, "public")));

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes
app.get("/",(req, res) =>{
    res.render("pages/signupform");
});

app.post("/", [
    check("name").not().isEmpty().withMessage("Please Enter Name"),
    check("email").isEmail().withMessage("Please Enter Email"),
],(req,res) => {
    let errors = validationResult(req);
    console.log(req.body);
    console.log(errors.array());
    if(!errors.isEmpty()){
        res.render("pages/signupform",{errors: errors.array()});
    }else {
        let name = req.body.name;
        let email = req.body.email;

        let newSubscriber = new Subscriber({
            name: name,
            email: email
        });

        newSubscriber.save().then(() => {console.log("Saved!")});

        res.render("pages/thankyou", {name: name, email: email});
    }
});

// run the app
app.listen(port, () => {
    console.log(`App http://localhost:${port}`);
});
