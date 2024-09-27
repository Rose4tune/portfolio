import { atom } from "recoil";
import { v1 } from "uuid";

export const IsEnteredAtom = atom({
  key: `IsEnteredAtom/${v1()}`,
  default: false,
});

export const DimensionModeAtom = atom({
  key: `DimensionModeAtom/${v1()}`,
  default: "3D",
});
