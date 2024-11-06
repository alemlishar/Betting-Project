export type AlberaturaVirtualEvent = {
  eventId: number;
  codiceDisciplina: string;
  title: string;
  subtitle: string;
  startTime: string;
  detailId: { type: "singola" | "campionato"; codicePalinsesto: string; codiceEvento: string };
  formattedTime: string;
};
