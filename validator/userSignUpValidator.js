exports.userSignupValidator = (req,res,next) => {
    req.check("name", "Name is required").notEmpty();
    req.check("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+..+/)   // makes sure email is of format x@x
        .withMessage()
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'Password is required').notEmpty();
    req.check("password")
        .isLength({min:6})
        .withMessage("password must contain at least 6 characters and a number")
        .matches(/\d/)          // password has at least one digit
    const errors = req.validationErrors()       // collects all errors
    if(errors){
        const firstError = errors.map(error => error.msg)[0];   
        return res.status(400).json({err: firstError})    // remember that "error" being sent as response here will mean that 
                                                            // when signup is called on the frontend, and we're checking if there's error in the 
                                                            // .then (data => {...}), the error will be contained as data.error instead of data.err
    }
    next();
}