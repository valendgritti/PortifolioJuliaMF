export const placeholderImage = "/imagens/uploads/placeholder-projeto.svg";

export const draftPair = { rotulo: "Nova informação", valor: "Preencha este campo" };
export const draftGalleryImage = {
  arquivo: placeholderImage,
  alt: "Imagem provisória que deve ser substituída antes da publicação",
};
export const draftCredit = { rotulo: "Função", valor: "Pessoa ou empresa" };
export const draftScriptSection = { titulo: "Nova seção", texto: "Escreva o conteúdo desta seção" };

export const validateEditedText = (message, draftValue, minimumLength = 1) => (value) => {
  const text = value?.trim();
  if (!text || text === draftValue || text.length < minimumLength) return message;
};

export const validateEditedImage = (message) => (value) => {
  if (!value || value === placeholderImage) return message;
};
