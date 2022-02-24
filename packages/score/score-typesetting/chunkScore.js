import { List } from 'immutable';
import { DrawType, Type } from 'score-config/constValue';

export default function chunkScore(score) {
  let noteList = List();
  // 除note剩余的
  let barList = List();

  let sliceStartIndex = 0;
  let loopType = score.getIn([0, 'originData', 'type']) === Type.BAR_START_FEATURE ? 'note' : 'left';

  for (let i = 0; i < score.size; i++) {
    const drawType = score.getIn([i, 'originData', 'drawType']);
    const type = score.getIn([i, 'originData', 'type']);
    if (loopType === 'note') {
      // 放入note组
      // 变换循环模式并且加入数组
      if (drawType !== DrawType.NOTE && type !== Type.BAR_START_FEATURE) {
        // 准备放入剩余组
        loopType = 'left';
        noteList = noteList.push(score.slice(sliceStartIndex, i));
        sliceStartIndex = i;
        if (i === score.size - 1) {
          barList = barList.push(score.slice(sliceStartIndex));
        }
        continue;
      }
    } else if (type === Type.BAR_START_FEATURE) {
      loopType = 'note';
      barList = barList.push(score.slice(sliceStartIndex, i));
      sliceStartIndex = i;
      if (i === score.size - 1) {
        noteList = noteList.push(score.slice(sliceStartIndex));
      }
      continue;
    }
    if (i === score.size - 1) {
      if (loopType === 'note') {
        noteList = noteList.push(score.slice(sliceStartIndex));
      } else {
        barList = barList.push(score.slice(sliceStartIndex));
      }
    }
  }
  // 分别把每一小节的note 作为一个二维数组，剩下的barline作为一个二维数组
  console.log(
    noteList,
    barList,
  );
  return { noteList, barList };
}

export function chunkScoreWithBarline(score) {
  let chunkedScore = List([]);

  for (let i = 0; i < score.size; i++) {
    const type = score.getIn([i, 'originData', 'type']);

    if (type === Type.BAR_START_FEATURE) {
      chunkedScore = chunkedScore.push(List([score.get(i)]));
    } else {
      chunkedScore = chunkedScore.update(chunkedScore.size - 1, barDataArray => barDataArray.push(score.get(i)));
    }
  }
  return chunkedScore;
}
