export const dateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const formatStringToDate = (dateStr: string) => {
  try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
      });
  } catch {
      // Silently catch any errors and return original string
      return dateStr;
  }
};
