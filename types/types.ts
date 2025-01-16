export type TTimeOptions = {
  hours: number;
  minutes: number;
  seconds: number;
};

export type TOptions = TTimeOptions & { alert: boolean; version: boolean };

export type TTime = {
  h: number;
  m: number;
  s: number;
};