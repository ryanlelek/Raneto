/**
 * getSize tests
 * with QUnit
**/

/*jshint browser: true, devel: true, strict: true, undef: true */
/*global equal: false, getSize: false, ok: false, test: false, strictEqual: false */

( function( window ) {

'use strict';

function getBoxSize( num ) {
  var box = document.querySelector( '#ex' + num + ' .box' );
  return getSize( box );
}

test( 'arguments', function() {
  ok( !getSize( 0 ), 'Number returns falsey' );
  ok( !getSize( document.querySelector('#foobabbles') ), 'bad querySelector returns falsey' );
  ok( getSize('#ex1'), 'query selector string works' );
});

test( 'ex1: no styling', function() {
  var size = getBoxSize(1);
  equal( size.width, 400, 'Inherit container width' );
  equal( size.height, 0, 'No height' );
  equal( size.isBorderBox, false, 'isBorderBox' );
});

test( 'ex2: height: 100%', function() {
  var size = getBoxSize(2);
  equal( size.height, 200, 'Inherit height' );
});

test( 'ex3: width: 50%; height: 50%', function() {
  var size = getBoxSize(3);
  equal( size.width, 200, 'half width' );
  equal( size.height, 100, 'half height' );
});

test( 'ex4: border: 10px solid', function() {
  var size = getBoxSize(4);
  // console.log( size );
  equal( size.width, 220, 'width = 220 width' );
  equal( size.height, 120, 'height = 120 height' );
  equal( size.innerWidth, 200, 'innerWidth = 200 width' );
  equal( size.innerHeight, 100, 'innerHeight = 200 width' );
  equal( size.outerWidth, 220, 'outerWidth = 200 width + 10 border + 10 border' );
  equal( size.outerHeight, 120, 'outerHeight = 100 height + 10 border + 10 border' );
});

test( 'ex5: border: 10px solid; margin: 15px', function() {
  // margin: 10px 20px 30px 40px;
  var size = getBoxSize(5);
  // console.log( size );
  equal( size.width, 220, 'width = 220 width' );
  equal( size.height, 120, 'height = 120 height' );
  equal( size.marginTop, 10, 'marginTop' );
  equal( size.marginRight, 20, 'marginRight' );
  equal( size.marginBottom, 30, 'marginBottom' );
  equal( size.marginLeft, 40, 'marginLeft ' );
  equal( size.innerWidth, 200, 'innerWidth = 200 width' );
  equal( size.innerHeight, 100, 'innerHeight = 200 width' );
  equal( size.outerWidth, 280, 'outerWidth = 200 width + 20 border + 60 margin' );
  equal( size.outerHeight, 160, 'outerHeight = 100 height + 20 border + 40 margin' );
});

test( 'ex6: padding, set width/height', function() {
  var size = getBoxSize(6);
  // console.log( size );
  equal( size.width, 260, 'width' );
  equal( size.height, 140, 'height' );
  equal( size.innerWidth, 200, 'innerWidth = 200 width - 20 padding - 40 padding' );
  equal( size.innerHeight, 100, 'innerHeight = 200 height - 10 padding - 30 padding' );
  equal( size.outerWidth, 260, 'outerWidth' );
  equal( size.outerHeight, 140, 'outerHeight' );

});

test( 'ex7: padding, inherit width', function() {
  // padding: 10px 20px 30px 40px;
  var size = getBoxSize(7);
  // console.log( size );
  equal( size.width, 400, 'width' );
  equal( size.height, 140, 'height' );
  equal( size.paddingTop, 10, 'paddingTop' );
  equal( size.paddingRight, 20, 'paddingRight' );
  equal( size.paddingBottom, 30, 'paddingBottom' );
  equal( size.paddingLeft, 40, 'paddingLeft ' );
  equal( size.innerWidth, 340, 'innerWidth = 400 width - 20 padding - 40 padding' );
  equal( size.innerHeight, 100, 'innerHeight = 200 height - 10 padding - 30 padding' );
  equal( size.outerWidth, 400, 'outerWidth' );
  equal( size.outerHeight, 140, 'outerHeight' );

});

test( 'ex8: 66.666% values', function() {
  var size = getBoxSize(8);

  if ( size.width % 1 ) {
    ok( size.width > 266.6 && size.width < 266.7, 'width is between 266.6 and 266.7' );
  } else {
    // IE8 and Safari
    equal( size.width, 267, 'width is 267' );
  }

  if ( size.height % 1 ) {
    ok( size.height > 133.3 && size.height < 133.4, 'height is between 133.3 and 133.4' );
  } else {
    // IE8
    equal( size.height, 133, 'width is 133' );
  }
});

var supportsBoxSizing = window.getStyleProperty('boxSizing');

if ( supportsBoxSizing ) {
  test( 'ex9: border-box', function() {
    var size = getBoxSize(9);
    equal( size.isBorderBox, true, 'isBorderBox' );
    equal( size.width, 400, 'width' );
    equal( size.height, 200, 'height' );
    equal( size.innerWidth, 280, 'innerWidth' );
    equal( size.innerHeight, 120, 'innerHeight' );
    equal( size.outerWidth, 400, 'outerWidth' );
    equal( size.outerHeight, 200, 'outerHeight' );
  });
}

test( 'display: none', function() {
  var size = getSize( document.querySelector('#hidden .box1') );
  strictEqual( size.width, 0, 'width' );
  strictEqual( size.height, 0, 'height' );
  strictEqual( size.innerWidth, 0, 'innerWidth' );
  strictEqual( size.innerHeight, 0, 'innerHeight' );
  strictEqual( size.outerWidth, 0, 'outerWidth' );
  strictEqual( size.outerHeight, 0, 'outerHeight' );

  size.width = 300;

  size = getSize( document.querySelector('#hidden .box2') );
  strictEqual( size.width, 0, 'cannot over write zeroSize' );

});

test( 'percent values', function() {
  var size = getSize( document.querySelector('#percent .box') );
  strictEqual( size.marginLeft, 40, 'marginLeft' );
  strictEqual( size.marginTop, 80, 'marginTop' );
  strictEqual( size.width, 200, 'width' );
  strictEqual( size.height, 100, 'height' );
  strictEqual( size.innerWidth, 200, 'innerWidth' );
  strictEqual( size.innerHeight, 100, 'innerHeight' );
  strictEqual( size.outerWidth, 240, 'outerWidth' );
  strictEqual( size.outerHeight, 180, 'outerHeight' );
});


})( window );
