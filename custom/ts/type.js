var num = 1;
num = 2;
var num2 = null;
num2 = 1;
var num3 = null;
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
})(Color || (Color = {}));
var ColorPlus;
(function (ColorPlus) {
    ColorPlus[ColorPlus["Red"] = 1] = "Red";
    ColorPlus[ColorPlus["Blue"] = 2] = "Blue";
})(ColorPlus || (ColorPlus = {}));
var color = Color.Blue;
var colorPlus = ColorPlus.Blue;
console.log(color); // 1
console.log(colorPlus); // 1
