var express = require('express')
var mysql = require('mysql2')
var app = express()
app.use(express.json())

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

function startApp() {
    sleep(10000).then(() => {
        connection = mysql.createConnection({
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE
        })
        connection.connect(function(err) {
          if (err) {
            console.log("SeekAPeek API: Error connecting to database. Trying again in 10 seconds...")
            startApp()
          }
          else {
            connection.query("CREATE TABLE if not exists users (email VARCHAR(255), username VARCHAR(255), password VARCHAR(255))", function(err, result) {
              if (err) {
                console.log(err)
                console.log("SeekAPeek API: Error creating database table. Trying again in 10 seconds...")
                startApp()
              }
              else {
                console.log("SeekAPeek API: Connected to Database! You can now start using the API")
                app.listen(80)
              }
            })
          }
        }) 
    })
}

app.post('/user/login', (req, res) => {
    try {
      const { username, password } = req.body
      if (!(username && password)) 
        res.status(406).send()
      else {
        connection.connect(function(err) {
          if (err){
            console.log("SeekAPeek API: Request Failed - Error connecting to database")
            res.status(500).send()
            throw err
          }
        })
        connection.query("SELECT username, password FROM users", function(err, result) {
          if (err) {
            console.log("SeekAPeek API: Request Failed - Error searching database")
            res.status(500).send()
            throw err
          }
          var found = false
          result.forEach(json => {
            if (json.username == username && json.password == password) {
                found = true
                res.status(200).send()
            }
          })
          if(!found) res.status(401).send()
        })
      }
    } catch(err) {}
  })
  
  app.post('/user/register', (req, res) => {
      const { email, username, password } = req.body
      if (!(email, username && password))
        res.status(406).send()
      else {
          try {
              connection.connect(function(err) {
                  if (err){
                      console.log("SeekAPeek API: Request Failed - Error connecting to database")
                      res.status(500).send()
                      throw err
                  }
                  connection.query("SELECT username FROM users", function(err, result) {
                      if (err) {
                        console.log()
                          console.log("SeekAPeek API: Request Failed - Error searching database")
                          res.status(500).send()
                          throw err
                      }
                      var found = false
                      result.forEach(json => {
                          if (json.username == username) {
                              found = true
                              console.log("SeekAPeek API: Request Failed - User tried to create account with username already in use (" + username + ")")
                              res.status(409).send()
                          }
                      })
                      if(!found) {
                          connection.query("INSERT INTO users (email, username, password) VALUES ('" + email + "','" + username + "','" + password + "')", function(err, result) {
                            if (err) {
                                console.log("SeekAPeek API: Request Failed - Error creating user")
                                res.status(500).send()
                                throw err
                            } else res.status(200).send()
                        })
                      }
                  })
              })
          }
          catch (error) { throw error }
      }
  })

console.log("SeekAPeek API: Starting...")
startApp()