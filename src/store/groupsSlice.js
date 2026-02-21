import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups(state, action) {
      state.groups = action.payload;
    },
    addGroup(state, action) {
      state.groups.push(action.payload);
    },
    deleteGroup(state, action) {
      state.groups = state.groups.filter((g) => g.id !== action.payload);
    },
    addPersonToGroup(state, action) {
      const { groupId, person } = action.payload;
      const group = state.groups.find((g) => g.id === groupId);
      if (group) group.people.push(person);
    },
    removePersonFromGroup(state, action) {
      const { groupId, personId } = action.payload;
      const group = state.groups.find((g) => g.id === groupId);
      if (group) group.people = group.people.filter((p) => p.id !== personId);
    },
    addExpenseToGroup(state, action) {
      const { groupId, expense } = action.payload;
      const group = state.groups.find((g) => g.id === groupId);
      if (group) group.expenses.push(expense);
    },
    editExpenseInGroup(state, action) {
      const { groupId, expenseId, updates } = action.payload;
      const group = state.groups.find((g) => g.id === groupId);
      if (group) {
        const expense = group.expenses.find((e) => e.id === expenseId);
        if (expense) Object.assign(expense, updates);
      }
    },
    deleteExpenseFromGroup(state, action) {
      const { groupId, expenseId } = action.payload;
      const group = state.groups.find((g) => g.id === groupId);
      if (group) group.expenses = group.expenses.filter((e) => e.id !== expenseId);
    },
    addPaidSettlement(state, action) {
      const { groupId, settlement } = action.payload;
      const group = state.groups.find((g) => g.id === groupId);
      if (group) {
        if (!group.paidSettlements) group.paidSettlements = [];
        group.paidSettlements.push(settlement);
      }
    },
  },
});

export const {
  setGroups,
  addGroup,
  deleteGroup,
  addPersonToGroup,
  removePersonFromGroup,
  addExpenseToGroup,
  editExpenseInGroup,
  deleteExpenseFromGroup,
  addPaidSettlement,
} = groupsSlice.actions;

export default groupsSlice.reducer;