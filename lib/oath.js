
// Since objects only compare === to the same object (i.e. the same reference)
// we can do something like this instead of using integer enums because we can't
// ever accidentally compare these to other values and get a false-positive.
//
// For instance, `rejected === resolved` will be false, even though they are
// both {}.
var rejected = {}, resolved = {}, waiting = {};


// This is a promise. It's a value with an associated temporal
// status. The value might exist or might not, depending on
// the status.
var Promise = function (value, status) {
  this.value = value;
  this.status = status;
};

// The user-facing way to add functions that want
// access to the value in the promise when the promise
// is resolved.
Promise.prototype.then = function (success, _failure) {
  // var readyCheck;

  // var check = function(){
  //   if(this.status === true){
  //     clearInterval(readyCheck);
  //   }
  // }
  // var readyCheckWrapper = function() {
  //   readyCheck = setInterval(check.bind(this), 100);
  // };
  // readyCheckWrapper();

  //     return success(this.value);

  console.log("I am calling then()");



  var context = this;
  var result = new defer();
  result.value = null;

  var recurseTimeoutCallback = function() {
    if (context.status) {
      result.value = success(context.value);
    } else if (context.status === false){
      result.value = null;
    } else {
      recurseTimeout(recurseTimeoutCallback, 5);
    }
  }

  var recurseTimeout = function() {
    setTimeout(recurseTimeoutCallback, 5);
  };

  recurseTimeout();

  return result;


};


// The user-facing way to add functions that should fire on an error. This
// can be called at the end of a long chain of .then()s to catch all .reject()
// calls that happened at any time in the .then() chain. This makes chaining
// multiple failable computations together extremely easy.
Promise.prototype.catch = function (failure) {
 var context = this;
 var result;


  var recurseTimeoutCallback = function() {
    if (context.status === false){ // if the function rejected
      //return the result of calling the callback on the value
      result = failure(context.value);
    } else {
      recurseTimeout(recurseTimeoutCallback, 5);
    }
  }

  var recurseTimeout = function() {
    setTimeout(recurseTimeoutCallback, 5);
  };

  recurseTimeout();

  return result;
};



// This is the object returned by defer() that manages a promise.
// It provides an interface for resolving and rejecting promises
// and also provides a way to extract the promise it contains.
var Deferred = function (promise) {

  this.promise = new Promise(null, false);

};

// Resolve the contained promise with data.
//
// This will be called by the creator of the promise when the data
// associated with the promise is ready.
Deferred.prototype.resolve = function (data) {
  this.promise.value = data;
  this.promise.status = true;
};

// Reject the contained promise with an error.
//
// This will be called by the creator of the promise when there is
// an error in getting the data associated with the promise.
Deferred.prototype.reject = function (error) {
  this.promise.status = false;
  this.promise.value = error || this.promise.value;
};

// The external interface for creating promises
// and resolving them. This returns a Deferred
// object with an empty promise.
var defer = function () {
 return new Deferred();
};


module.exports.defer = defer;

