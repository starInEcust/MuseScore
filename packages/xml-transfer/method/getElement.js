const getElement = (xmlElement, ...names) => {
  const findOneItem = (element, nameIndex) => {
    const name = names[nameIndex];
    const list = Array.isArray(element) ? element : element.elements;
    const foundElement = list.find(item => item.name === name);
    if (nameIndex !== (names.length - 1)) {
      return findOneItem(foundElement, nameIndex + 1)
    }
    return foundElement;
  }
  return findOneItem(xmlElement, 0);
}

export default getElement;