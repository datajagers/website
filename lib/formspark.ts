// Formspark-configuratie (besluit Wouter 2026-09-02: Formspark i.p.v. mailto).
//
// Vul hier het form-ID in uit het Formspark-dashboard — het deel achter
// https://submit-form.com/ bij je formulier. Het ID is publiek (staat sowieso
// in de client-bundel), dus het mag gewoon in de code.
//
// Zolang dit leeg is valt het contactformulier terug op de mailto-flow,
// zodat de site in de tussentijd blijft werken.
export const FORMSPARK_FORM_ID = "npnD5QsQn";

export const FORMSPARK_URL = (id: string) => `https://submit-form.com/${id}`;
