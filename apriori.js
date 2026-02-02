const fs = require('fs');
const readline = require('readline');

const DATA_FILE = 'data.json';

const input = (prompt) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const loadData = () =>{
  try{
    raw = fs.readFileSync(DATA_FILE);
    return JSON.parse(raw);
  }catch(err){
    console.error("Erro ao carregar os dados:", err);
    process.exit(1);
  }
}

const getCombinations = items => {
  const results = [];
  for(let i = 0; i < items.length; i++){
    for(let j = i + 1; j < items.length; j++){
      results.push([items[i], items[j]]);
    }
  }
  return results;
}

const transactionsContain = (transaction, items) => {
  return items.every(item => transaction.items.includes(item));
}

const printRule = (antecedent, consequent, support, confidence) => {
  console.log(`Regra: [${antecedent}] => [${consequent}]`);
  console.log(`   Suporte: ${(support * 100).toFixed(1)}% | Confiança: ${(confidence * 100).toFixed(1)}%`);
  console.log('---');
}

const run = async () => {
  const MIN_SUPPORT = parseFloat(await input('Defina o suporte mínimo (padrão: 0.2 para 20%): ')) || 0.2;
  const MIN_CONFIDENCE = parseFloat(await input('Defina a confiança mínima (padrão: 0.3 para 30%): ')) || 0.3;

  console.log("Inicializando (Suporte Mínimo:", MIN_SUPPORT, ", Confiança Mínima:", MIN_CONFIDENCE, ")");
  
  const data = loadData();
  const totalTransactions = data.length;

  console.log("Total de transações:", totalTransactions, "\n");

  let allItems = new Set();
  data.forEach( t => t.items.forEach( item => allItems.add(item) ) );
  allItems = Array.from(allItems);

  let frequentItems = [];
  let itemCount = {};
  
  allItems.forEach( item => {
    const count = data.filter( t => t.items.includes(item) ).length;
    const support = count / totalTransactions;
    itemCount[item] = count;
    console.log(`Item ${item} aparece em ${count} transações (${(support * 100).toFixed(1)}%)`);
    if(support >= MIN_SUPPORT){
      frequentItems.push(item);
    }
  });
  console.log("\nItens frequentes:", frequentItems);

  const candidatePairs = getCombinations(frequentItems);
  candidatePairs.forEach( pair => {
    const [itemA, itemB] = pair;

    const countAB = data.filter( t => transactionsContain(t, pair) ).length;
    const supportAB = countAB / totalTransactions;

    if(supportAB >= MIN_SUPPORT){
      const countA = itemCount[itemA];
      const confidenceAtoB = countAB / countA;

      if(confidenceAtoB >= MIN_CONFIDENCE){
        printRule(itemA, itemB, supportAB, confidenceAtoB);
      }

      const countB = itemCount[itemB];
      const confidenceBtoA = countAB / countB;

      if(confidenceBtoA >= MIN_CONFIDENCE){
        printRule(itemB, itemA, supportAB, confidenceBtoA);
      }
    }
  });
}

run();