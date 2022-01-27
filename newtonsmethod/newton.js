const prompt = require('prompt-sync')();

let poly;
if (process.env.FUNCTION){
    poly = process.env.FUNCTION
} else {
    poly = prompt('Enter your polynomial (please use spaces between terms)? ');
}

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
    console.log(`Tested x=${x}, got y=${y}, with a slope = ${slope}, new x = ${newx}`);
    x=newx;
}

console.log(`Final x = ${x} where y = ${y}`)

function deriv(coes){
    
}

function calcY(x, coes){
    return coes.map((i, pos, a)=> {
        let power = (a.length-1) - pos;
        return i * Math.pow(x, power);
    })
    .reduce((a, b)=> a+b);
}