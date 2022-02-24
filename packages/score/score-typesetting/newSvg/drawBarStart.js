import { Map } from 'immutable';
import { MusicType } from 'score-config/constValue';
import { normalSvg } from 'score-config//Record';

export default function (data, styles) {
  return Map({
    originData: data,
    svgData: new normalSvg({
      x: 0,
      y: 0,
    }),
  });
}
