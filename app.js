const express= require("express");
const mongoose=require("mongoose");
const app=express();
const bodyParser= require("body-parser");

mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

const articleSchema={
    title: String,
    content: String
}

const Article= mongoose.model("Article", articleSchema);


app.route("/articles")
.get(function(req,res){

    Article.find({}, function(err, foundList){

        if(!err)
        {
            if(foundList.length!=0)
            {
                console.log(foundList);
                res.render("home", {work: foundList});
            }

            else{
                 res.render("home", {work: foundList});
            }
        }
    });
})
.post(function(req,res){

    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle= new Article({
        title:req.body.title,
        content:req.body.content
    });

    newArticle.save();

})
.delete(function(req,res){

    Article.deleteMany(function(err){

        if(!err)
        {
            console.log("success");
            res.send("deleted all");
        }

        else{
            console.log("failure");
            res.send("failure");
        }

    })


});

app.route("/route/:heading")
.get(function(req,res){

const heading=req.params.heading;

Article.findOne({title: heading}, function(err, foundList){

    if(!err)
    {
        res.send(foundList);
    }

    else{
        res.send("not found");
    }
})


}).
put(function(req,res){

    Article.findOneAndUpdate(
        {title: req.params.heading},
       { $set:{title:req.body.title,content: req.body.content}},
       function(err){

        if(!err) {
            res.send("success");
        }
       }
    )
    

}).delete(function(req,res){

    Article.deleteOne({title: req.body.title}, function(err){
        if(!err){
            res.send("success");
        }
    });
});

// app.get("/articles", function(req,res){

//     Article.find({}, function(err, foundList){

//         if(!err)
//         {
//             if(foundList.length!=0)
//             {
//                 console.log(foundList);
//                 res.render("home", {work: foundList});
//             }

//             else{
//                  res.render("home", {work: foundList});
//             }
//         }
//     });
// });


// app.post("/articles", function(req,res){

//     // console.log(req.body.title);
//     // console.log(req.body.content);

//     const newArticle= new Article({
//         title:req.body.title,
//         content:req.body.content
//     });

//     newArticle.save();

// });

// app.delete("/articles",function(req,res){

//     Article.deleteMany(function(err){

//         if(!err)
//         {
//             console.log("success");
//             res.send("deleted all");
//         }

//         else{
//             console.log("failure");
//             res.send("failure");
//         }

//     })


// });


app.listen(3000, function(){

    console.log("http:/localhost:3000")
})