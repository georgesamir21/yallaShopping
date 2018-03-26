var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
// var ProductsModel = mongoose.model("products");
var bodyParser = require("body-parser");
var urlEncodedMid = bodyParser.urlencoded({extended:true});
var JSONParsermid = bodyParser.json();
var multer = require("multer");
var fileUploadMid = multer({dest:"./static/users"});
//adding the new exported ProductsModel....
var ProductsModel = require("../models/products");


//seraching the products...
//get request http://localhost:9090/products/search?q=whatever
// need to find any product having the word in the ""{q}""
router.get("/search", function(request, response){
  console.log("finding search Product with q "+request.query.q);
    ProductsModel.searchProducts(request.query.q, function(err, result){
      if(!err&&result.length>0){
        console.log("finding search Product with q "+request.query.q);
        response.json(result);
      }
      else{
        response.json(err);
      }
    });
});

router.delete("/:id",function (req, resp) {
  ProductsModel.deleteProduct(req.params.id, (err, result) => {
    if(!err) {
      resp.json({status:"Product Deleted"});
    } else {
      resp.json(err);
    }
  })
})

//my new code

router.get("/",function(req,response){
    // var name ="samsung";
    //   var seller_id =1;
    //   var category="test";
    //     var subcategory ="test";
  ProductsModel.getAllProducts(function(err, result){
    if(!err&&result.length>0){
      console.log("finding All Products");
      response.json(result);
      // response.send("hii");
    }
    else{
      response.json(err);
    }
  });
})


router.post("/", JSONParsermid,function (req, resp) {
  // var name ="samsung";
	ProductsModel.addProduct(req.body, (err, result)=>{
		if(!err) {
			resp.json({status:"ok"})
		} else {
			resp.json(err);
		}
	})
  // console.log(req.body);
  // resp.send("ok");

})

router.put("/:id", JSONParsermid,(req, resp)=>{
	ProductsModel.editProduct(req.params.id, req.body, (err, result)=>{
		if(!err) {
			resp.json({status:"ok"})
		} else {
			resp.json(err);
		}
	})

})

router.get("/:id/rate", function(request, response){

    if(request.params.id){
      ProductsModel.getProductById(request.params.id, function(err, result){
        if(!err&&result.length>0){
          console.log("finding Product with id ="+request.params.id);
          response.json(result);
        }
        else{
          response.json(err);
        }
      });
    }
    else{
      ProductsModel.getAllProducts(function(err, result){
        if(!err&&result.length>0){
          console.log("finding All Products");
          response.json(result);
        }
        else{
          response.json(err);
        }
      });
    }
});

router.post("/:id/rate", JSONParsermid,function (req, resp) {
	ProductsModel.rateProduct(req.body, (err, result)=>{
		if(!err) {
			resp.json({status:"ok"})
		} else {
			resp.json(err);
		}
	})

})
//end of my new code

router.post("/filter", urlEncodedMid, function(request, response){
  // var subcatArr = Array();
  // subcatArr.push(request.body.subcat1);
  // subcatArr.push(request.body.subcat2);
  //subcatArr must be Array
  ProductsModel.filter(request.body.priceLow,
    request.body.priceHigh, request.body.subcatArr, function(err, result){
    if(!err&&result.length>0){
      console.log("filtering products");
      response.json(result);
    }
    else{
      response.json(err);
    }
  })
})
//get request http://localhost:9090/products
//need to find all the products
//get request http://localhost:9090/products/id
//need to find that specific product usind the id in the url...
router.get("/:id?", function(request, response){

    if(request.params.id){
      ProductsModel.getProductById(request.params.id, function(err, result){
        if(!err&&result.length>0){
          console.log("finding Product with id ="+request.params.id);
          response.json(result);
        }
        else{
          response.json(err);
        }
      });
    }
    else{
      ProductsModel.getAllProducts(function(err, result){
        if(!err&&result.length>0){
          console.log("finding All Products");
          response.json(result);
        }
        else{
          response.json(err);
        }
      });
    }
});



module.exports = router;
