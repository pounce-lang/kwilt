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

[
  drop 
  {x:320 y:70  w:20 h:20} picked-color color set palette cb-box-ctx  
  {x:320 y:50  w:20 h:20} picked-color 1 chroma-brighten color set palette cb-box-ctx  
  {x:320 y:30  w:20 h:20} picked-color 2 chroma-brighten color set palette cb-box-ctx  
  {x:320 y:10  w:20 h:20} picked-color 3 chroma-brighten color set palette cb-box-ctx  
  {x:320 y:90  w:20 h:20} picked-color -1 chroma-brighten color set palette cb-box-ctx  
  {x:320 y:110 w:20 h:20} picked-color -2 chroma-brighten color set palette cb-box-ctx  
  {x:320 y:130 w:20 h:20} picked-color -3 chroma-brighten color set palette cb-box-ctx  

  {x:300 y:70  w:20 h:20} picked-color -10 chroma-rotate color set palette cb-box-ctx  
  {x:280 y:70  w:20 h:20} picked-color -20 chroma-rotate color set palette cb-box-ctx  
  {x:260 y:70  w:20 h:20} picked-color -30 chroma-rotate color set palette cb-box-ctx  
  {x:240 y:70  w:20 h:20} picked-color -40 chroma-rotate color set palette cb-box-ctx  
  {x:340 y:70  w:20 h:20} picked-color 10 chroma-rotate color set palette cb-box-ctx  
  {x:360 y:70  w:20 h:20} picked-color 20 chroma-rotate color set palette cb-box-ctx  
  {x:380 y:70  w:20 h:20} picked-color 30 chroma-rotate color set palette cb-box-ctx  
  {x:400 y:70  w:20 h:20} picked-color 40 chroma-rotate color set palette cb-box-ctx  

  {x:300 y:90  w:20 h:20} picked-color -1 chroma-saturate color set palette cb-box-ctx  
  {x:280 y:110 w:20 h:20} picked-color -2 chroma-saturate color set palette cb-box-ctx  
  {x:260 y:130 w:20 h:20} picked-color -3 chroma-saturate color set palette cb-box-ctx  
  {x:340 y:50  w:20 h:20} picked-color 1 chroma-saturate color set palette cb-box-ctx  
  {x:360 y:30  w:20 h:20} picked-color 2 chroma-saturate color set palette cb-box-ctx  
  {x:380 y:10  w:20 h:20} picked-color 3 chroma-saturate color set palette cb-box-ctx  
] [blend-pallet] def


[205] [left] def 
[480] [right] def
[11] [ticks] def
[right left -] [width] def
[width ticks / 2 / - left - width / ticks * 1 round 0 math-max ticks 1 - /] [to-alpha] def
[.904 * width * left + 1 +] [from-alpha] def 

alpha-bg cb-init cb-clear
alpha cb-init cb-clear
{x:0 y:0 w:480 h:30 color:{r:127 g:127 b:127 a:1}} alpha-bg cb-box-ctx
{x:205 y:10 w:275 h:5 color:{r:0 g:0 b:0 a:1}} alpha-bg cb-box-ctx
{x:205 y:15 w:275 h:5 color:{r:255 g:255 b:255 a:1}} alpha-bg cb-box-ctx
[[0 1 2 3 4 5 6 7 8 9 10] [
 dup 25 * 205 + {x:0 y:5 w:23 h:20} swap x set swap picked-color swap 10 / a set color set
 alpha cb-box-ctx
] map drop] [blend-alpha] def

[ {x:205 y:26 w:275 h:3 color:{r:127 g:127 b:127 a:1}} alpha cb-box-ctx
  {x:0 y:26 w:23 h:3 color:{r:250 g:10 b:10 a:1}} canvas-mix-percent from-alpha x set 
   alpha cb-box-ctx
] [indicate-current-alpha] def


# mix and paint
[{r:255 g:0 b:255}] [picked-color] def
blend-alpha

[palette cb-color-at [] cons [picked-color] def blend-pallet blend-alpha drop
] [pointerdown] palette subscribe 

##[ selected get [] cons [canvas-mix-percent] def drop ] [change] canvasMixPercentSelect subscribe
[dup2 > [drop] [swap drop] ifte] [math-max] def
[ x get to-alpha log [] cons [canvas-mix-percent] def drop indicate-current-alpha ] 
[pointerdown] alpha subscribe

# setup the painting area 
canvas0 cb-init cb-clear
canvas1 cb-init cb-clear
canvas2 cb-init cb-clear
[0] [paint-on-layer] def
{x:0 y:0 w:1200 h:1200 color:{r:255 g:255 b:255 a:1}} canvas0 cb-box-ctx

[1] [canvas-mix-percent] def

[ x get 10 - 20 / 1 round 20 * x set y get 10 - 20 / 1 round 20 * y set 
  {w:20 h:20} swap merge picked-color canvas-mix-percent a set color set 
  dup
  canvas paint-on-layer str-append cb-box-ctx
  [
    layer-view-canvas- paint-on-layer str-append cb-box-ctx
  ] cons transform-array paint-on-layer get [drop] dip layer-view-canvas- paint-on-layer str-append cb-transform-ctx
] [print-block] def

[false] [mouse-button-down] def
[ print-block [true] [mouse-button-down] def drop] [pointerdown] canvas2 subscribe 
[ [false] [mouse-button-down] def drop] [pointerup] canvas2 subscribe 
[ [false] [mouse-button-down] def drop] [pointerout] canvas2 subscribe 
[ buttons get 1 == mouse-button-down or [print-block] [drop] ifte drop] [pointermove] canvas2 subscribe 

[[true] [mixCanvasMode] def 
] [set-canvas-mode] def

[[false] [mixCanvasMode] def 
] [reset-canvas-mode] def

set-canvas-mode

[{0:{xsc:0.3 ysc:0.35 xsk:0 ysk:-0.02 xtr:40 ytr:30}
  1:{xsc:0.35 ysc:0.4 xsk:0 ysk:-0.03 xtr:130 ytr:50}
  2:{xsc:0.4 ysc:0.45 xsk:0 ysk:-0.04 xtr:230 ytr:80}
  }] [transform-array] def

#layer nav background
layer-view-canvas-bg cb-init cb-clear
[
  {color:{r:255 g:255 b:255 a:0.5} x:0 y:0 w:480 h:560} cb-box
] transform-array 0 get [drop] dip layer-view-canvas-bg cb-transform-ctx
[
  {color:{r:255 g:255 b:255 a:0.5} x:0 y:0 w:480 h:560} cb-box
] transform-array 1 get [drop] dip layer-view-canvas-bg cb-transform-ctx
[
  {color:{r:255 g:255 b:255 a:0.5} x:0 y:0 w:480 h:560} cb-box
] transform-array 2 get [drop] dip layer-view-canvas-bg cb-transform-ctx
#layer nav preview
layer-view-canvas-0 cb-init cb-clear
layer-view-canvas-1 cb-init cb-clear
layer-view-canvas-2 cb-init cb-clear

[[ {color:{r:0 g:0 b:63 a:0.25} x:0 y:580 w:480 h:30} layer-view-canvas- paint-on-layer str-append cb-box-ctx
] transform-array paint-on-layer get [drop] dip layer-view-canvas- paint-on-layer str-append cb-transform-ctx
] [indicate-layer] def

[[ {color:{r:0 g:0 b:63 a:0.0} x:-3 y:577 w:486 h:36} layer-view-canvas- paint-on-layer str-append cb-box-ctx
] transform-array paint-on-layer get [drop] dip layer-view-canvas- paint-on-layer str-append cb-transform-ctx
] [de-indicate-layer] def
indicate-layer
indicate-current-alpha

# layer events
[ de-indicate-layer x get 130 < 
    [0]
    [x get 260 < 
      [1]
      [2]
    ifte
  ]
  ifte
  [] cons [paint-on-layer] def
  indicate-layer
 drop
] [pointerdown] layer-view-canvas-2 subscribe
[] [contextmenu] layer-view-canvas-2 subscribe
#[drop] [contextmenu] palette subscribe
#[drop] [contextmenu] alpha subscribe
`;
const out = pounce.run(Pounce_ast.parse(pl+' ', {actions: parser_actions.parser_actions}), [], [pounce.words])[1][0];

// const topEle = document.getElementById('top');
// const p = document.createElement('p');
// p.textContent = out.toString();
// topEle.appendChild(p);


// var dataURL = canvas0.toDataURL();
// console.log(dataURL);



// canvas_basic_module import
// canvas cb-init cb-clear
// list_module import
// rec_module import

// [18] [left] def 
// [110] [right] def
// [10] [ticks] def
// [right left -] [width] def
// [dup2 > [drop] [swap drop] ifte] [math-max] def

// [width ticks / 2 / - left - width / ticks * 1 round 0 math-max ticks /] [to-alpha] def
// [width * left + ] [from-alpha] def   
// {x:0 y:0 w:0 h:30 color:{r:0 g:0 b:0 a:0.2}} left w set cb-box
// {x:0 y:0 w:0 h:30 color:{r:0 g:0 b:0 a:0.2}} left right + w set cb-box
// [10 19 20 29 30 39 40 49 50 59 60 69 70 79 80 89 90 99 100 109 110 119] 
// [8 +] map
// [dup
// {x:0 y:0 w:1 h:30 color:{r:0 g:0 b:0 a:0.9}} swap x set cb-box
// to-alpha 
// # width ticks / 2 / - left - width / ticks * 1 round 0 math-max ticks /
// ] map
// #[from-alpha] map
