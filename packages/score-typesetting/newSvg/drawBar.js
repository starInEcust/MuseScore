import { Map } from 'immutable';
import { MusicType } from 'score-config/constValue';
import { normalSvg } from 'score-config//Record';

export default function (data, styles) {
  let width = null;
  let height = null;
  switch (data.get('musicType')) {
  case MusicType.END_BAR:
    width = styles.barline.endBarWidth;
    height = styles.barline.height;
    break;
  case MusicType.RETURN_START_BAR:
    width = styles.barline.returnBarWidth;
    height = styles.barline.height;
    break;
  case MusicType.RETURN_END_BAR:
    width = styles.barline.returnBarWidth;
    height = styles.barline.height;
    break;
  default:
    width = styles.barline.normalBarWidth;
    height = styles.barline.height;
  }

  return Map({
    originData: data,
    svgData: new normalSvg({
      width,
      height,
      x: 0,
      y: styles.barlineY,
    }),
  });
}
