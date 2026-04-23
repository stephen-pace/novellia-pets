import type { SelectOption } from "../../design-system/Picker";
import type { AllergyRecord, Reaction } from "../../types";

export const severityLabels = {
  mild: "Mild",
  severe: "Severe",
} satisfies Record<AllergyRecord["severity"], string>;

export const severityOptions = [
  { label: "Mild", value: "mild" },
  { label: "Severe", value: "severe" },
] satisfies SelectOption<AllergyRecord["severity"]>[];

export const reactionOptions = [
  { label: "Hives", value: "hives" },
  { label: "Rash", value: "rash" },
  { label: "Swelling", value: "swelling" },
  { label: "Vomiting", value: "vomiting" },
] satisfies SelectOption<Reaction>[];

export const reactionLabels = {
  hives: "Hives",
  rash: "Rash",
  swelling: "Swelling",
  vomiting: "Vomiting",
} satisfies Record<Reaction, string>;
