//  kwilt

const pl = `

canvas_basic_module import
subscription_module import
list_module import
rec_module import
chroma_module import
publish_module import

palette cb-init cb-clear
# set up the colors of the palette for picking colors and mixing
{x:0 y:0 w:600 h:200 color:{r:127 g:127 b:127 a:1}} cb-box
{x:200 y:0 w:400 h:200 color:{r:255 g:255 b:255 a:1}} cb-box

# [ '#f0f' '#f00' '#ff0' '#0f0' '#0ff' '#00f' '#f0f']
# [ '#f0f' '#00f' '#0ff' '#0f0' '#ff0' '#f00' '#f0f' ] # reversed
 [ '#0f0' '#0ff' '#00f' '#f0f' '#f00' '#ff0' '#0f0' ] # offset (kkh's pick)
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
[{r:255 g:255 b:255} swap 8 / a set {x:0 w:200 h:10} swap color set gy y set cb-box] [layerit] def
[layerit gy 10 + [] cons [gy] def] map drop

[0.5 1 2 3.2 4.5 5.8 6.7 7.5]
[{r:0 g:0 b:0} swap 8 / a set {x:0 w:200 h:10} swap color set gy y set cb-box] [layerit] def
[layerit gy 10 + [] cons [gy] def] map drop

# mix and paint

[0.25] [mix-percent] def

[ x get 10 - 20 / 1 round 20 * x set y get 10 - 20 / 1 round 20 * y set 
    {w:20 h:20} swap merge picked-color mix-percent a set color set palette cb-box-ctx
] [mix-block] def

[ x get 200 > mixPaletteMode and
    [mix-block]
    [palette cb-color-at [] cons [picked-color] def]
  ifte
drop
#  set-palette-mode log
] [mousedown] palette subscribe 

[ selected get [] cons [mix-percent] def drop ] [change] mixPercentSelect subscribe
[ selected get [] cons [canvas-mix-percent] def drop ] [change] canvasMixPercentSelect subscribe

# setup the painting area 
canvas cb-init cb-clear
{x:0 y:0 w:1200 h:1200 color:{r:255 g:255 b:255 a:1}} cb-box

[1] [canvas-mix-percent] def

[ x get 10 - 20 / 1 round 20 * x set y get 10 - 20 / 1 round 20 * y set 
  {w:20 h:20} swap merge picked-color canvas-mix-percent a set color set 
  dup
  canvas cb-box-ctx
  [
    layer-view-canvas cb-box-ctx
  ] cons {xsc:0.3 ysc:0.3 xsk:0 ysk:-0.02 xtr:40 ytr:30} cb-transform
] [print-block] def

[false] [mouse-button-down] def
[ print-block [true] [mouse-button-down] def] [mousedown] canvas subscribe 
[ [false] [mouse-button-down] def] [mouseup] canvas subscribe 
[ [false] [mouse-button-down] def] [mouseout] canvas subscribe 
[ buttons get 1 == mouse-button-down or [print-block] [drop] ifte] [mousemove] canvas subscribe 

[[true] [mixPaletteMode] def 
  'text-decoration:underline;' str-dequote style mixBtn attr-publish
  'text-decoration:none;' str-dequote style pickBtn attr-publish] [set-palette-mode] def

[[false] [mixPaletteMode] def 
'text-decoration:underline;' str-dequote style pickBtn attr-publish
'text-decoration:none;' str-dequote style mixBtn attr-publish] [reset-palette-mode] def

set-palette-mode
[drop set-palette-mode] [mousedown] mixBtn subscribe
[drop reset-palette-mode] [mousedown] pickBtn subscribe


[[true] [mixCanvasMode] def 
  'text-decoration:underline;' str-dequote style canvasMixBtn attr-publish
  'text-decoration:none;' str-dequote style canvasPickBtn attr-publish] [set-canvas-mode] def

[[false] [mixCanvasMode] def 
  'text-decoration:underline;' str-dequote style canvasPickBtn attr-publish
  'text-decoration:none;' str-dequote style canvasMixBtn attr-publish
] [reset-canvas-mode] def

set-canvas-mode
[drop set-canvas-mode] [mousedown] canvasMixBtn subscribe
[drop reset-canvas-mode] [mousedown] canvasPickBtn subscribe


#layer nav
layer-view-canvas cb-init cb-clear
[
  {color:{r:255 g:255 b:255 a:0.6} x:0 y:0 w:480 h:560} cb-box
] {xsc:0.3 ysc:0.3 xsk:0 ysk:-0.02 xtr:40 ytr:30} cb-transform
[
  {color:{r:255 g:255 b:255 a:0.5} x:0 y:0 w:480 h:560} cb-box
] {xsc:0.35 ysc:0.35 xsk:0 ysk:-0.03 xtr:130 ytr:50} cb-transform
[
  {color:{r:255 g:255 b:255 a:0.5} x:0 y:0 w:480 h:560} cb-box
] {xsc:0.4 ysc:0.4 xsk:0 ysk:-0.04 xtr:230 ytr:80} cb-transform

`;
const out = pounce.run(Pounce_ast.parse(pl+' ', {actions: parser_actions.parser_actions}), [], [pounce.words])[1][0];

// const topEle = document.getElementById('top');
// const p = document.createElement('p');
// p.textContent = out.toString();
// topEle.appendChild(p);


// var dataURL = canvas.toDataURL();
// console.log(dataURL);