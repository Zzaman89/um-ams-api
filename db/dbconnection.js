var mongodb = require('mongodb');
var jwt = require('jsonwebtoken');
var utilityService = require("../utility/utility.service");

var MongoClient = mongodb.MongoClient;
var url = (utilityService.getDbConfig()).url;
var database = (utilityService.getDbConfig()).database;

var dbconnection = {
  getAnonymousToken: function () {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').findOne({ _id: "6f5bbf96-7bae-4091-9814-92a5673db755" }).then(function (result) {
        var userInfo = {
          "id": result._id,
          "UserName": result.UserName,
          "Email": result.Email,
          "Name": result.Name
        };
        var token = jwt.sign(userInfo, utilityService.getAnonPrivateKey());
        client.close();
        return token;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  saveAnonymousToken: function (token) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      var data = {
        _id: utilityService.guIdGenarator(),
        Token: token
      };
      return db.collection('AnonymousTokens').insertOne(data).then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    })
  },
  getPopluarProducts: function () {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('PopularProducts').find({}).sort({ AddedDate: -1 }).limit(8).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getProductById: function (itemId) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Products').find({ _id: itemId }).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getProductCategory: function () {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('ProductCategory').find({}).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getProducts: function (limit, skip) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Products').find({}).limit(limit).skip(skip).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getProductbyCategoryId: function (limit, skip, categoryId) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Products').find({ CategoryId: categoryId }).limit(limit).skip(skip).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getProductbyIdSubId: function (limit, skip, categoryId, subCategoryId) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Products').find({ CategoryId: categoryId, SubCategoryId: subCategoryId }).limit(limit).skip(skip).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getTotalProductCount: function (category, subCategoryId, vendorId) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      if (vendorId) {
        return db.collection('Products').count({ Vendor: vendorId }).then(function (result) {
          client.close();
          return result;
        }).catch(function (error) {
          return false;
        })
      }
      else if (!category) {
        return db.collection('Products').count({}).then(function (result) {
          client.close();
          return result;
        }).catch(function (error) {
          return false;
        })
      } else if (subCategoryId) {
        return db.collection('Products').count({ CategoryId: category, SubCategoryId: subCategoryId }).then(function (result) {
          client.close();
          return result;
        }).catch(function (error) {
          return false;
        })
      } else {
        return db.collection('Products').count({ CategoryId: category }).then(function (result) {
          client.close();
          return result;
        }).catch(function (error) {
          return false;
        })
      }
    }).catch(function (error) {
      return false;
    });
  },
  getProductPrice: function (ids) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Products').find({ "_id": { "$in": ids } }).project({ _id: 1, Name: 1, Price: 1, DiscountPrice: 1, ProductLanguageKey: 1, Vat: 1, Metric: 1 }).toArray().then(function (result) {
        var productPrice = result;
        client.close();
        return productPrice;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    })
  },
  createInvoice: function (data) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Invoices').insertOne(data).then(function (result) {
        var productPrice = result;
        client.close();
        return productPrice;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    })
  },
  createOrder: function (data) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Orders').insertOne(data).then(function (result) {
        var productPrice = result;
        client.close();
        return productPrice;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    })
  },
  submitInquiry: function (data) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Inquirys').insertOne(data).then(function (result) {
        var productPrice = result;
        client.close();
        return productPrice;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    })
  },
  getOffers: function (limit, skip) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Offers').find({}).limit(limit).skip(skip).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getOffersCount: function () {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Offers').count({}).then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getOfferDetails: function (itemId) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Offers').find({ _id: itemId }).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  subscribeToNew: function (email) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('NewsLettterEmails').insertOne({
        _id: utilityService.guIdGenarator(),
        Email: email
      }).then(function (result) {
        var productPrice = result;
        client.close();
        return productPrice;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    })
  },
  registerUser: function (data) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').insertOne(data).then(function (result) {
        var productPrice = result;
        client.close();
        return productPrice;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    })
  },
  checkEmail: function (email) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').find({ Email: email }).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getToken: function (email) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').findOne({ "Email": email }).then(function (result) {
        var userInfo = {
          "id": result._id,
          "Name": result.Name,
          "Email": result.Email,
          "Role": result.Role
        };
        var token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60),
          data: userInfo
        }, utilityService.getPrivateKey());
        client.close();

        if (result.IsSystemBlocked) {
          return false;
        }
        return token;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  checkPassword: function (email) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').find({ Email: email }).project({ Password: 1, IsSystemBlocked: 1 }).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getLoggedInUserInfo: function (email) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').find({ Email: email }).project({
        FirstName: 1,
        LastName: 1,
        Email: 1,
        Mobile: 1,
        HousePlot: 1,
        StreetRoad: 1,
        Area: 1,
        BlockSection: 1,
        FloorApartment: 1
      }).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  updateUserInfo: function (email, data) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').updateOne(
        { Email: email },
        {
          $set:
          {
            FirstName: data.FirstName,
            LastName: data.LastName,
            Mobile: data.Mobile,
            HousePlot: data.HousePlot,
            StreetRoad: data.StreetRoad,
            Area: data.Area,
            BlockSection: data.BlockSection,
            FloorApartment: data.FloorApartment
          }
        }
      ).then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  updatePassword: function (email, newPassword) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').updateOne(
        { Email: email },
        {
          $set:
          {
            Password: newPassword
          }
        }
      ).then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getUserOrders: function (userId) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Invoices').find({ UserId: userId }).sort({ OrderDate: -1 }).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getVendors: function () {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Vendors').find({}).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getProductsByVendorId: function (limit, skip, vendorId) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Products').find({ Vendor: vendorId }).limit(limit).skip(skip).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  geAllProductInfos: function (searchString) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Products').find({ Name: { $regex: searchString, $options: '$i' } }).project({ _id: 1, Name: 1 }).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getLanguage: function (langKey) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Localizations').find({ Language: langKey }).project({ LanguageObject: 1 }).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getCarousel: function () {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Carousel').find({}).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getProductDeliveryConfiguration: function () {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('ProductDeliveryConfiguration').find({}).toArray().then(function (result) {
        var config = result;
        client.close();
        return config;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    })
  }
}

module.exports = dbconnection;