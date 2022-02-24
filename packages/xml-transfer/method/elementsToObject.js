const elementsToObject = (element, hasName) => {
  // console.log(elements, typeof elements, elements, Array.isArray(elements));
  const obj = { };

  if (hasName) {
    obj.name = element.name;
  }
  element.elements.forEach(item => {
    // obj 是item的爸爸 item大部分是note里的元素
    const valueObj = () => {
      if (item.text) {
        // 有text 说明已经到底了
        obj[item.name] = item.text;
      } else if (item.elements) {
        obj[item.name] = elementsToObject(item);
      } else {
        obj[item.name] = true;
      }
      if (item.attributes) {
        // note = {beam: begin} => note = { beam: { attr: { number: 1} , value: begin }}
        if (typeof obj[item.name] === 'object') {
          obj[item.name].attributes = item.attributes;
        } else {
          obj[item.name] = {
            attributes: item.attributes,
            value: obj[item.name],
          };
        }
      }
    };
    // note = { beam: { attr: { number: 1} , value: begin } 这是beam1} => { beam: [beam1, beam2]}
    if (['beam'].some(name => item.name === name)) {
      // 如果现在的key在生成的obj里已经有了 就把它变成数组
      let cacheValue = null;
      if (obj[item.name]) {
        cacheValue = obj[item.name];
      }

      valueObj();

      if (cacheValue) {
        cacheValue.push(obj[item.name]);
        obj[item.name] = cacheValue;
      } else {
        obj[item.name] = [obj[item.name]];
      }
    } else if (Object.keys(obj).some(name => item.name === name)) {
      const cacheValue = obj[item.name];

      valueObj();
      if (Array.isArray(cacheValue)) {
        cacheValue.push(obj[item.name]);
        obj[item.name] = cacheValue;
      } else {
        obj[item.name] = [cacheValue, obj[item.name]];
      }
    } else {
      valueObj();
    }
  });

  return obj;
};

export default elementsToObject;

