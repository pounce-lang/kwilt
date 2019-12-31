//  7rr

const pl = `
canvas_basic_module import
rec_module import
list_module import
subscription_module import
publish_module import

# init a pounce connection to a canvas tag with id 'maine'
maine cb-init cb-clear
[250] [width] def
[150] [height] def
[7] [boxes] def
[36] [intBase] def

# random rectangle data in list form
[[]
 random width * random width * dup2 > [swap] if [dup] dip swap -
 [1 round push] dip 1 round push
 random height * random height * dup2 > [swap] if [dup] dip swap -
 [1 round push] dip 1 round push
 random 255 * 1 round push
 random 255 * 1 round push
 random 255 * 1 round push
 random 255 * 1 round push
 0 push
] [random-rectangle-list] def

# rectangle-rec (takes a list of data)
[{x:0 w:0 y:0 h:0}
  [uncons swap] dip swap x set
  [uncons swap] dip swap w set
  [uncons swap] dip swap y set
  [uncons swap] dip swap h set
  {r:180 g:150 b:150 a:0.5}
    [uncons swap] dip2 rolldown r set
    [uncons swap] dip2 rolldown g set
    [uncons swap] dip2 rolldown b set
    [uncons swap] dip2 rolldown 255 / 0.01 round a set
  color set
  [uncons drop] dip swap s set
] [rectangle-rec] def

[rectangle-rec cb-box] [box] def

# background-rectangle-list
[[0] width push 0 push height push 
random 0.5 < [0] [255] ifte 
dup [push] dip
dup [push] dip
push
255 push
0 push
] [background-rectangle-list] def

# make a nice random composition of rectangles 
[[] background-rectangle-list push [random-rectangle-list push] boxes repeat] [comp] def

#[ x get 10 / 75 + x set
  #  w get 10 / w set
  #  y get 10 / y set
  #  h get 10 / h set
  #] [shrink] def
        
[ x get 2 * x set
  w get 2 * x set
  y get 2 * y set
  h get 2 * h set
] [grow] def
          
# compress example input [253 254 255 2 1 0 10 20 30]
[[pop 16 << swap pop 8 << swap pop swap [+ +] dip] 3 repeat
drop
intBase int2s 
[intBase int2s] dip 
[intBase int2s] dip2
['-'] dip2
['-'] dip
str-append str-append str-append str-append] [compress] def

['-' str-split
 [] 
[swap
intBase s2int 
 dup 255 AND swap
dup 255 8 << AND 8 >> swap
dup 255 16 << AND 16 >> swap drop
 [push] dip2 [push] dip push] 3 repeat] [decompress] def


# save this composition to storage
[total-count
1 + dup count store.set
art swap str-append store.set] [save] def

[pop compress '+' str-append] [bite] def
[pop compress
 [bite] dip str-append
 [bite] dip str-append
 [bite] dip str-append
 [bite] dip str-append
 [bite] dip str-append
 [bite] dip str-append
 [bite] dip str-append
 [drop] dip] [zip] def

['+' str-split
 decompress [] cons
[decompress] dip cons
[decompress] dip cons
[decompress] dip cons
[decompress] dip cons
[decompress] dip cons
[decompress] dip cons
[decompress] dip cons
] [unzip] def

[uncons swap box [uncons swap box] boxes repeat drop] [paint] def
#[uncons swap rectangle-rec shrink cb-box 
#  [uncons swap rectangle-rec shrink cb-box] boxes repeat drop] [mini-paint] def

[
  total-count 100 <
  [{v:0 c:''}
    comp dup paint
    zip
    c set
    7rr store.get
    swap push
    7rr store.set total-count dup view store.set 1 + count store.set
    0 pub-v
  ]
  [view-index 100 >=
   [99 view store.set] if show-view
   "Here you are at the end of this exploration of random 2-D compositions, one hundred of them. Click the 'prev' button to review and change your ratings." disp-instr
 ]
ifte
] [create-new] def

 [ dup dup
  dup 0 > 
    [ '+' swap str-append str-dequote up-vote-score content-publish]
    [ drop ' ' str-dequote up-vote-score content-publish]
  ifte
  dup 0 < 
    [ str-dequote dn-vote-score content-publish]
    [ drop ' ' str-dequote dn-vote-score content-publish]
  ifte
  dup 0 == 
    [ 'neutral' str-dequote up-vote-score content-publish 'not rated' str-dequote dn-vote-score content-publish]
  if
  drop
  ] [pub-v] def

 [7rr store.get view-index peek v get pub-v c get unzip paint] [show-view] def

[view store.get] [view-index] def
[count store.get] [total-count] def

[[v get] dip apply dup [v set] dip pub-v] [set-rating] def

[
  [] 
  [v get 2 > [push] [drop] ifte ] reduce
  log
] [separate] def

[drop
  7rr store.get 
  view-index 1 + total-count == 
    [pop [1 +] set-rating push 7rr store.set]
    [view-index peek [1 +] set-rating view-index poke 7rr store.set] 
  ifte
  drop drop
] [mousedown] plusOneBtn subscribe

[drop
  7rr store.get 
    view-index 1 + total-count == 
    [pop [1 -] set-rating push 7rr store.set
    ]
    [view-index peek [1 -] set-rating view-index poke 7rr store.set] 
  ifte
  drop drop
] [mousedown] minusOneBtn subscribe

[drop
  view-index 0 >
  [view store.get 1 - view store.set show-view drop ]
  if
  disp-view-index
  '' disp-instr
  drop
] [mousedown] prevBtn subscribe

[
  view-index 1 + total-count <
  [view store.get 1 + view store.set show-view drop]
  [create-new]
  ifte
  disp-view-index
  drop drop
] [mousedown] nextBtn subscribe

['display:block;' str-dequote style feedback-section attr-publish
 'display:none;' str-dequote style about-section attr-publish
] [mousedown] feedbackBtn subscribe 
['display:block;' str-dequote style about-section attr-publish
 'display:none;' str-dequote style feedback-section attr-publish
] [mousedown] aboutBtn subscribe 

[view-index 1 + ' of ' str-append
 total-count dup 100 swap - [', ' str-append str-append] dip str-append ' left to go' str-append
 view-number content-publish] [disp-view-index] def

[ str-dequote instructions content-publish] [disp-instr] def

# init the store if needed
7rr store.get not [[] 7rr store.set drop] if
# init view index
7rr store.get list-length dup 100 > [[] 7rr store.set drop drop 0] if count store.set
total-count 1 - view store.set

# kick off the ui with a new image
create-new
disp-view-index

`;
const out = pounce.run(Pounce_ast.parse(pl+' ', {actions: parser_actions.parser_actions}), [], [pounce.words])[1][0];

// const topEle = document.getElementById('top');
// const p = document.createElement('p');
// p.textContent = out.toString();
// topEle.appendChild(p);