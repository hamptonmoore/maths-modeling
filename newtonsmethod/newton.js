const prompt = require('prompt-sync')();

//const poly = prompt('Enter your polynomial (please use spaces between terms)? ');
const poly = "4x^4 + 2x^3 + 9x^2 + 10x + -10";
const coes = poly.split("x")
    .map((i)=> {
        i=i.split(" ");
        return i[i.length-1]
    })
    .map((i)=> {
        if (i == ""){
            return 1;
        } else {
            return Number(i)
        }
    });
const dcoes = [coes[0] * 4, coes[1] * 3, coes[2] * 2, coes[3] * 1];
console.log(`The entered polynomial is ${poly}, the parsed coefficients are ${coes.join(" ")}, with the derivative co-efficients ${dcoes.join(" ")}`);

let distance = null;

let x = 1;
let y = 0;
while (distance > 0.01 || distance == null) {
    y = calcY(x, coes);
    let slope = calcY(x, dcoes);
    distance = Math.abs(y);
    let newx = x - (y/slope)
    console.log(`Tested x=${x}, got y=${y}, new x = ${newx}, distance = ${distance}`);
    x=newx;
}

console.log(`Final x = ${x} where y = ${y}`)


function calcY(x, coes){
    return coes.map((i, pos, a)=> {
        let power = (a.length-1) - pos;

        return i * Math.pow(x, power);
    })
    .reduce((a, b)=> a+b);
}