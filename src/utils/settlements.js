export const calculateSettlements = (people, expenses) => {
  if (!people.length || !expenses.length) return [];

  const balances = {};
  people.forEach((p) => (balances[p.id] = 0));

  expenses.forEach((expense) => {
    const { paidBy, amount, splitAmong } = expense;
    balances[paidBy] += amount;
    const share = amount / splitAmong.length;
    splitAmong.forEach((personId) => {
      balances[personId] -= share;
    });
  });

  const settlements = [];
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([id, balance]) => {
    const person = people.find((p) => p.id === id);
    if (balance > 0.01) creditors.push({ id, name: person.name, amount: balance });
    if (balance < -0.01) debtors.push({ id, name: person.name, amount: -balance });
  });

  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settledAmount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount: parseFloat(settledAmount.toFixed(2)),
    });

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return settlements;
};
