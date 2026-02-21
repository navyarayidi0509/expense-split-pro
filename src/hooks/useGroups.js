import { useSelector, useDispatch } from 'react-redux';
import { saveGroups } from '../services/storageServices';
import {
  addGroup,
  deleteGroup,
  addPersonToGroup,
  removePersonFromGroup,
  addExpenseToGroup,
  editExpenseInGroup,
  deleteExpenseFromGroup,
  addPaidSettlement,
} from '../store/groupsSlice';
import uuid from 'react-native-uuid';

export const useGroups = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.groups);

  const getGroup = (groupId) => groups.find((g) => g.id === groupId) ?? null;

  const updatedWith = (groupId, updater) => groups.map((g) => (g.id === groupId ? updater(g) : g));

  const persist = async (updated) => {
    await saveGroups(updated);
  };

  const createGroup = async (name) => {
    const newGroup = {
      id: uuid.v4(),
      name,
      people: [],
      expenses: [],
      paidSettlements: [],
      createdAt: new Date().toISOString(),
    };
    dispatch(addGroup(newGroup));
    await persist([...groups, newGroup]);
  };

  const removeGroup = async (groupId) => {
    dispatch(deleteGroup(groupId));
    await persist(groups.filter((g) => g.id !== groupId));
  };

  const addPerson = async (groupId, name) => {
    const person = { id: uuid.v4(), name };
    dispatch(addPersonToGroup({ groupId, person }));
    await persist(updatedWith(groupId, (g) => ({ ...g, people: [...g.people, person] })));
  };

  const removePerson = async (groupId, personId) => {
    dispatch(removePersonFromGroup({ groupId, personId }));
    await persist(
      updatedWith(groupId, (g) => ({
        ...g,
        people: g.people.filter((p) => p.id !== personId),
      }))
    );
  };

  const addExpense = async (groupId, expense) => {
    const newExpense = { ...expense, id: uuid.v4(), createdAt: new Date().toISOString() };
    dispatch(addExpenseToGroup({ groupId, expense: newExpense }));
    await persist(updatedWith(groupId, (g) => ({ ...g, expenses: [...g.expenses, newExpense] })));
  };

  const editExpense = async (groupId, expenseId, updates) => {
    dispatch(editExpenseInGroup({ groupId, expenseId, updates }));
    await persist(
      updatedWith(groupId, (g) => ({
        ...g,
        expenses: g.expenses.map((e) => (e.id === expenseId ? { ...e, ...updates } : e)),
      }))
    );
  };

  const removeExpense = async (groupId, expenseId) => {
    dispatch(deleteExpenseFromGroup({ groupId, expenseId }));
    await persist(
      updatedWith(groupId, (g) => ({
        ...g,
        expenses: g.expenses.filter((e) => e.id !== expenseId),
      }))
    );
  };

  const recordSettlementPaid = async (groupId, settlement) => {
    const newSettlement = {
      ...settlement,
      id: uuid.v4(),
      paid: true,
      paidAt: new Date().toISOString(),
    };
    dispatch(addPaidSettlement({ groupId, settlement: newSettlement }));
    await persist(
      updatedWith(groupId, (g) => ({
        ...g,
        paidSettlements: [...(g.paidSettlements || []), newSettlement],
      }))
    );
  };

  return {
    groups,
    getGroup,
    createGroup,
    removeGroup,
    addPerson,
    removePerson,
    addExpense,
    editExpense,
    removeExpense,
    recordSettlementPaid,
  };
};
