module wrapper

Before a module's code is executed, Node.js will wrap it with a function wrapper that looks like the following:

> (function(exports, require, module, __filename, __dirname) {
// Module code actually lives in here
});


@font-face {
   font-family: NotoSans;
   src: url('./NotoSans-unhinted/NotoSans-Regular.ttf');
 }

 @font-face {
   font-family: NotoSans;
   src: url('./NotoSans-unhinted/NotoSans-Bold.ttf');
   font-weight: bold;
 }

 @font-face {
   font-family: SchrodersCircularTT;
   src: url('./Schroders Circular TT/OT-TTF/Fonts/SchrodersCircularTT-Normal.ttf');
 }

 @font-face {
  font-family: SchrodersCircularTT;
  src: url('./Schroders Circular TT/OT-TTF/Fonts/SchrodersCircularTT-Bold.ttf');
  font-weight: bold;
}

.card-header-schroderslink {
  height: 40px;
  font-family: SchrodersCircularTT;
  font-size: 16px;
  line-height: 1;
  text-align: left;
  color: #002a5e;
  background-color: #ffffff !important;
}

.card-body-schroderslink {
  font-family: NotoSans;
  background-color: #ffffff !important;
}
