let sb = 3500;
let apy = 0.0435
let length = 10 + 4.5
let bal = sb;
let monthly = (-bal*(apy/12)) -(bal/(length*12))
let lastmdiff = 0
let diff = 100000;
let count = 0;
let thresh = 0.001
let maxcount = 100
while ((diff > thresh || diff < -thresh) && count < maxcount){
    let bal = sb;
    monthly += lastmdiff
    for (let i = 0; i < 12 * length; i++){
        bal *= 1 + (apy/12);
        bal+=monthly
    }
    console.log(`Total: ${bal}\nMonthly: ${monthly}\nNeeded Monthly change: ${-bal/(12*length)}`)
    lastmdiff = (bal/(12*length)) * -1;
    diff = bal
    count++;
}

console.log("Cycle count = " + count)