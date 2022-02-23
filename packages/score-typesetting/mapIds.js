import { Type } from 'score-config/constValue';

const initIds = {
  noteGroup: 0,
  note: 0,
  barLine: 0,
  symbol: 0,
  barStart: 0,
};

let ids = { ...initIds };

export const resetId = () => {
  ids = { ...initIds };
};

export const addId = (data, partIndex) => {
  switch (data.get('type')) {
  case Type.NOTE: {
    ids.noteGroup++;
    return data.set('id', `s-${partIndex}-${ids.noteGroup}-note`);
  }
  case Type.SYMBOL: {
    ids.symbol++;
    return data.set('id', `s-${partIndex}-${ids.symbol}-symbol`);
  }
  case Type.BARLINE: {
    ids.barLine++;
    return data.set('id', `s-${partIndex}-${ids.barLine}-barline`);
  }
  case Type.BAR_START_FEATURE: {
    ids.barStart++;
    return data.set('id', `s-${partIndex}-${ids.barStart}-bar-start`);
  }
  default: {
    console.info('no type id', data.get('type'));
    // data.id = `s-${partIndex}-${newIds.noteGroup}-note`;
    // data.drawType = DrawType.NOTE;
    // data.type = DrawType.NOTE;
    // newIds.noteGroup++;
  }
  }
  return data;
};

export default function (renderDataArray, partIndex) {
  return renderDataArray.map(data => addId(data, partIndex));
}


// 新加元素的id获取
// export const addId = drawType => ids[drawType]++;
