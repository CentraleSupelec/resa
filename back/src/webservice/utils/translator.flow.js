// @flow

export type Pro = {|
  CodPro: string,
  ValPro: string,
|};

export type RawEvent = {|
  NumEve: string,
  NomEve: string,
  TypEve: string,
  EtaEve: string,
  ComEve: string,
  PRO: Pro[],
|};

export type RawRoom = {|
  NumRes: string,
  NomRes: string,
  TypRes: string,
  NumPar: string,
  LstPar: string,
  NbrFil: string,
  NumNiv: string,
  NumOrd: string,
  PRO: Pro[],
|};
