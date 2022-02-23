import { Record, List } from 'immutable';
import styles from './initStyles';

const normalParams = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

export const paramsItemRecord = Record(normalParams);

const paramsRecord = Record({
  cursor: null,
  scoreLine: null,
});

const cursorParams = Record({
  ...normalParams,
  partIndex: 0,
  lineIndex: 0,
  elementIndex: -1,
});

class CouputedParams extends paramsRecord {

}

export default new CouputedParams({
  cursor: new cursorParams({
    x: styles.paddingHorizontal,
    y: styles.firstLineOffsetTop,
  }),
  // 行坐标位置
  scoreLine: List(),
});
