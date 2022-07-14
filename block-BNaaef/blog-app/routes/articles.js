let express = require('express');
let router = express.Router();
let Article = require('../models/Article');
let Comment = require('../models/Comments');
let auth=require("../middleware/auth")


router.use(auth.userInfo)
// router.use(auth.loggedInUser)
router.get('/', (req, res, next) => {

  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render('list', { articles });
  });
});
router.get('/new', (req, res, next) => {
  res.render('articleForm');
});



router.post('/new', (req, res, next) => {
  req.body.userId=req.user.id;
  req.body.tags=req.body.tags.split(",")
  Article.create(req.body, (err, articles) => {
    console.log(articles)
    if (err) return next(err);
    res.redirect('/articles');
  });
});

// details
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id)
    .populate('comments')
    .exec((err, article) => {
      if (err) return next(err);
      res.render('details', { article });
    });
});

// creat comment

router.post('/:id/comment', (req, res, next) => {
  let id = req.params.id;
  
req.body.articleId=id;
  Comment.create(req.body, (err, comment) => {   
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect('/articles/' + id);
      }
    );
  });
});

// edit articles

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render('update-article', { article });
  });
});

// capture data from update form

router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});

// delete articles
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles/');
  });
});

// likes 

router.get("/:id/likes",(req,res,next)=>{
    let id=req.params.id;
    Article.findByIdAndUpdate(id,{$inc:{likes:1}},(err,article)=>{
        if(err) return next(err);
        res.redirect("/articles/"+id)
    })
})

// dislikes 

router.get("/:id/dislikes" , (req,res,next)=>{
    let id=req.params.id;
    Article.findById(id,(err,article)=>{
        if(article.likes>1){
            Article.findOneAndUpdate(id  ,  {$inc : {likes : -1}},(err,article)=>{
                if(err) return next(err);
                res.redirect("/articles/"+id)  
            })
        }
    })
})

// update comments 

router.get("/:id/comment/edit",(req,res,next)=>{
    let id=req.params.id;
    Comment.findById(id,(err,comment)=>{
      console.log(comment)
        if(err) return next(err);
        res.render("update-comment", {comment})
    })
})

// capture data

router.post("/:id/comment/edit",(req,res,next)=>{
   let id=req.params.id;
   Comment.findByIdAndUpdate(id,req.body,(err,comment)=>{
    if(err) return next(err);
    res.redirect("/articles/"+comment.articleId)
   })
})

// delete comment 

router.get("/:id/comment/delete",(req,res,next)=>{
  let id=req.params.id;
  Comment.findByIdAndDelete(id,(err,comment)=>{
    if(err) return next(err);
    res.redirect("/articles/"+ comment.articleId)
  })
})

// likes comments

router.get("/:id/comment/likes",(req,res,next)=>{
  let id=req.params.id;
  Comment.findByIdAndUpdate(id,{$inc : {likes:1}},(err,comment)=>{
    if(err) return next(err);
    res.redirect("/articles/"+ comment.articleId)
  })
})

// dislikes comments
router.get("/:id/comment/dislikes",(req,res,next)=>{
  let id=req.params.id;
  Comment.findById(id,(err,comment)=>{
    if(comment.likes>1){
      Comment.findByIdAndUpdate(id,{$inc : {likes:-1}},(err,comment)=>{
        if(err) return next(err);
        res.redirect("/articles/"+ comment.articleId)
      })
    }
  })
})

module.exports = router;
