export const getInitial = (user) =>
  (user?.name || user?.email || "U").charAt(0).toUpperCase();
