const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hashedPassword = await bcrypt.hash(password, 12)

        const userDetails = {
            name: name,
            email: email,
            password: hashedPassword
        }

        const result = await User.save(userDetails);

        res.status(201).json({ message: 'User Registered!'})

    } catch (err) {
        //What do do if there is an error
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }

};

exports.login = async (req, res, next) => { 
    const email = req.body.email;
    const password = req.body.password
  

    try {
        const user = await User.find(email)
        

        if (user[0].length !== 1) {
            const error = new Error('Could not find email');
            error.statusCode = 401;
            throw error;
            
        }

        const storedUser = user[0][0];

        const isEqual = await bcrypt.compare(password, storedUser.password);

        if (!isEqual) {
            const error = new Error('You have entered an incorrect password');
            error.statusCode = 401;
            throw error;

        }

        const token = jwt.sign(
            {
              email: storedUser.email,
              userId: storedUser.userId,
            },
            'secretfortoken',
            {expiresIn: '1h'}
        );

        res.status(200).json({token: token, user:storedUser.id})

    } catch (err) {
       
        //What do do if there is an error
        if (err.statusCode) {
            res.status(err.statusCode).json({ message: err.message});
            
        } else {
            err.statusCode = 500;
            next(err);
        }
    }

    
}