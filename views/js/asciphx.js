"use strict";

var obj = {};

var Service = function (v) {
  return function (target, key) {
    target[key] = new v();
    return target;
  };
};

(function () {
  console.log(this, 1);
}).bind(obj);