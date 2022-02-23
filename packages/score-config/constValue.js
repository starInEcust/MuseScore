import { keyMirror } from 'score-method';

export const Mode = {
  MULTI: 'multi',
  SINGLE: 'single',
};
// 当做什么画
export const DrawType = keyMirror({
  // 小节线类型，也可能是结束
  BARLINE: null,
  // 音符类型，也可能是自定义音符
  NOTE: null,
});
// 实际上是什么,大分类
export const Type = keyMirror({
  BAR_START_FEATURE: null,
  BARLINE: null,
  // 音符类型，也可能是自定义音符
  NOTE: null,
  // 和音符一样占据空间的符号，但不是音符，如小括号
  SYMBOL: null,
});
// 是结束符，但是可能是反复结束符，也可能是其他结束符号，具体细分
export const MusicType = keyMirror({
  ACCOMP_MARKER_START: null,
  ACCOMP_MARKER_END: null,
  ACCOMP_NOTE: null,
  RETURN_START_BAR: null,
  RETURN_END_BAR: null,
  END_BAR: null,
});

export const NoteDurationType = [
  // '1024th',
  // '512th',
  // '256th',
  // '128th',
  '64th',
  '32nd',
  '16th',
  'eighth',
  'quarter',
  'half',
  'halfhalf',
  'whole',
];

export const keys = [
  'Cb',
  'C',
  'D',
  'G',
  'A',
  'E',
  'B',
  'F#',
  'C#',
  'F',
  'Bb',
  'Eb',
  'Ab',
  'Db',
  'Gb',
];

export const meters = [
  '1/4',
  '2/4',
  '3/4',
  '4/4',
  '1/8',
  '3/8',
  '7/8',
];

export const AttachType = keyMirror({
  SHARP: null,
  FLAT: null,
  EMBELLISHING_NOTE: null,
});
