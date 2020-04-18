(function () {
  'use strict';

  const module_words = {
    'chroma-scale': {
      expects: [
        { desc: '[colors]', ofType: 'array' },
        { desc: 'mode', ofType: 'string' },
        { desc: 'how many', ofType: 'integer' }
      ],
      effects: [-2], tests: [], desc: `get a scale of colors. usage: chroma_module import
      ['#f00' '#ff0' '#0f0' '#0ff' '#00f' '#f0f' '#f00']
      [str-dequote] map
      lch
      16
      chroma-scale
      `,
      definition: function (s) {
        const howMany = s.pop(); // 16
        const modeStr = s.pop(); // 'lch'
        const colors = s.pop(); // ['#f00','#ff0','#0f0', '#0ff', '#00f', '#f0f', '#f00']
        const range = chroma.scale(colors).mode(modeStr).colors(howMany);
        s.push(range);
        return [s];
      }
    },
    'chroma-color': {
      expects: [
        { desc: 'hex colors', ofType: 'array' }
      ],
      effects: [0], tests: [], desc: `color format from hex to {r:? g:?, b:?} record`,
      definition: function (s) {
        const hexColor = s.pop(); // '#0000ff'
        const rgb = chroma(hexColor).get('rgb');
        s.push({ r: rgb[0], g: rgb[1], b: rgb[2], a: 1 });
        return [s];
      }
    },
    'chroma-brighten': {
      expects: [
        { desc: 'color', ofType: 'record' }, { desc: 'amount', ofType: 'number' }
      ],
      effects: [0], tests: [], desc: `brighten a color {r:? g:?, b:?} record`,
      definition: function (s) {
        const amount = s.pop();
        const color = s.pop();
        const rgb = chroma(color).brighten(amount).get('rgb');
        s.push({ r: rgb[0], g: rgb[1], b: rgb[2], a: 1 });
        return [s];
      }
    },
    'chroma-saturate': {
      expects: [
        { desc: 'color', ofType: 'record' }, { desc: 'amount', ofType: 'number' }
      ],
      effects: [0], tests: [], desc: `saturate a color {r:? g:?, b:?} record`,
      definition: function (s) {
        const amount = s.pop();
        const color = s.pop();
        const rgb = chroma(color).saturate(amount).get('rgb');
        s.push({ r: rgb[0], g: rgb[1], b: rgb[2], a: 1 });
        return [s];
      }
    },
    'chroma-rotate': {
      expects: [
        { desc: 'color', ofType: 'record' }, { desc: 'twist', ofType: 'number' }
      ],
      effects: [0], tests: [], desc: `rotate the hue of a color by degrees`,
      definition: function (s) {
        const degrees = s.pop();
        const color = s.pop();
        const hue = chroma(color).get('hsl.h');
        const newHue = (hue + degrees + 360) % 360;
        const rgb = chroma(color).set('hsl.h', newHue).get('rgb');
        s.push({ r: rgb[0], g: rgb[1], b: rgb[2], a: 1 });
        return [s];
      }
    }
  };

  const example = `
canvas_basic_module import
list_module import
rec_module import
chroma_module import

canvas cb-init cb-clear
# [ '#f0f' '#f00' '#ff0' '#0f0' '#0ff' '#00f' '#f0f']
# [ '#f0f' '#00f' '#0ff' '#0f0' '#ff0' '#f00' '#f0f' ] # reversed
 [ '#,
 '.saturate'0f0' '#0ff' '#00f' '#f0f' '#f00' '#ff0' '#0f0' ] # offset (kkh's pick)
# [ '#0f0' '#ff0' '#f00' '#f0f' '#00f' '#0ff' '#0f0' ] # offset and reversed
[str-dequote] map
#lrgb
lch
#lab
19 # get one more since the last is duplicate of the first
chroma-scale
 [chroma-color] map
# now drop the last (dublicate color) element of the array
uncons [drop] dip
[{} swap color set gx x set 0 y set 10 w set 160 h set dup cb-box] [boxit] def
[0] [gx] def
[boxit gx 10 + [] cons [gx] def] map drop
[7.3 6.5 5.3 4.1 3 2 1 0]
[0] [gy] def
[{r:255 g:255 b:255} swap 8 / a set {x:0 w:180 h:10} swap color set gy y set cb-box] [layerit] def
[layerit gy 10 + [] cons [gy] def] map drop

[0.5 1 2 3.2 4.5 5.8 6.7 7.5]
[{r:0 g:0 b:0} swap 8 / a set {x:0 w:180 h:10} swap color set gy y set cb-box] [layerit] def
[layerit gy 10 + [] cons [gy] def] map drop 
  `;

  var exported = { words: module_words };

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.chroma_module = exported;
  }
})();
