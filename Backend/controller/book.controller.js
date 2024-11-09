import Book from '../book.model.js';

export const getBook = async(req,res) => {
    try{
        const book = await Book.find()
        res.status(200).json(book);
    }catch(e){
       console.log("Error",error)
       res.status(500).json(error);

    }

}