test( 'matchesSelector', function() {

  equal( typeof matchesSelector, 'function', 'typeof is function' );

  var alpha = document.getElementById('alpha');

  equal( matchesSelector( alpha, '#alpha' ), true, '[#alpha] matches #alpha' );
  equal( matchesSelector( alpha, '.item' ), true, '[#alpha] matches .item' );
  equal( matchesSelector( alpha, 'div' ), true, '[#alpha] matches div' );
  equal( matchesSelector( alpha, 'p' ), false, '[#alpha] does not match p' );
  equal( matchesSelector( alpha, '.baz' ), false, '[#alpha] does not match .baz' );
  equal( matchesSelector( alpha, '#alpha.item' ), true, '[#alpha] matches #alpha.item' );
  equal( matchesSelector( alpha, '#alpha, foo'), true, '[#alpha] matches #alpha, foo' );
  equal( matchesSelector( alpha, 'foo, .item'), true, '[#alpha] matches foo, .item' );

  // orphaned elem
  var beta = document.createElement('div');
  beta.id = 'beta';
  beta.className = 'foo bar';

  equal( matchesSelector( beta, 'div' ), true, '[#beta] matches div' );
  equal( matchesSelector( beta, '#beta' ), true, '[#beta] matches #beta' );
  equal( matchesSelector( beta, '.bar' ), true, '[#beta] matches .bar' );
  equal( matchesSelector( beta, 'p' ), false, '[#beta] does not match p' );
  equal( matchesSelector( beta, '.baz' ), false, '[#beta] does not match .baz' );
  equal( matchesSelector( beta, '#beta.bar' ), true, '[#alpha] matches #alpha.item' );
  equal( matchesSelector( beta, '#beta, qux' ), true, '[#beta] matches #beta, qux' );
  equal( matchesSelector( beta, '.qux, .bar'), true, '[#alpha] matches .qux, .bar' );

});
