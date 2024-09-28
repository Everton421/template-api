"use strict";
const bcrypt = require("bcrypt");
const storedHash = '$1$ZMYCG6DW$E9AJrSeeucei9mYuNtYsb1';
const passwordToCheck = '123';
bcrypt.compare(storedHash, passwordToCheck).then((result) => {
    console.log(result);
});
