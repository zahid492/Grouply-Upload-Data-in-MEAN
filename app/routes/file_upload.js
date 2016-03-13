var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var Converter = require("csvtojson").Converter;



module.exports = function(router, app, io) {
  var model = require('../models/collectionModel');

  router.route('/file_upload/')
    .post(function(req, res) {


      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        var file = files.file;
        if (file.type==='text/csv') {

          var tempPath = file.path;
          var extension = path.extname(file.name);
          var targetPath = path.resolve('../csv-chunk-upload/files/' + file.name);  //file upload in directory
          fs.rename(tempPath, targetPath, function(err) {  //rename file
            if (err) {
              return res.json(err);
            } else {
              var user = new model.User();      //save user data
              user.name = fields.name;
              user.file_name = file.name;

              user.save(function(err, newUser) {
                if (err) {
                  return res.json(err);      //error
                } else {

                  var converter = new Converter({});        //JSON converter on
                  converter.on("end_parsed", function(jsonArray) {
                    var contactArray = [];
                    for (var i = 0; i < jsonArray.length; i++) {   //fol loop after convert CSV data to JSON
                      var contact = new model.ContactDetail({
                        msisdn: jsonArray[i].msisdn,
                        first_name: jsonArray[i].first_name,
                        last_name: jsonArray[i].last_name,
                        zip: jsonArray[i].zip,
                        city: jsonArray[i].city,
                        state: jsonArray[i].state,
                        email: jsonArray[i].email
                      });

                      contactArray.push(contact);    //create a array of object
                    }
                    ////////ARRAY FORMATTING                
                    var chunkarr = [],
                      ia = 0,
                      j = 0,
                    n = contactArray.length;
                    var length = parseInt(fields.split_at);

                    while (ia < n) {
                      var chunker = contactArray.slice(ia, ia += length);    //create chunk array by respective length(split_at)
                      save(chunker, j); //call save that chunk save in db
                      j++;
                    }

                    //save

                  function save(chunker, id) {
                      var group = new model.Group({
                        name: fields.groupName + ' ' + id,
                        contacts: chunker
                      });

                      user.groups.push(group);
                      model.User.update({
                          _id: newUser._id
                        }, {
                          $push: {
                            'groups': group
                          }
                        }, {
                          runValidators: true
                        },
                        function(err, user) {
                          if (err) {
                            return res.json(err);
                          }
                          console.log("Save chunk data");
                          var j = j + 1;

                        });

                    }
                    ////////////////END OF INSERT DATA IN DB/////////////
                  });
                  require("fs").createReadStream("../csv-chunk-upload/files/" + file.name).pipe(converter); //start JSON coverter stream

                }
                model.User.findById(newUser._id, function(err, user) {
                  if (err)
                    return res.json(err);

                  return res.json({user:user,message:'Succesfull add data into the db'});
                });
              });

            }


          });


        } else {
         
          return res.json({
            message: 'Please Choose a valid CSV file'
          });
        }


      });


    });



  router.route('/user/:userId')

  .get(function(req, res) {
    model.User.findById(req.params.userId, function(err, user) {
      if (err)
        return res.json(err);

      return res.json(user);
    });
  });




};