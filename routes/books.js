var express = require('express');
var router = express.Router();

const Book = require('../models/Book')

/* GET home page. */
router.get('/', (req, res, next) => {
    Book.find()
    .then(allTheBooksFromDB => {
      // -> allTheBooksFromDB is a placeholder, it can be any word
      console.log('Retrieved books from DB:', allTheBooksFromDB);
 
      // we call the render method after we obtain the books data from the database -> allTheBooksFromDB
      res.render('books/books-list.hbs', { books: allTheBooksFromDB })
    })
    .catch(error => {
      console.log('Error while getting the books from the DB: ', error);
 
      // Call the error-middleware to display the error page to the user
      next(error);
    });
});

router.get('/details/:bookId', (req, res, next) => {

    Book.findById(req.params.bookId)
        .then((foundBook) => {
            console.log("Found book:", foundBook)
            res.render('books/book-details.hbs', foundBook)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})



module.exports = router;