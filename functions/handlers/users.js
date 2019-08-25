const { db } = require('../utils/admin');

const config = require('../utils/config'); 

const firebase = require('firebase');

firebase.initializeApp(config);

const { validateSignupData, validateLoginData } = require('../utils/validators');


exports.signUp = (req, res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        handle: req.body.handle
    };
    //validate the data
    const { valid, errors } = validateSignupData(newUser);

    if (!valid) return res.status(400).json(errors); 

    let token,userId;   

    db.doc(`users/${newUser.handle}`).get()
    .then(doc =>{
        if (doc.exists) {
            return res.status(400).json({handle:'this handle is already taken'});
        }else{
           return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken(); 
    })
    .then(idToken =>{
       //set token
       token = idToken;

       const userCredentials = {
            handle : newUser.handle,
            email : newUser.email,
            createdAt : new Date().toISOString(),
            userId 
       };

       return db.doc(`/users/${newUser.handle}`).set(userCredentials);

    }).then(() =>{
        return res.status(201).json({token})
    })
    .catch( err =>{
        console.error(err);
        if (err.code == "auth/email-already-in-use") {
           return res.status(400).json({email: "email already in use"})
        }else{
          return res.status(500).json({error: err.code});
           
        }
    });

};


exports.login = (req, res) => {
 
    const user = {
       email:req.body.email,
       password: req.body.password
   };
    //validate the data
    const { valid, errors } = validateLoginData(user);

    if (!valid) return res.status(400).json(errors);
  
   firebase.auth().signInWithEmailAndPassword(user.email,user.password)
   .then(data => {
       return data.user.getIdToken();
   })
   .then(token =>{
      return res.status(200).json({token});
   })
   .catch(err => {
       console.error(err);
       if (err.code === 'auth/wrong-password') {
           return res.status(403).json({general: 'Wrong credentials, please try again'});
           
       }else if(err.code == "auth/user-not-found"){

        return res.status(403).json({email: "User not found"})
             
      }else{
            return res.status(500).json({ error: err.code });

       }
       
   });
};