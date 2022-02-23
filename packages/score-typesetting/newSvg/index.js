import { Map } from 'immutable';
import { DrawType, Type } from 'score-config/constValue';
import drawNote from './drawNote';
import drawBar from './drawBar';
import drawBarStart from './drawBarStart';

export const newSvg = (data, styles) => {
  if (data.get('type') === Type.BAR_START_FEATURE) {
    return drawBarStart(data, styles);
  }

  switch (data.get('drawType')) {
  case DrawType.BARLINE: {
    return drawBar(data, styles);
  }
  case DrawType.SYMBOL:
  case DrawType.NOTE: {
    return drawNote(data, styles);
  }
  default: {
    console.info('no drawType');
    return Map({ originData: data });
  }
  }
};
export default function (renderArray, styles) {
  return renderArray.map(data => newSvg(data, styles));
}
