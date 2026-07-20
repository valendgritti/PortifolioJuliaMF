import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  draftCredit,
  draftGalleryImage,
  draftPair,
  draftScriptSection,
  validateEditedImage,
  validateEditedText,
} from "../tina/field-validation.js";

const lock = JSON.parse(readFileSync(path.resolve("tina/tina-lock.json"), "utf8"));
const errors = [];

const hasValue = (value) => value !== undefined && value !== null && value !== "";

const validateListDefault = (fields, values, context) => {
  for (const field of fields) {
    if (!hasValue(values?.[field.name])) errors.push(`${context}.${field.name} não possui valor inicial`);
  }
};

const validateRequiredFields = (fields, values, context) => {
  for (const field of fields) {
    const value = values?.[field.name];

    if (field.required && (!hasValue(value) || (field.list && !value.length))) {
      errors.push(`${context}.${field.name} não possui valor inicial`);
      continue;
    }

    if (field.type !== "object" || !field.fields) continue;

    if (field.list) {
      if (!field.defaultItem) errors.push(`${context}.${field.name} não possui defaultItem`);
      else validateListDefault(field.fields, field.defaultItem, `${context}.${field.name}.defaultItem`);
      if (Array.isArray(value)) value.forEach((item, index) => validateRequiredFields(field.fields, item, `${context}.${field.name}[${index}]`));
    } else if (hasValue(value)) {
      validateRequiredFields(field.fields, value, `${context}.${field.name}`);
    }
  }
};

for (const collection of lock.schema.collections) {
  for (const field of collection.fields || []) {
    if (field.type === "object" && field.list) {
      if (!field.defaultItem) errors.push(`${collection.name}.${field.name} não possui defaultItem`);
      else validateListDefault(field.fields, field.defaultItem, `${collection.name}.${field.name}.defaultItem`);
    }
  }

  for (const template of collection.templates || []) {
    const defaults = template.ui?.defaultItem;
    if (!defaults) errors.push(`${collection.name}.${template.name} não possui valores iniciais`);
    else validateRequiredFields(template.fields, defaults, `${collection.name}.${template.name}`);

    for (const field of template.fields) {
      if (field.type === "object" && field.list) {
        if (!field.defaultItem) errors.push(`${collection.name}.${template.name}.${field.name} não possui defaultItem`);
        else validateListDefault(field.fields, field.defaultItem, `${collection.name}.${template.name}.${field.name}.defaultItem`);
      }
    }
  }
}

const draftValidationCases = [
  ["informação.rotulo", validateEditedText("Informe o nome", draftPair.rotulo), draftPair.rotulo, "Categoria"],
  ["informação.valor", validateEditedText("Informe o conteúdo", draftPair.valor), draftPair.valor, "Produção"],
  ["crédito.rotulo", validateEditedText("Informe a função", draftCredit.rotulo), draftCredit.rotulo, "Direção"],
  ["crédito.valor", validateEditedText("Informe o responsável", draftCredit.valor), draftCredit.valor, "Julia Figueirôa"],
  ["galeria.arquivo", validateEditedImage("Selecione uma imagem"), draftGalleryImage.arquivo, "/imagens/exemplo.jpg"],
  ["galeria.alt", validateEditedText("Descreva a imagem", draftGalleryImage.alt, 12), draftGalleryImage.alt, "Pessoa em uma sala iluminada"],
  ["roteiro.titulo", validateEditedText("Informe o título", draftScriptSection.titulo), draftScriptSection.titulo, "Sinopse"],
  ["roteiro.texto", validateEditedText("Escreva o conteúdo", draftScriptSection.texto), draftScriptSection.texto, "Descrição da seção"],
];

for (const [context, validator, draftValue, validValue] of draftValidationCases) {
  if (typeof validator(draftValue) !== "string") errors.push(`${context} aceita o valor provisório`);
  if (validator(validValue) !== undefined) errors.push(`${context} rejeita um valor preenchido`);
}

const placeholder = path.resolve("imagens/uploads/placeholder-projeto.svg");
if (!existsSync(placeholder)) errors.push("A imagem provisória usada pelos formulários não existe");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Valores iniciais dos formulários aninhados do TinaCMS validados com sucesso.");
}
