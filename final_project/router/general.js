const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   author = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                author.push(books[key]);
            }
        }
    }
    res.send(author)
   
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  titles = []
  for (const [key,values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length; i++){
          if (book[i][0] == 'title' && book[i][1] == req.params.title){
              titles.push(books[key]);
          }
      }
  }
  res.send(titles)

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

function getBookList(){
    return new Promise((resolve,reject)=>{
      resolve(books);
    })
  }
  
  // Get the book list available in the shop
  public_users.get('/',function (req, res) {
    getBookList().then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send("denied")
    );  
  });

  function getBookIsbn(isbn){
    return new Promise((resolve,reject)=>{
        resolve(books[isbn]);
    });
  }
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getBookIsbn(isbn).then(
        (bk)=>res.send(JSON.stringify(bk, null, 4)),
        (error) => res.send("denied")
    );  
  });

  function getBookAuthor(author){
    let authors = []
    return new Promise((resolve,reject)=>{
          for (var isbn in books) {
            let book = books[isbn];
            if (book.author === author){
              authors.push(book);
            }
          }
          resolve(authors);  
        });
    } 

  public_users.get('/author/:author',function (req, res) {
    const authors = req.params.author;
    getBookAuthor(authors).then(
        (bk)=>res.send(JSON.stringify(bk, null, 4)),
        (error) => res.send("denied")
    );
  });

  function getBookTitle(title){
    let titles = []
    return new Promise((resolve,reject)=>{
          for (var isbn in books) {
            let book = books[isbn];
            if (book.title === title){
              tiltes.push(book);
            }
          }
          resolve(titles);  
        });
    }
    public_users.get('/title/:title',function (req, res) {
        const titles = req.params.title;
        getBookAuthor(titles).then(
            (bk)=>res.send(JSON.stringify(bk, null, 4)),
            (error) => res.send("denied")
        );
      });

module.exports.general = public_users;
