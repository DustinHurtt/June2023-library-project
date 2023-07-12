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

router.get('/create', (req, res, next) => {
    res.render('books/book-create.hbs')
})

router.post('/create', (req, res, next) => {

    console.log(req.body);

    const { title, author, description, rating } = req.body

    Book.create(
        { 
        title, 
        author, 
        description,
        rating 
        }
    )
    .then((newBook) => {
        console.log(`New book created: ${newBook.title}.`, newBook)
        res.redirect('/books')
    })
    .catch((error) => {
        console.log(err)
        next(error)
    });

});

router.get('/edit/:bookId', (req, res, next) => {
    const { bookId } = req.params;
   
    Book.findById(bookId)
      .then(bookToEdit => {
        console.log(bookToEdit);
        res.render('books/book-edit.hbs', bookToEdit)
      })
      .catch(error => {
        console.log(err)
        next(error)});
  });

router.post('/edit/:bookId', (req, res, next) => {

    const { bookId } = req.params;
    const { title, description, author, rating } = req.body;

    Book.findByIdAndUpdate(
        bookId, 
        { 
            title, 
            description, 
            author, 
            rating 
        }, 
        { new: true }
        )
        .then((updatedBook) => {
            console.log("Updated Book:", updatedBook)
            res.redirect(`/books/details/${updatedBook._id}`)
        }) // go to the details page to see the updates
        .catch((err) => {
            console.log(err)
            next(err)});
});

router.get("/delete/:bookId", (req, res, next) => {

    Book.findByIdAndDelete(req.params.bookId)
        .then((result) => {
            console.log("Deleted:", result)
            res.redirect('/books')
        })
        .catch((err) => {
            console.log(err)
        })

})



module.exports = router;