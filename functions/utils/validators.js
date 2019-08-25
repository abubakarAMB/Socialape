const isEmpty = (string) =>{
    if(string.trim() === ''){
       return true;
    }else{
        return false;
    }
};
const isEmail = (email) =>{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
          return true;
  }else{
         return false;   
  }
};

exports.validateSignupData = (data) =>{

    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'must not be empty '
    } else if (!isEmail(data.email)){
        errors.email = 'must not be a valid email '
    }
    
    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    if(data.password !== data.passwordConfirm) errors.passwordConfirm = 'Password must Match';
    if(isEmpty(data.handle)) errors.handle = 'Must not be empty';
    
    return {
        errors,
         valid: Object.keys(errors).length === 0 ? true : false
    };

};

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = 'must not be empty ';
    if(isEmpty(data.password)) errors.password = 'must not be empty ';
    return {
        errors,
         valid: Object.keys(errors).length === 0 ? true : false
    };
 
}

