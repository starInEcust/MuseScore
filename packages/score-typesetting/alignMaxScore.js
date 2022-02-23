import { List, Map } from 'immutable';
import { Type, DrawType } from 'score-config/constValue';
import { makeFullWidthRow } from './adjustWidth';
import { chunkScoreWithBarline } from './chunkScore';

// 可能要type note只和note 对齐， 比如括号要push到max里 但没有括号的行不参与对齐
// TODO: 有括号的逻辑没写
export default function alignOneLine(currentScoreLine, maxWidthScoreLine, styles) {
  const chunkedCurrentScore = chunkScoreWithBarline(currentScoreLine);
  const chunkedMaxScore = chunkScoreWithBarline(maxWidthScoreLine);

  let newCurrentScore = List([]);
  for (let x = 0; x < chunkedMaxScore.size; x++) {
    let oneMaxBarScore = chunkedMaxScore.get(x);
    let oneCurrentBarScore = chunkedCurrentScore.get(x);
    if (oneCurrentBarScore.getIn([0, 'originData', 'isBarDurationStandard'])) {
      let mx = 0;
      for (let i = 1; i < oneCurrentBarScore.size; i++) {
        for (; mx < oneMaxBarScore.size; mx++) {
          // 跳过startfeature
          if (oneMaxBarScore.getIn([mx, 'originData', 'type']) === Type.BAR_START_FEATURE) {
            continue;
          }
          if (
            oneMaxBarScore.getIn([mx, 'originData', 'alignIds']).some(id =>
              id === oneCurrentBarScore.getIn([i, 'originData', 'id']),
            )
          ) {
            oneCurrentBarScore = oneCurrentBarScore.updateIn(
              [i, 'svgData'],
              svgData => svgData.merge(Map({
                // 行内左侧x坐标加偏移
                x: oneMaxBarScore.getIn([mx, 'svgData', 'x']),
              })),
            );
            if (
              oneMaxBarScore.getIn([mx, 'originData', 'noteDurationType']) === oneCurrentBarScore.getIn([i, 'originData', 'noteDurationType'])
            ) {
              // 一样的带附加的音符对齐
              if (
                oneMaxBarScore.getIn([mx, 'originData', 'dot'])
                && oneCurrentBarScore.getIn([i, 'originData', 'dot'])
              ) {
                oneCurrentBarScore = oneCurrentBarScore.updateIn(
                  [i, 'svgData', 'dot'],
                  dot => dot.merge(Map({
                    // 行内左侧x坐标加偏移
                    x: oneMaxBarScore.getIn([mx, 'svgData', 'dot', 'x']),
                  })),
                );
              } else if (
                oneMaxBarScore.getIn([mx, 'originData', 'longDurationLine'])
                && oneCurrentBarScore.getIn([i, 'originData', 'longDurationLine'])
              ) {
                oneCurrentBarScore = oneCurrentBarScore.updateIn(
                  [i, 'svgData', 'longDurationLine'],
                  longDurationLine => longDurationLine.map((lineSvgData, index) => lineSvgData.merge(Map({
                    // 行内左侧x坐标加偏移
                    x: oneMaxBarScore.getIn([mx, 'svgData', 'longDurationLine', index, 'x']),
                  }))),
                );
              }
            }
            break;
          }
        }
      }
      oneCurrentBarScore = oneCurrentBarScore.updateIn(
        [0, 'originData'], data => data.merge(Map({
          barStartX: oneMaxBarScore.getIn([1, 'svgData', 'x']),
          barEndX: oneMaxBarScore.getIn([oneMaxBarScore.size - 1, 'svgData', 'x']),
        })),
      );
      newCurrentScore = newCurrentScore.push(oneCurrentBarScore);
    } else {
      oneCurrentBarScore = makeFullWidthRow(oneCurrentBarScore, styles, { onlyAdjust: true });
      oneCurrentBarScore = oneCurrentBarScore.updateIn(
        [0, 'originData'], data => data.merge(Map({
          barStartX: oneMaxBarScore.getIn([1, 'svgData', 'x']),
          barEndX: oneMaxBarScore.getIn([oneMaxBarScore.size - 1, 'svgData', 'x']),
        })),
      );
      oneCurrentBarScore = oneCurrentBarScore.updateIn(
        [0, 'originData'], data => data.merge(Map({
          unStandardBarData: oneCurrentBarScore,
        })),
      );

      newCurrentScore = newCurrentScore.push(oneCurrentBarScore);
    }
  }

  return (newCurrentScore.flatten(true));

  // let mx = 0;
  // let isBarDurationStandard = true;
  // let notFullListData = {};
  // let notFullListDataPresentKey = null;
  // // debugger;
  // for (let cx = 0; cx < currentScoreLine.size; cx++) {
  //   if (currentScoreLine.getIn([cx, 'originData', 'type']) === Type.BAR_START_FEATURE) {
  //     isBarDurationStandard = currentScoreLine.getIn([cx, 'originData', 'isBarDurationStandard']);
  //     if (!isBarDurationStandard) {
  //       // 不是标准小节，加入一个空数组
  //       notFullListDataPresentKey = cx;
  //       notFullListData[cx] = [currentScoreLine.get(cx)];
  //     }
  //     continue;
  //   }
  //   if (isBarDurationStandard) {
  //     for (; mx < maxWidthScoreLine.size; mx++) {
  //       // 跳过startfeature
  //       if (maxWidthScoreLine.getIn([mx, 'originData', 'type']) === Type.BAR_START_FEATURE) {
  //         continue;
  //       }
  //       if (
  //         maxWidthScoreLine.getIn([mx, 'originData', 'alignIds']).some(id =>
  //           id === currentScoreLine.getIn([cx, 'originData', 'id']),
  //         )
  //       ) {
  //         currentScoreLine = currentScoreLine.updateIn(
  //           [cx, 'svgData'],
  //           svgData => svgData.merge(Map({
  //             // 行内左侧x坐标加偏移
  //             x: maxWidthScoreLine.getIn([mx, 'svgData', 'x']),
  //           })),
  //         );
  //         if (
  //           maxWidthScoreLine.getIn([mx, 'originData', 'noteDurationType']) === currentScoreLine.getIn([cx, 'originData', 'noteDurationType'])
  //         ) {
  //           // 一样的带附加的音符对齐
  //           if (
  //             maxWidthScoreLine.getIn([mx, 'originData', 'dot'])
  //             && currentScoreLine.getIn([cx, 'originData', 'dot'])
  //           ) {
  //             currentScoreLine = currentScoreLine.updateIn(
  //               [cx, 'svgData', 'dot'],
  //               dot => dot.merge(Map({
  //                 // 行内左侧x坐标加偏移
  //                 x: maxWidthScoreLine.getIn([mx, 'svgData', 'dot', 'x']),
  //               })),
  //             );
  //           } else if (
  //             maxWidthScoreLine.getIn([mx, 'originData', 'longDurationLine'])
  //             && currentScoreLine.getIn([cx, 'originData', 'longDurationLine'])
  //           ) {
  //             currentScoreLine = currentScoreLine.updateIn(
  //               [cx, 'svgData', 'longDurationLine'],
  //               longDurationLine => longDurationLine.map((lineSvgData, index) => lineSvgData.merge(Map({
  //                 // 行内左侧x坐标加偏移
  //                 x: maxWidthScoreLine.getIn([mx, 'svgData', 'longDurationLine', index, 'x']),
  //               }))),
  //             );
  //           }
  //         }

  //         break;
  //       }
  //     }
  //   } else {
  //     notFullListData[notFullListDataPresentKey].push(currentScoreLine.get(cx));
  //   }
  // }

  // Object.keys(notFullListData).forEach((key) => {
  //   const adjustRow = makeFullWidthRow(List(notFullListData[key]), styles, {
  //     bar: 0,
  //     outer: 0,
  //     inner: 0,
  //   }, true).toArray();
  //   currentScoreLine = currentScoreLine.splice(key, adjustRow.length, ...adjustRow);
  // });

  // return currentScoreLine;
}
// maxWidthScore， scoreAllParts 是多行高维数组
export function alignAllScore(scoreAllParts, maxWidthScore, styles) {
  const lastBarlineNumList = maxWidthScore.map(array => array.reduce((prev, curr) => {
    if (curr.getIn(['originData', 'drawType']) === DrawType.BARLINE) {
      prev++;
    }
    return prev;
  }, 0));
  // 按max结束的小节数划分
  const divedScoreAllParts = scoreAllParts.map((currentScore) => {
    let divScore = List([]);
    for (let i = 0, maxScoreIndex = 0, barNum = 0, sliceStartIndex = 0; i < currentScore.size; i++) {
      if (currentScore.getIn([i, 'originData', 'drawType']) === DrawType.BARLINE) {
        if (++barNum === lastBarlineNumList.get(maxScoreIndex)) {
          divScore = divScore.push(currentScore.slice(sliceStartIndex, i + 1));
          sliceStartIndex = i + 1;
        }
      }
    }
    return divScore;
  });
  return divedScoreAllParts.map(
    (divedOnePartScore, partIndex) => divedOnePartScore.map(
      (currentScoreLine, index) => {
        if (currentScoreLine) {
          return alignOneLine(currentScoreLine, maxWidthScore.get(index), styles);
        }
      },
    ),
  );
}
