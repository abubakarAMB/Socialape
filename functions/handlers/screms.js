const {db} = require('../utils/admin');

exports.getAllScreams = (req, res)=>{
    db
   .collection('screams')
   .orderBy('createdAt','desc')
   .get()
   .then(
       data =>{
           let screams = [];
           data.forEach(doc =>{
               screams.push({
                   ...doc.data(),
                   screemId : doc.id
               });
           });
           return res.json(screams);
       })
       .catch((err)=>console.error(err));
};

exports.postOneScream = (req, res) =>{
    const newScream = {
        body:req.body.body,
        userHandle: req.user.handle,
     //    createdAt: admin.firestore.Timestamp.fromDate(new Date())
        createdAt : new Date().toISOString()
    };
    db
    .collection('screams')
    .add(newScream)
    .then(doc=>{
         res.json({message: `document${doc.id} creted successfully`})
     }).catch(err=>{
         res.status(500).json({error:'something went wrong'});
         console.error(err);
         
     });
 }; 