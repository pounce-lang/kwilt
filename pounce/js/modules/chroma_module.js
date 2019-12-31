(function () {
  'use strict';

  const module_words = {
    'chroma-scale': {
      expects: [
        { desc: '[colors]', ofType: 'array' },
        { desc: 'mode', ofType: 'string' },
        { desc: 'how many', ofType: 'integer' }
      ],
      effects: [-2], tests: [], desc: 'get a scale of colors',
      definition: function (s) {
        const howMany = s.pop(); // 16
        const modeStr = s.pop(); // 'lch'
        const colors = s.pop(); // ['#f00','#ff0','#0f0', '#0ff', '#00f', '#f0f', '#f00']
        const range = chroma.scale(colors).mode(modeStr).colors(howMany);
        s.push(range);
        return [s];
      }
    }

  };

  var exported = { words: module_words };

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.chroma_module = exported;
  }
})();
