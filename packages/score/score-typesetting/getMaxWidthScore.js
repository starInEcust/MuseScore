import { List, Map, fromJS } from 'immutable';
import { DrawType, Type } from 'score-config/constValue';

export default function (allScores, keyAndMeter) {
  // 按小结 bar 分隔为四维数组
  const barlineGroup = allScores.map((scoreData) => {
    let barIndex = 0;
    // 一行数据reduce
    return scoreData.reduce((prev, curr, index) => {
      prev = prev.update(barIndex, data => data.push(curr));
      if (
        curr.getIn(['originData', 'drawType']) === DrawType.BARLINE
      ) {
        // 当前结构 行List[小节List[元素Map{}]]
        // 拿到当前小结数据 小节List[元素Map{}] =>
        // 一小节元素List[组Map{groupNoteIndex, addUpDuration, 一组元素List[元素Map{}]}]
        // 看起来不用分组用一小节就可以实现
        prev = prev.set(barIndex, Map({
          barNoteIndex: 0,
          addUpDuration: 0,
          isEndElement: false,
          barFeature: prev.get(barIndex).get(0),
          oneBarArray: prev.get(barIndex),
        }));
        // 新建下一个List
        if (scoreData.size - 1 !== index) {
          barIndex++;
          prev = prev.set(barIndex, List());
        }
      }
      return prev;
    }, List().push(List()));
  });

  const setProps = (targetMap, compareMap, props) => {
    props.forEach((prop) => {
      if (compareMap[prop]) {
        targetMap[prop] = compareMap[prop];
      }
    });
  };
  // 三维List不好操作，先变成原生js
  let barlineGroupJs = barlineGroup.toJS();
  console.log(barlineGroupJs);
  // return;
  // 最后的结果集
  let finalMaxWidthScore = [];

  let columnLoopSelectedNote = null;
  let columnLoopSelectedBarline = null;
  let columnLoopSelectedNoteWidth = 0;
  let columnLoopSelectedBarlineWidth = 0;

  let selectedAddUpDurtion = 0;

  // 横向小结遍历
  for (let barIndex = 0; barIndex < barlineGroupJs[0].length; barIndex++) {
    // 在这做每次纵向遍历之前的初始化工作
    // 纵向part遍历
    selectedAddUpDurtion = 0;
    // 遍历之前按第一个duration从小到大排;
    barlineGroupJs = barlineGroupJs
      .sort((partA, partB) =>
        partA[barIndex].oneBarArray[partA[barIndex].barNoteIndex].duration - partB[barIndex].oneBarArray[partB[barIndex].barNoteIndex].duration);
    for (let partIndex = 0; partIndex < barlineGroupJs.length; partIndex++) {
      const oneBarData = barlineGroupJs[partIndex][barIndex];
      // barNoteIndex addUpDuration
      const { oneBarArray, barNoteIndex, barFeature } = oneBarData;
      // TODO: 可以优化
      // 不是标准长度跳过
      if (!barFeature.originData.isBarDurationStandard) {
        if (!oneBarData.isEndElement) {
          oneBarData.barNoteIndex = oneBarArray.length - 1;
          oneBarData.isEndElement = true;
        }
      } else {
      // 小节内部元素遍历
        const originData = oneBarArray[barNoteIndex].originData;

        const svgData = oneBarArray[barNoteIndex].svgData;

        if (originData.type === Type.BAR_START_FEATURE) {
          if (partIndex === 0) {
            columnLoopSelectedNote = originData;
          }
          columnLoopSelectedNote = { ...columnLoopSelectedNote, ...originData };
          oneBarData.barNoteIndex++;
        } else if (originData.drawType === DrawType.NOTE) {
        // 小节内部元素遍历
          const prePushSelectedNote = () => {
            selectedAddUpDurtion += originData.duration - columnLoopSelectedNote.duration;
            setProps(
              columnLoopSelectedNote,
              originData,
              ['duration', 'attach', 'noteDurationType', 'dot', 'longDurationLine'],
            );
          };

          const barIndexAdd = () => {
          // 无论是否选中，index+1
            columnLoopSelectedNote.alignIds.push(originData.id);
            oneBarData.addUpDuration += originData.duration;
            oneBarData.barNoteIndex++;
          };

          if (
            !columnLoopSelectedNote
          // 这里应该没有用了，因为都选好的会被排序排到最后，没排的自然就升上来了
          // || [...Array(partIndex).keys()].every(prePartIndex =>
          //   barlineGroupJs[prePartIndex][barIndex].isEndElement,
          // )
          ) {
          // 初始化纵向遍历的第一个元素
            columnLoopSelectedNote = {
              drawType: originData.drawType,
              duration: 0,
              pitch: 0,
              octave: 0,
              // 标明其他行可与max 元素对其的id
              alignIds: [],
            };
            setProps(
              columnLoopSelectedNote,
              originData,
              ['musicType', 'type'],
            );
            prePushSelectedNote();
            barIndexAdd();
          } else if (
            oneBarData.addUpDuration <= selectedAddUpDurtion - columnLoopSelectedNote.duration
          ) {
          // 当前行小于等于已选行
          // 排序后不可能比已选的小, 但宽度和其他的可以选一下
            if (originData.duration <= columnLoopSelectedNote.duration) {
            // 选择第一个或者duration小于已选的
              prePushSelectedNote();
            }
            // TODO: 分belongpart？
            // if (
            //   oneBarData.addUpDuration < selectedAddUpDurtion - columnLoopSelectedNote.duration
            // ) {

            // } else {

            // }
            barIndexAdd();
          }
        } else if (originData.drawType === DrawType.BARLINE) {
          if (!columnLoopSelectedBarline) {
            columnLoopSelectedBarline = {
              drawType: originData.drawType,
              alignIds: [],
            };
            setProps(
              columnLoopSelectedBarline,
              originData,
              ['musicType', 'type'],
            );
          }
          // 这个地方好像所有小节应该是一样的。。。
          if (columnLoopSelectedBarlineWidth < svgData.width) {
            setProps(
              columnLoopSelectedBarline,
              originData,
              ['musicType', 'svgId', 'type'],
            );
            columnLoopSelectedBarlineWidth = svgData.width;
          }
          columnLoopSelectedBarline.alignIds.push(originData.id);
          oneBarData.isEndElement = true;
        }
      }


      if (partIndex === barlineGroupJs.length - 1) {
        partIndex = -1;

        // 所有行isEndElement，当前小节全部结束, 然后对barLine的进行选择
        if (barlineGroupJs.every(partLineData => partLineData[barIndex].isEndElement)) {
          if (selectedAddUpDurtion === 0) {
            // 最后一行还是一个没选, 丢一个全音符进去
            finalMaxWidthScore.push({
              type: 'BAR_START_FEATURE',
            });
            finalMaxWidthScore.push({
              longDurationLine: keyAndMeter.beatType - 1,
              duration: keyAndMeter.divisions * keyAndMeter.beatType,
              octave: 0,
              pitch: 0,
              drawType: DrawType.NOTE,
              type: Type.NOTE,
              alignIds: [],
            });
            finalMaxWidthScore.push({
              type: 'BARLINE',
              drawType: 'BARLINE',
              alignIds: [],
            });
          } else {
            finalMaxWidthScore.push(columnLoopSelectedBarline);
          }
          columnLoopSelectedBarline = null;
          columnLoopSelectedBarlineWidth = 0;
          // BREAK当前循环就是调到下一小节组
          break;
        } else {
          finalMaxWidthScore.push(columnLoopSelectedNote);
          columnLoopSelectedNote = null;
          columnLoopSelectedNoteWidth = 0;
        }
        // duration addUpduration 从小到大排
        // groupBy addUpduration
        const addUpdurationGroup = barlineGroupJs
          .reduce((prev, curr) => {
            if (!prev[curr[barIndex].addUpDuration]) {
              prev[curr[barIndex].addUpDuration] = [];
            }
            prev[curr[barIndex].addUpDuration].push(curr);
            return prev;
          }, {});
        barlineGroupJs = Object.keys(
          addUpdurationGroup,
        )
          .sort((a, b) => a - b)
          .map(durationGroupKey =>
            addUpdurationGroup[durationGroupKey].sort((partA, partB) =>
              partA[barIndex].oneBarArray[partA[barIndex].barNoteIndex].duration - partB[barIndex].oneBarArray[partB[barIndex].barNoteIndex].duration),
          ).reduce((prev, curr) => prev.concat(curr), []);
      }
    }
  }
  console.log(finalMaxWidthScore);
  return fromJS(finalMaxWidthScore);
}
