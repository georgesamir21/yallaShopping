var mongoose = require("mongoose");
require('mongoose-type-email');
var Schema = mongoose.Schema;
var product = require('./products.js')
var encryptPassword = require('../controllers/encryptPassword');
var ProductModel = require("./products");

// users schema
var cartItems = new Schema({
  prodId: {
    type: Number,
    ref: "products"
  },
  quantity: {
    type: Number
  }
});

var users = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: true,
    required: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    type: String,
    required: true
  },
  picture: String, //base64
  address: {
    type: String,
    required: true
  },
  cart: [cartItems],
  origin: {
    type: String,
    enum: ["FB", "G", "N"]
  }
});

users.plugin(autoIncrement.plugin, {
    model: 'users',
    startAt: 1,
});

cartItems.plugin(autoIncrement.plugin, {
    model: 'cartItems',
    startAt: 1,
});

// users plugins
users.plugin(autoIncrement.plugin, 'users');
// register login models
mongoose.model("users", users);

var UserModel = {};
UserModel.model = mongoose.model('users')
UserModel.getUsers = (callback) => {
  UserModel.model.find({}, { password: false }, (err, result) => {
    callback(err, result);
  });
}

UserModel.getUser = (Id, callback) =>{
    UserModel.model.findOne({_id:Id},{password: false}, (err, result) => {
      callback(err, result)
  })
}

UserModel.deleteUser = (Id, callback)=>{
  UserModel.model.remove({_id:Id}, (err, result)=>{
    callback(err, result)
  })
}

UserModel.deleteCart = (Id, callback)=>{
  UserModel.model.update({_id:Id},{
    $set:{
      cart: []
    }
  },(err, result)=>{
    callback(err, result)
  })
}

UserModel.addToCart = (Id, productToAdd, callback)=>{
    /* send data as
    {"prodId":1, "quantity":60}
   */
  ProductModel.model.findOne({_id:productToAdd.prodId},(e,r)=>{
    if (!e && r.stock) {
      UserModel.model.findOne({_id:Id},{_id: false, cart: true}, (err, result) => {
          var oldCart = result.cart
          var exist = false
          oldCart.map((p)=>{
            if (p.prodId == productToAdd.prodId && p.quantity+1<=r.stock) {
              p.quantity += 1
              exist = true
            }  
          })
          !exist && oldCart.push(productToAdd)
          console.log(result.cart === oldCart)
          UserModel.model.update({_id:Id},{cart:oldCart},(err, result)=>{
              callback(err, result)
          })
      })
    }
  })

}

UserModel.getCart = (Id, callback) =>{
    UserModel.model.findOne({_id:Id},{_id: false, cart: true}).populate('cart.prodId').exec((err, result)=>{
      callback(err,result)
    })
}
UserModel.editCart = (Id, cart, callback) =>{
    UserModel.getCart(Id, (err, r)=>{
      var updatedCart = r.cart

      cart.map((p)=>{
        if (p.prodId == updatedCart[cart.indexOf(p)].prodId._id && p.quantity>updatedCart[cart.indexOf(p)].prodId.stock) {
          p.quantity = updatedCart[cart.indexOf(p)].prodId.stock
        }  
      })
      UserModel.model.update({_id:Id},{cart:cart}, (err, result) => {
        // UserModel.model.findOne({_id:Id},{_id: false, cart: true}, (err, result) => {
        //   callback(err, result)
        // })
        UserModel.getCart(Id, callback)
      })
    })
}


UserModel.addUser = (data, callback)=>{

  encryptPassword.cryptPassword(data.password,(err, hashed)=>{
    data.password = hashed
    var user = new UserModel.model(data);
    var error = user.validateSync();
    user.save((err, doc)=>{
      callback(err, doc)
    });
  });
}

UserModel.editUser = (Id, data, callback)=>{
  if (data.password) {
    encryptPassword.cryptPassword(data.password,(err, hashed)=>{
      data.password = hashed
      UserModel.model.update({_id:Id}, data,(err, result)=>{
        callback(err, result)
      })
    })
  }else {
    UserModel.model.update({_id:Id}, data,(err, result)=>{
      callback(err, result)
    })
  }

}
module.exports = UserModel;
