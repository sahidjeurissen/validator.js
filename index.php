<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>OOP</title>
    <script type="text/javascript" src="js/validator.js"></script>
    <script type="text/javascript" src="js/script.js"></script>
    <style media="screen">
      input{
        border: 1px solid grey;
      }
      input.invalid{
        background-color: pink;
      }
    </style>
  </head>
  <body>
    <form id="form" class="" action="#" method="post" novalidate>
      <p>
        <input val-required="true" val-alias="Voornaam" type="text" id="fname" name="fname" value="">
        <i val-error-for="fname"></i>
      </p>
      <p>
        <input val-compare="fname" val-alias="Achternaam" type="text" id="lname" name="lname" value="">
        <i val-error-for="lname"></i>
      </p>
      <p>
        <input val-required="true" val-type="email" type="email" id="email" name="email" value="">
        <i val-error-for="email"></i>
      </p>
      <p>
        <input type="phone" val-type="numeric" id="phone" name="phone" value="">
        <i val-error-for="phone"></i>
      </p>
      <p>
        <button type="submit" name="button">Submit</button>
      </p>
    </form>
  </body>
</html>
