# Mineração de Dados - Algoritmo Apriori

## Descrição

Implementação do algoritmo **Apriori** para descoberta de **Regras de Associação** em bases de dados transacionais. Este projeto foi desenvolvido no contexto de Business Intelligence (BI) e Data Warehousing, permitindo identificar correlações do tipo "quem compra X, também compra Y", fundamentais para estratégias de vendas cruzadas (cross-selling) e organização de layout de lojas.

## 🧠 Algoritmo Apriori

O **Apriori** foi escolhido por três pilares principais:

### 1. Eficiência por Poda

Diferente de algoritmos de força bruta, o Apriori utiliza a propriedade da monotonicidade:
> "Se um conjunto de itens é frequente, então todos os seus subconjuntos também devem ser frequentes"

Inversamente, se um item é raro, qualquer combinação que o contenha também será rara e pode ser descartada imediatamente.

### 2. Adequação Acadêmica e Prática

É o algoritmo clássico para ensino de Regras de Associação, sendo robusto o suficiente para bases de dados transacionais típicas de varejo.

### 3. Simplicidade de Implementação

A lógica iterativa baseada em contagem de frequência e filtragem facilita a implementação em linguagens de alto nível.

## Métricas: Suporte e Confiança

O algoritmo opera calculando duas métricas principais:

### Suporte

Mede a frequência com que o conjunto de itens aparece na base de dados total:

$$\text{Sup}(A \cup B) = \frac{\text{Transações contendo A e B}}{\text{Número Total de Transações}}$$

### Confiança

Mede a probabilidade de se encontrar o item B, dado que o item A está presente:

$$\text{Conf}(A \rightarrow B) = \frac{\text{Sup}(A \cup B)}{\text{Sup}(A)}$$

## Estrutura do Projeto

``` plaintext
codigoBDII/
├── apriori.js      # Implementação principal do algoritmo
├── data.json       # Base de dados transacionais
└── README.md       # Documentação
```

## Configuração

### Limiares Padrão

```javascript
const MIN_SUPPORT = 0.2;      // Suporte mínimo: 20%
const MIN_CONFIDENCE = 0.3;   // Confiança mínima: 30%
```

### Formato dos Dados

O arquivo [data.json](data.json) contém um array de transações no formato:

```json
[
  { "id": 1, "items": ["cafe", "pao", "manteiga"] },
  { "id": 2, "items": ["leite", "cerveja", "pao", "manteiga"] }
]
```

## Como Executar

### Pré-requisitos

- Node.js instalado (versão 12 ou superior)

### Execução

```bash
node apriori.js
```

## Exemplo de Saída

Com a base de dados fornecida (10 transações), o algoritmo produz:

``` bash
Initializing (Min Support: 0.2 , Min Confidence: 0.3 )
Total transactions: 10
Frequent items: [
  'cafe',     'pao',
  'manteiga', 'leite',
  'cerveja',  'feijao',
  'arroz'
]

Regra: [cafe] => [pao]
   Suporte: 30.0% | Confiança: 100.0%
---
Regra: [pao] => [cafe]
   Suporte: 30.0% | Confiança: 60.0%
---
Regra: [cafe] => [manteiga]
   Suporte: 30.0% | Confiança: 100.0%
---
Regra: [manteiga] => [cafe]
   Suporte: 30.0% | Confiança: 60.0%
---
Regra: [pao] => [manteiga]
   Suporte: 40.0% | Confiança: 80.0%
---
Regra: [manteiga] => [pao]
   Suporte: 40.0% | Confiança: 80.0%
---
Regra: [pao] => [leite]
   Suporte: 20.0% | Confiança: 40.0%
---
Regra: [leite] => [pao]
   Suporte: 20.0% | Confiança: 100.0%
---
Regra: [manteiga] => [leite]
   Suporte: 20.0% | Confiança: 40.0%
---
Regra: [leite] => [manteiga]
   Suporte: 20.0% | Confiança: 100.0%
---
```

## Interpretação dos Resultados

### Regra Forte: [cafe] => [pao]

- **Suporte**: 30% - Em 30% das transações, café e pão aparecem juntos
- **Confiança**: 100% - Todos os clientes que compram café também compram pão

### Aplicação Prática

Esta informação pode ser usada para:

- Posicionar café e pão próximos na loja
- Criar promoções combinadas
- Sistemas de recomendação: "Clientes que compraram café também compraram..."

## Funcionamento Interno

### Passo 1: Identificação de Itens Frequentes

O algoritmo varre a base de dados contando a ocorrência individual de cada item e aplica o filtro de suporte mínimo:

```javascript
allItems.forEach( item => {
  const count = data.filter( t => t.items.includes(item) ).length;
  const support = count / totalTransactions;
  
  if(support >= MIN_SUPPORT){
    frequentItems.push(item);
  }
});
```

### Passo 2: Geração de Pares e Regras

Com os itens frequentes, gera combinações em pares, verifica o suporte conjunto e calcula a confiança em ambas as direções (A → B e B → A):

```javascript
candidatePairs.forEach( pair => {
  const [itemA, itemB] = pair;
  const countAB = data.filter(t => transactionsContain(t, pair)).length;
  const supportAB = countAB / totalTransactions;

  if(supportAB >= MIN_SUPPORT){
    const confidenceAtoB = countAB / itemCount[itemA];
    if(confidenceAtoB >= MIN_CONFIDENCE){
      printRule(itemA, itemB, supportAB, confidenceAtoB);
    }
  }
});
```

## Customização

Para testar com seus próprios dados:

1. Edite o arquivo [data.json](data.json) com suas transações
2. Ajuste os limiares em [apriori.js](apriori.js) se necessário:

   ```javascript
   const MIN_SUPPORT = 0.2;      // Ajuste conforme necessário
   const MIN_CONFIDENCE = 0.3;   // Ajuste conforme necessário
   ```

3. Execute: `node apriori.js`

## Conclusão

A implementação demonstrou com sucesso a aplicação prática dos conceitos de Mineração de Dados. O uso do algoritmo Apriori permitiu filtrar eficientemente o espaço de busca, focando apenas nos padrões estatisticamente relevantes.

### Aplicações Reais

- Recomendação de produtos
- Otimização de inventário
- Layout de lojas
- Campanhas de marketing direcionadas
- Análise de cestas de mercado

---

**Desenvolvido por:** Andrey Gomes da Silva Nascimento | Gabriel Nascimento Miranda dos Santos
**Desenvolvido para:** Banco de Dados II  
**Tecnologias:** Node.js, JavaScript
