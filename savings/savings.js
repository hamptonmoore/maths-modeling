let bal = 800;
let apy = 0.04
let monthly = 50
for (let i = 0; i < 12 * 5; i++){
    bal *= 1 + (apy/12);
    bal+=monthly
}
console.log(bal)