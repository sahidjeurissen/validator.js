function addEvent(to, type, fn){
    if(document.addEventListener){
        to.addEventListener(type, fn, false);
    } else if(document.attachEvent){
        to.attachEvent('on'+type, fn);
    } else {
        to['on'+type] = fn;
    }
};

var form;

addEvent(window, 'load', function(){

  var config = {
    errors: {
      required: '{field} is verplicht',
      type: {
        email: 'Vul een correct e-mailadres in',
        zipcode: 'Dit is geen geldige postcode',
        numeric: 'Dit veld moet numeriek zijn'
      },
      compare: '{field} moet gelijk zijn aan {otherField}'
    }
  };

  form = new Validator('#form', config);

  // add custom validation.
  // parameter field : field element, fieldValue is accessible through field.value
  // parameter value : html attribute value, value of val-custom
  // return bool : true on validation success, false on validation failure
  form.custom = function(field, value){
    var fieldValue = field.value;
    return false;
  }
});
