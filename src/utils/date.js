import { format, formatDistanceToNow, isToday, isTomorrow, addDays } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return "Today";
  } else if (isTomorrow(dateObj)) {
    return "Tomorrow";
  } else {
    return format(dateObj, "MMM dd");
  }
};

export const formatDateTime = (date) => {
  if (!date) return "";
  return format(new Date(date), "MMM dd, yyyy 'at' h:mm a");
};

export const formatRelativeTime = (date) => {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

export const getDaysUntilDue = (date) => {
  if (!date) return null;
  const today = new Date();
  const dueDate = new Date(date);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getPriorityFromDueDate = (date) => {
  const days = getDaysUntilDue(date);
  if (days < 0) return "overdue";
  if (days <= 1) return "high";
  if (days <= 3) return "medium";
  return "low";
};