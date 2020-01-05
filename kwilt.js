//  kwilt

const pl = `

canvas_basic_module import
subscription_module import
list_module import
rec_module import
chroma_module import

palette cb-init cb-clear
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
[{r:255 g:255 b:255} swap 8 / a set {x:0 w:180 h:10} swap color set gy y set cb-box] [layerit] def
[layerit gy 10 + [] cons [gy] def] map drop

[0.5 1 2 3.2 4.5 5.8 6.7 7.5]
[{r:0 g:0 b:0} swap 8 / a set {x:0 w:180 h:10} swap color set gy y set cb-box] [layerit] def
[layerit gy 10 + [] cons [gy] def] map drop

[palette cb-color-at [] cons [picked-color] def
#  {x:10 y:10 w:20 h:20} swap color set cb-box
] [mousedown] palette subscribe 

[
    x get 10 - 20 / 1 round 20 * x set y get 10 - 20 / 1 round 20 * y set 
{w:20 h:20} swap merge picked-color color set cb-box
] [print-block] def
canvas cb-init cb-clear
[false] [mouse-button-down] def
[print-block [true] [mouse-button-down] def] [mousedown] canvas subscribe 
[ [false] [mouse-button-down] def] [mouseup] canvas subscribe 
[ [false] [mouse-button-down] def] [mouseout] canvas subscribe 
[ buttons get 1 == mouse-button-down or [print-block] [drop] ifte] [mousemove] canvas subscribe 
`;
const out = pounce.run(Pounce_ast.parse(pl+' ', {actions: parser_actions.parser_actions}), [], [pounce.words])[1][0];

// const topEle = document.getElementById('top');
// const p = document.createElement('p');
// p.textContent = out.toString();
// topEle.appendChild(p);