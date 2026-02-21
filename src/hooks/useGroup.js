import { useGroups } from './useGroups';

export const useGroup = (groupId) => {
  const { groups, ...actions } = useGroups();
  const group = groups.find((g) => g.id === groupId) ?? null;
  return { group, ...actions };
};
