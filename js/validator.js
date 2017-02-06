// Validator functions for forms
function Validator(form, config){
  this._elForm = document.querySelector(form);

  // _els object contains all config and validation requirements for the input fields
  this._els = {
  };

  this.config = config || false;

  // creates a config from the attributes added to the inputs within the form.
  this.createFieldConfig = function(){
    // select all input elements within form
    var ells = this._elForm.querySelectorAll('input');

    // set this to _this for dependency injection
    var _this = this;
    ells.forEach(function(ell){
      // create empty fieldConfig to temporarily store field configuration
      var fieldConfig = {};
      var fieldConfigEmpty = true;
      // loop over all attributes of the element
      for (var i = 0; i < ell.attributes.length; i++) {
        // check if attribute name starts with val- denoting that it is part of the validation class
        if(ell.attributes[i].name.startsWith("val-")){
          // add attribute key value pair to fieldconfig
          fieldConfig[ell.attributes[i].name.substring(4, ell.attributes[i].name.length)] = ell.attributes[i].value;
          fieldConfigEmpty = false;
        }
      }
      // if field config is not empty add fieldconfig to this._els object
      if(!fieldConfigEmpty){
        this._els['#'+ell.id] = fieldConfig;
      }
    }, _this);
  }

  // add on submit listener
  this.addFormListener = function(){
    var elForm = this._elForm;
    var _this = this;
    elForm.addEventListener('submit', function(e){_this.validate(e)}, false);
  }

  // add on blur listener to individual fields
  this.addBlurListener = function(){
    for (var field in this._els) {
      var el = document.querySelector(field);
      var _this = this;
      el.addEventListener('blur', function(e){_this.validateField(e.srcElement)}, false);
    }
  }

  // Validate function starts validation process
  this.validate = function(e){
    var formValid = true;

    // loop over config fields
    for (var field in this._els) {
      // loop over validations for field
      for (var validation in this._els[field]) {
        // select dom element of config field;
        var el = document.querySelector(field);
        // check if validation rule is valid function;
        if(typeof this[validation] == 'function'){
          // call specific validation function
          var valid = this[validation](el, this._els[field][validation]);
          // add or remove invalid class based on value of valid;
          this.addClass(el, valid);

          this.addError(el, valid, validation);
          // if invalid break from loop, no more validations need to be done if it already failed one
          if(!valid){
            formValid = false;
            break;
          }
        }
      }
    }

    if(!formValid){
      e.preventDefault();
    }
  }

  // Validate individual field
  this.validateField = function(field){
    var rules = this._els['#'+field.id];
    for (var validation in rules) {
      if (typeof this[validation] == 'function') {
        var valid = this[validation](field, rules[validation]);
        this.addClass(field, valid);
        this.addError(field, valid, validation);

        if(!valid){
          break;
        }
      }
    }
  }

  // add or remove invalid class based on success parameter
  this.addClass = function(el, success){
    if(success){
      el.classList.remove('invalid');
    }else{
      el.classList.add('invalid');
    }
  }

  this.addError = function(el, success, validation){
    var errEl = this._elForm.querySelector('[val-error-for="'+el.id+'"]')
    if(errEl){
      if(success){
        errEl.innerHTML = "";
      }else{
        if(this.config && this.config.errors[validation]){
          errEl.innerHTML = this.getErrorMsg(el, validation);
        }else{
          errEl.innerHTML = "error";
        }
      }
    }
  }

  this.getErrorMsg = function(field, validation){
      var fieldAlias = field.getAttribute('val-alias');
      if(!fieldAlias){
        fieldAlias = field.id;
      }

      console.log(validation, field.getAttribute('val-'+validation));

      if(typeof this.config.errors[validation] == 'object'){
        var msg = this.config.errors[validation][field.getAttribute('val-'+validation)].replace('{field}', fieldAlias);
      }else{
        var msg = this.config.errors[validation].replace('{field}', fieldAlias);
      }

      console.log(validation);

      if(validation == 'compare'){
        var otherField = this._elForm.querySelector('#'+field.getAttribute('val-compare'));
        msg = msg.replace('{otherField}', otherField.getAttribute('val-alias'));
      }

      return msg;
  }

  // checks if the field is required and if it is checks if it is filled
  this.required = function(field, value){
    return !(value === "true" && field.value == '');
  }

  // checks if field value is longer or equal to min length
  this.minLength = function(field, value){
    return field.value.length >= value;
  }

  // checks if field value is shorter or equal to max length
  this.maxLength = function(field, value){
    return field.value.length <= value;
  }

  // check preconfigured input types;
  this.type = function(field, value){
    if(field.value == ''){
      return true
    }
    switch (value) {
      case 'email':
        return field.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        break;
      case 'numeric':
        return !isNaN(field.value);
        break;
      case 'zipcode':
        return field.value.match(/^[0-9]{4} *[a-zA-Z]{2}$/);
        break;
      default:
        return true;
        break;
    }
  }

  // check if value matches regex pattern
  this.pattern = function(field, value){
    if(field.value == ''){
      return true;
    }
    return field.value.match(value);
  }

  this.greater = function(field, value){
    return parseFloat(field.value) > parseFloat(value);
  }

  this.less = function(field, value){
    return parseFloat(field.value) < parseFloat(value);
  }

  this.compare = function(field, value){
    var otherEl = document.querySelector('#'+value);
    return field.value == otherEl.value
  }

  this.comparegreater = function(field, value){
    var otherEl = document.querySelector('#'+value);
    return parseFloat(field.value) > parseFloat(otherEl.value);
  }

  this.compareless = function(field, value){
    var otherEl = document.querySelector('#'+value);
    return parseFloat(field.value) < parseFloat(otherEl.value);
  }

  this.createFieldConfig();

  this.addBlurListener();
  this.addFormListener();
}
