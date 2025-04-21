export const calculateTime = (timestamp) => {
  const messageTime = new Date(timestamp);
  const now = new Date();

  const isToday = messageTime.toDateString() === now.toDateString();

  // Create a "yesterday" date
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = messageTime.toDateString() === yesterday.toDateString();

  if (isToday) {
    const hour = messageTime.getHours().toString().padStart(2, "0");
    const minutes = messageTime.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minutes}`;
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    return messageTime.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};
