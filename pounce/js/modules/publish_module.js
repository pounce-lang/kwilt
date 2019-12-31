(function () {
  'use strict';

  const module_words = {
    'content-publish': {
      expects: [{ desc: 'data to be used as text content', ofType: 'string' },
      { desc: 'id of DOM element', ofType: 'string' }
      ], effects: [-2], tests: [], desc: 'publish to a DOM element',
      definition: function (s) {
        const eleId = s.pop();
        const data = s.pop();
        const domEle = document.querySelector('#' + eleId);
        domEle.textContent = data;
        return [s];
      }
    },
    'attr-publish': {
      expects: [{ desc: 'data to be used as text content', ofType: 'string' },
      { desc: 'attribute name', ofType: 'string' },
      { desc: 'id of DOM element', ofType: 'string' }
      ], effects: [-2], tests: [], desc: 'publish to a DOM element',
      definition: function (s) {
        const eleId = s.pop();
        const name = s.pop();
        const value = s.pop();
        const domEle = document.querySelector('#' + eleId);
        domEle.setAttribute(name, value);
        return [s];
      }
    }

  };

  var exported = { words: module_words };

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.publish_module = exported;
  }
})();
