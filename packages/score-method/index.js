export const splitObjArray = (array, compareMethod, offset = 0) => {
  const output = [];
  return array.reduce((prev, curr, i) => {
    if (i === array.length - 1) {
      const endIndex = compareMethod(array, i)
        ? offset + (array.length - 1)
        : offset + (array.length - 2);
      output.push(array.slice(prev, endIndex));
      return output;
    }
    if (compareMethod(array, i)) {
      output.push(array.slice(prev, i + offset));
      prev = i + 1;
    }
    return prev === array.length ? output : prev;
  }, 0);
};

export const getQuerys = (url) => {
  const querys = url.slice(url.indexOf('?') + 1).split('&').reduce((prev, curr) => {
    const [key, value] = curr.split('=');
    prev[key] = value;
    return prev;
  }, {});

  return querys;
};

export function keyMirror(obj, val) {
  let ret = {};
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }

  Object.keys(obj).forEach((key) => {
    ret[key] = val ? (`${val}_${key}`) : key;
  });
  return ret;
}


const svgRectTestContainer = document.createElement('svg');
svgRectTestContainer.setAttribute('id', 'svgRectTest');

svgRectTestContainer.style.cssText = `
  position: absolute;
  width: 500px;
  height: 500px;
  left: -1000px;
  top: -1000px;
  visibility: 'hidden';
`;
document.body.appendChild(svgRectTestContainer);

export function getSvgRect(text) {
  const textElement = document.createElement('text');
  textElement.textContent = text;
  svgRectTestContainer.appendChild(textElement);
  const { width, height } = textElement.getBoundingClientRect();
  svgRectTestContainer.removeChild(textElement);
  return { width, height };
}

export function getSvgsRect(texts) {
  const textsFragment = document.createElement('g');
  const textElements = texts.map((text) => {
    const textElement = document.createElement('text');
    textElement.style.cssText = `font-size: ${text.fontSize}px`;
    textElement.textContent = text.text;
    textsFragment.appendChild(textElement);
    return textElement;
  });
  svgRectTestContainer.appendChild(textsFragment);
  const textElementsRect = textElements.map((element) => {
    const { width, height } = element.getBoundingClientRect();
    return {
      width,
      height,
    };
  });
  svgRectTestContainer.removeChild(textsFragment);
  return textElementsRect;
}
