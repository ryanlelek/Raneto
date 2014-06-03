# eventie - event binding helper

Makes dealing with events in IE8 bearable. Supported by IE8+ and good browsers.

``` js
var elem = document.querySelector('#my-elem');
function onElemClick( event ) {
  console.log( event.type + ' just happened on #' + event.target.id );
  // -> click just happened on #my-elem
}

eventie.bind( elem, 'click', onElemClick );

eventie.unbind( elem, 'click', onElemClick );
```

## Bower

eventie is a [Bower](http://bower.io) component.

``` bash
bower install desandro/eventie
```

## Component

component can also be installed via [component](http://github.com/component/component).

``` bash
component install desandro/eventie
```

## IE 8

eventie add support for `event.target` and [`.handleEvent` method](https://developer.mozilla.org/en-US/docs/DOM/EventListener#handleEvent(\)) for Internet Explorer 8.

## MIT license

eventie is released under the [MIT license](http://desandro.mit-license.org).
