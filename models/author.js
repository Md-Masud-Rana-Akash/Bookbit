const mongoose = require('mongoose');
const {Book} = require('./book.js')

const authorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

authorSchema.pre('remove', function (next) {
    Book.find({ author: this.id} , (err, books) =>{
        if(err){
            next(err)
        }
        else if (books.length > 0){
            next(new Error('This author has book stilll'))
        }
        else {
            next()
        }
    
    })
})

const Author = mongoose.model('Author', authorSchema);

exports.Author = Author;