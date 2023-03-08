export const capitalizeWordsInString = (str: string) => {
  const words = str.split(' ');
  return words.map((element) => {
    return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  }).join(" ");
};
