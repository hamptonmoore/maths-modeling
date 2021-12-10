/* 
  Prompt: Select the likely to be highest number in a list without seeing the numbers after it.
*/

var fs = require("fs");
let interviewees = 50
let rounds = 10000

let zscore_generator = (part, zscore)=> {
  return (people) => {
    let split = Math.floor(people.length * part)
    let mean = get_mean(people.slice(0, split))
    let std = get_std(people.slice(0, split))
    for (let i = split; i < people.length; i++){
      if ((people[i]-mean)/std >= zscore){
        return people[i];
      }
      if (i == people.length-1){
        return people[i]
      }
    }
  }
}

let zscore_adaptive_generator = (part, zscore)=> {
  return (people) => {
    let split = Math.floor(people.length * part)
    for (let i = split; i < people.length; i++){
      let mean = get_mean(people.slice(0, i))
      let std = get_std(people.slice(0, i))
      if ((people[i]-mean)/std >= zscore){
        return people[i];
      }
      if (i == people.length-1){
        return people[i]
      }
    }
  }
}

let zscore_adaptive_collins_generator = (part, zscore)=> {
  return (people) => {
    let split = Math.floor(people.length * part)
    let max = Math.max(...people.slice(0, split))
    for (let i = split; i < people.length; i++){
      if (people[i] < max){
        continue;
      }
      max = Math.max(...people.slice(0, split+1))
      let mean = get_mean(people.slice(0, i))
      let std = get_std(people.slice(0, i))
      if ((people[i]-mean)/std >= zscore){
        return people[i];
      }
      if (i == people.length-1){
        return people[i]
      }
    }
  }
}

let skip_generator = (skip)=>{
  return (people) => {
    let split = Math.floor(skip)
    let max = Math.max(...people.slice(0,split))
    for (let i = split; i < people.length; i++){
      if (people[i] > max){
        return people[i];
      }
      if (i == people.length-1){
        return people[i]
      }
    }
  }
}

let skip_max_skip_generator = (skip, max_skip)=>{
  return (people) => {
    let split = Math.floor(skip)
    let maxed = 0;
    let max = Math.max(...people.slice(0,split))
    for (let i = split; i < people.length; i++){
      if (people[i] > max){
        maxed++;
        if (maxed >= max_skip){
          return people[i];
        }
        max = people[i]
      }
      if (i == people.length-1){
        return people[i]
      }
    }
  }
}

let algs = [
  {
    name: "select first",
    func: (people) => {
      return people[0];
    },
  },
  {
    name: "select second",
    func: (people) => {
      return people[1];
    },
  },
  {
    name: "select last",
    func: (people) => {
      return people[people.length - 1];
    },
  },
  {
    name: "using first 1 search where i > max",
    func: (people) => {
      for (let i = 1; i < people.length; i++){
        if (people[i] > people[0]){
          return people[i];
        }
        if (i == people.length-1){
          return people[i]
        }
      }
    },
  },
  {
    name: "using first 2 search where i > max",
    func: skip_generator(2)
  },
  {
    name: "using first n/2 search where i > max",
    func: skip_generator(interviewees/2)
  },
  {
    name: "using first 0.4n search where i > max",
    func: skip_generator(interviewees * 0.4)
  },
];

// algs = []

//Brute force
// for (let i = 0.01; i < 1; i+=0.01){
//   algs.push({
//     name: `using first ${i}n search where i > max`,
//     func: skip_generator(interviewees * i)
//   },)
// }

// for (let j = 0; j < 11; j++){
//   for (let i = 0; i < 1; i+=0.02){
//     algs.push({
//       name: `using first ${i.toFixed(2)}n search where i > max skip first ${j.toFixed(2)} maxes`,
//       func: skip_max_skip_generator(interviewees * i, j)
//     },)
//   }
// }

// algs = []

// Normal
for (let j = 0.05; j < 1; j+=0.05){
  for (let i = 0; i < 2.5; i+=0.05){
    algs.push({
      name: `using first n*${j.toFixed(2)} search where zscore > ${i.toFixed(2)}; adaptive collins`,
      func: zscore_adaptive_collins_generator(j, i)
    })
    algs.push({
      name: `using first n*${j.toFixed(2)} search where zscore > ${i.toFixed(2)}; adaptive`,
      func: zscore_adaptive_generator(j, i)
    })
    algs.push({
      name: `using first n*${j.toFixed(2)} search where zscore > ${i.toFixed(2)}`,
      func: zscore_generator(j, i)
    })
  }
}
function generate_people(n) {
  return Array.from({ length: n }, () => Math.random());
}

function get_mean(ns){
  return ns.reduce((a, b) => a + b) / ns.length;
}

function get_std(ns){
  let mean = get_mean(ns);

    return Math.sqrt(ns.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / ns.length)
}

function evaluate(n, rounds, fun) {
  let succs = 0;
  for (let round = 0; round < rounds; round++) {
    let people = generate_people(n);
    if (fun(people) == Math.max(...people)) {
      succs++;
    }
  }
  
  return succs/rounds;
}

function log(t) {
  console.log(`${t}`);
}

data = JSON.parse(fs.readFileSync('./db.json', {encoding:'utf8', flag:'r'}));
let config = `${interviewees};${rounds}`
let usecache = !process.argv.includes("nocache")
let max = null
for (let algo of algs) {
  if (data[algo.name] == undefined) {
    data[algo.name] = {
      name: algo.name,
      datasets: {

      }
    }
  }
  let alg = data[algo.name]
  if (alg.datasets[config] == undefined || usecache == false) {
    let succrate = evaluate(interviewees, rounds, algo.func)
    log(`${alg.name} had a success rate of ${succrate*100}%`);
    alg.datasets[config] = succrate
  } else {
    log(`${alg.name} cached success rate of ${alg.datasets[config]*100}%`)
  }

  if (max == null || max.datasets[config] < alg.datasets[config]){
    max = alg
  }
}

console.log(`\n-------------\nBest Algorithm: ${max.name}\nSuccess Rate: ${max.datasets[config]}\n-------`)

// Nows lets find the best ever for this config

max = null
for (let a in data){
  let alg = data[a]
  if (alg.datasets[config] == undefined){
    continue
  }
  if (max == null || max.datasets[config] < alg.datasets[config]){
    max = alg
  }
}

console.log(`Best EVER Algorithm: ${max.name}\nSuccess Rate: ${max.datasets[config]}\n-------------\n`)


fs.writeFileSync("./db.json", JSON.stringify(data, null, 4))