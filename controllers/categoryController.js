const { errorHandler } = require("../helpers/dbErrorHandler")
const Category = require("../models/categoryModel")
exports.getCategoryById = (req,res,next, id) => {
    Category.findById(id, (err, category) => {
        if (err || !category){
            return res.status(400).json({error: errorHandler(err)})
        }
        req.category = category;
        next();
    }) 
}
exports.createCategory = (req,res) => {
    const category = new Category(req.body)
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({err: errorHandler(err)})
        }
        res.json({data})
    })
}
exports.readCategory = (req, res) => {
    return res.json(req.category);
}
exports.updateCategory = (req, res) => {
    const category = req.category;
    console.log(req.category)
    console.log(req.body.name)
    category.name = req.body.name;
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({error: errorHandler(err)})
        }
        res.json(data);
    })
}
exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err,data)=>{
        if(err){
            return res.status(400).json({error: errorHandler(err)})
        }
        res.json({message: "category deleted successfully"});
    })
}
exports.listCategory = (req, res) => {
    Category.find((err,data)=>{
        if(err){
            return res.status(400).json({error: errorHandler(err)})
        }
        res.json(data);
    })
}




