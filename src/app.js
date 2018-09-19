import LazyLoad from 'vanilla-lazyload';
import Background from './js/bgMaster.js';


let notWebGL = function () {
  // webGL非対応時の記述
  console.log('this browser does not support webGL')
};

if (document.getElementsByTagName('html')[0].classList.contains('no-webgl')) {
  notWebGL();
}

// three.jsのとき
try {

} catch (e) {
  notWebGL();
}


// window.onload = function () {
$(function () {
  //背景画像を表示
  new Background();

});