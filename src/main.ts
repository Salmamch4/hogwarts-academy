
import type {
  Spell,
  AcademyEvent,
  HousePoints,
  SpellCategory,
  SpellOutput,
  ArrayElement,
  NewWizard,
  WizardSummary,
  WizardUpdate,
  AttackSpell,
  NonHealingCategory
} from "./types";

import { WizardRepository, SpellRepository } from "./repository";
import { AcademyService } from "./academy-service";
import { isWizard } from "./validators";

const wizards = new WizardRepository();
const spells = new SpellRepository();

const academy = new AcademyService(wizards, spells);


console.log("\n--- Exercice 1: Create wizards ---");

const harryData: NewWizard = {
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
  patronus: "Stag"
};

const harry = wizards.createWizard(harryData);

wizards.createWizard({
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 8,
  active: true
});

wizards.createWizard({
  name: "Draco Malfoy",
  house: "Slytherin",
  level: 6,
  active: true
});

console.log("Created wizard:", harry);
console.log("All wizards:", wizards.getAll());



console.log("\n--- Exercice 2: Find by house ---");
console.log(academy.findByHouse("Gryffindor"));



const expelliarmus: Spell = {
  id: 101,
  name: "Expelliarmus",
  category: "attack",
  power: 80
};

const protego: Spell = {
  id: 102,
  name: "Protego",
  category: "defense",
  power: 60
};

spells.add(expelliarmus);
spells.add(protego);



console.log("\n--- Exercice 3: Spell-cast events ---");

const events: AcademyEvent[] = [
  {
    type: "spell-cast",
    wizardId: harry.id,
    spellName: "Lumos"
  },
  {
    type: "level-up",
    wizardId: 2,
    newLevel: 9
  },
  {
    type: "wizard-expelled",
    wizardId: 3
  }
];

console.log(academy.getSpellEvents(events));



console.log("\n--- Exercice 4: Validate spell power ---");

try {
  spells.add({
    id: 103,
    name: "Invalid Spell",
    category: "attack",
    power: -10
  });
} catch (error: unknown) {
  console.log(
    "Expected error:",
    error instanceof Error ? error.message : error
  );
}

console.log("Stored spells:", spells.getAll());



console.log("\n--- Cast a spell ---");
console.log(academy.castSpell(harry.id, expelliarmus.id));



console.log("\n--- Update a wizard ---");

academy.updateWizard(harry.id, { level: 6 });
console.log(wizards.findById(harry.id));


console.log("\n--- Exercice 5: Method cache ---");

console.log("First call:", academy.getWizardName(harry.id));
console.log("Second call:", academy.getWizardName(harry.id));



console.log("\n--- Exercice 6: Type Guard ---");

const unknownWizard: unknown = wizards.findById(harry.id);

if (isWizard(unknownWizard)) {
  console.log(
    `${unknownWizard.name} belongs to ${unknownWizard.house}`
  );
}

const invalidWizard: unknown = {
  id: 99,
  name: "Unknown Student",
  house: "Durmstrang",
  level: 2,
  active: true
};

console.log("Invalid wizard accepted?", isWizard(invalidWizard));


console.log("\n--- Record utility type ---");

const points: HousePoints = {
  Gryffindor: 100,
  Slytherin: 80,
  Ravenclaw: 90,
  Hufflepuff: 70
};

console.log(points);


type CastArguments = Parameters<AcademyService["castSpell"]>;
type CastResult = ReturnType<AcademyService["castSpell"]>;

type AttackOutput = SpellOutput<"attack">;
type HealingOutput = SpellOutput<"healing">;

type SpellItem = ArrayElement<Spell[]>;
type AttackSpellExample = AttackSpell;
type RemainingCategories = NonHealingCategory;
type CategoryExample = SpellCategory;

const typeExamples: [
  CastArguments,
  CastResult,
  AttackOutput,
  HealingOutput,
  SpellItem,
  AttackSpellExample,
  RemainingCategories,
  CategoryExample
] | null = null;

void typeExamples;
void (null as WizardSummary | null);
void (null as WizardUpdate | null);
