export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', color: '#F97316' },
  { id: 'travel', label: 'Travel & Transport', color: '#3B82F6' },
  { id: 'rent', label: 'Rent & Accommodation', color: '#8B5CF6' },
  { id: 'entertainment', label: 'Entertainment', color: '#EC4899' },
  { id: 'shopping', label: 'Shopping', color: '#14B8A6' },
  { id: 'utilities', label: 'Utilities & Bills', color: '#EAB308' },
  { id: 'health', label: 'Health & Medical', color: '#EF4444' },
  { id: 'other', label: 'Other Expenses', color: '#6B7280' },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find((category) => category.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
