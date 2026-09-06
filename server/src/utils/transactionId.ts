type Gateway = "bKash" | "Nagad" | "Card";

export const generateTransactionId = (gateway: Gateway): string => {
  const prefix = {
    bKash: "BK",
    Nagad: "NG",
    Card: "CD",
  }[gateway];

  const randomNumber = Math.floor(10000 + Math.random() * 90000);

  return `TRX-${prefix}-${randomNumber}`;
};
