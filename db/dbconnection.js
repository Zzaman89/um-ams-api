var mongodb = require('mongodb');
var jwt = require('jsonwebtoken');
var utilityService = require("../utility/utility.service");

var MongoClient = mongodb.MongoClient;
var url = (utilityService.getDbConfig()).url;
var database = (utilityService.getDbConfig()).database;

var dbconnection = {
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
  updateUser: function (id, name, email, role) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').updateOne(
        { _id: id },
        {
          $set:
          {
            Name: name,
            Email: email,
            Role: role
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
  deleteUser: function (id) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').deleteOne({ _id: id },).then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  getUsers: function (limit, skip) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Users').find({}).limit(limit).skip(skip).toArray().then(function (result) {
        client.close();
        return result.map(x => {
          return {
            _id: x._id,
            Name: x.Name,
            Email: x.Email,
            Role: x.Role
          }
        });
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  createMeeting: function (data) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Meetings').insertOne(data).then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    })
  },
  getMeetings: function (start, end) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Meetings').find({ StartingDate: { "$gte": start }, EndingDate: { "$lte": end } }).toArray().then(function (result) {
        client.close();
        return result;
      }).catch(function (error) {
        return false;
      })
    }).catch(function (error) {
      return false;
    });
  },
  updateMeeting: function (id, data) {
    return MongoClient.connect(url, { useNewUrlParser: true }).then(function (client) {
      var db = client.db(database);
      return db.collection('Meetings').updateOne(
        { _id: id },
        {
          $set:
          {
            Description: data.Description,
            StartingDate: data.StartingDate,
            EndingDate: data.EndingDate,
            InvitedUsers: data.InvitedUsers,
            MeetingLink: data.MeetingLink
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
}

module.exports = dbconnection;