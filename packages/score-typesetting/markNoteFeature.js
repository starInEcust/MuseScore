/*
可能出现的key
{
  duration: num,
  isFirstNote: bool,
  isBarStartNote: bool,
  arcStart: object,
  isBarEndNote: bool,
  isBarEndNote: bool,
  isGroupStartNote: bool,
  isGroupEndNote: bool,
  dot: bool,
  drawType: string
}
*/
// 最小换行超出长度为 width / 5 ，否则压缩。
import { Type } from 'score-config/constValue';

export const makeNoteFeature = (data) => {
  if (data.get('type') !== Type.NOTE) {
    return data;
  }
  let newData = data;
  switch (data.get('noteDurationType')) {
  case '64th':
    newData = newData.set('underlineNum', 4);
    newData = newData.set('longDurationLine', 0);
    break;
  case '32nd':
    newData = newData.set('underlineNum', 3);
    newData = newData.set('longDurationLine', 0);
    break;
  case '16th':
    newData = newData.set('underlineNum', 2);
    newData = newData.set('longDurationLine', 0);
    break;
  case 'eighth':
    newData = newData.set('underlineNum', 1);
    newData = newData.set('longDurationLine', 0);
    break;
  case 'quarter':
    newData = newData.set('underlineNum', 0);
    newData = newData.set('longDurationLine', 0);
    break;
  case 'half':
    newData = newData.set('longDurationLine', 1);
    newData = newData.set('underlineNum', 0);
    break;
  case 'halfhalf':
    newData = newData.set('longDurationLine', 2);
    newData = newData.set('underlineNum', 0);
    break;
  case 'whole':
    newData = newData.set('longDurationLine', 3);
    newData = newData.set('underlineNum', 0);
    break;
  default:
    console.error('not match feature');
  }
  return newData;
};

const markNote = sourceScore => sourceScore.map(data => makeNoteFeature(data));

export default markNote;
