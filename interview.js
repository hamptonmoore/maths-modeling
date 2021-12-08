/* 
  Prompt: Select the likely to be highest number in a list without seeing the numbers after it.
*/

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
    func: (people) => {
      let max = Math.max(...people.slice(0,2))
      for (let i = 2; i < people.length; i++){
        if (people[i] > max){
          return people[i];
        }
        if (i == people.length-1){
          return people[i]
        }
      }
    },
  },
  {
    name: "using first n/2 search where i > max",
    func: (people) => {
      let split = Math.floor(people.length/2)
      let max = Math.max(...people.slice(0,split))
      for (let i = split; i < people.length; i++){
        if (people[i] > max){
          return people[i];
        }
        if (i == people.length-1){
          return people[i]
        }
      }
    },
  },
  {
    name: "using first n/2 search where zscore > 1.5",
    func: (people) => {
      let split = Math.floor(people.length/2)
      let mean = get_mean(people.slice(0, split))
      let std = get_std(people.slice(0, split))
      for (let i = split; i < people.length; i++){
        if ((people[i]-mean)/std >= 1.5){
          return people[i];
        }
        if (i == people.length-1){
          return people[i]
        }
      }
    },
  },
];

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
  document.write(`${t}</br>`);
}

for (let alg of algs) {
  log(`${alg.name} had a success rate of ${evaluate(50, 10000, alg.func)*100}%`);
}
