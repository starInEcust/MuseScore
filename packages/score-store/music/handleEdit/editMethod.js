import { Map } from 'immutable';
import markNote, { makeNoteFeature } from 'score-typesetting/markNoteFeature';
import mapIds, { addId } from 'score-typesetting/mapIds';
import initSvg, { newSvg } from 'score-typesetting/newSvg';
import adjustWidth, { adjustOneLine, makeFullWidthRow } from 'score-typesetting/adjustWidth';
import { sourceAllLine } from 'score-typesetting/sourceToRenderData';
import divScoreRow, { breakOneLine } from 'score-typesetting/divScoreRow';
import getMaxWidthScore from 'score-typesetting/getMaxWidthScore';
import { alignAllScore } from 'score-typesetting/alignMaxScore';
import { Mode, Type } from 'score-config/constValue';

export const reRenderScore = (state) => {
  const styles = state.get('styles');
  const { mode } = state.get('config');
  const keyAndMeter = state.get('keyAndMeter');

  const {
    partIndex,
    lineIndex,
  } = state.getIn(['params', 'cursor']);

  let newState = state;

  if (mode === Mode.SINGLE) {
    const newScores = newState.getIn(['renderedScores', partIndex]).flatten(true);
    console.log(23213123, newScores);
    const sourceData = sourceAllLine(newScores, keyAndMeter);
    const scoreRowArray = divScoreRow(sourceData, styles);

    newState = newState.setIn(['renderedScores', partIndex], adjustWidth(scoreRowArray, styles));

    // TODO：优化渲染bug太多，先不优化了
    // let newLine = newState.getIn(['renderedScores', partIndex, lineIndex]);

    // newLine = sourceAllLine(newLine, keyAndMeter);

    // const setNewScoreData = (lineData, setLineIndex) => {
    //   // 中间插入没有标记
    //   const { rowData, leftScoreData } = breakOneLine(lineData, styles);

    //   let adjustLine = null;
    //   if (!leftScoreData) {
    //     console.log(1);
    //     adjustLine = makeFullWidthRow(rowData, styles, { onlyAdjust: true });
    //   } else {
    //     console.log(2);
    //     console.log(setLineIndex, rowData.baseWidth);
    //     adjustLine = adjustOneLine(rowData, styles);
    //   }
    //   newState = newState.setIn(['renderedScores', partIndex, setLineIndex], adjustLine);

    //   if (!leftScoreData) {
    //     return;
    //   }

    //   let leftScoreAndNextLine = leftScoreData;
    //   let nextLineAfterBreak = newState.getIn(['renderedScores', partIndex, setLineIndex + 1]);

    //   if (nextLineAfterBreak) {
    //     leftScoreAndNextLine = leftScoreAndNextLine.deleteIn([leftScoreAndNextLine.size - 1, 'originData', 'isRowLast']);
    //     nextLineAfterBreak = nextLineAfterBreak.deleteIn([0, 'originData', 'isRowFirst']);

    //     leftScoreAndNextLine = leftScoreAndNextLine.concat(
    //       nextLineAfterBreak,
    //     );
    //   }

    //   setNewScoreData(
    //     leftScoreAndNextLine,
    //     setLineIndex + 1,
    //   );
    // };

    // setNewScoreData(newLine, lineIndex);
  } else {
    let newScores = newState.get('renderedScores').flatten(true);
    const maxWidth = getMaxWidthScore(newScores, keyAndMeter);
    const markMusicScores = markNote(mapIds(maxWidth, 'max'));
    const madeSvgData = initSvg(markMusicScores, styles);
    const sourceData = sourceAllLine(madeSvgData, keyAndMeter);
    const scoreRowArray = divScoreRow(sourceData, styles);
    const finalMaxWidthScore = adjustWidth(scoreRowArray, styles);

    const alignedScores = alignAllScore(
      newScores,
      finalMaxWidthScore,
      styles,
    );

    newState = newState.set('renderedScores', alignedScores);
  }

  return newState;
};
// 顺便更新了光标位置
export const changeNotes = ({
  state, notes, operation, config,
}) => {
  const styles = state.get('styles');
  const { mode } = state.get('config');
  const keyAndMeter = state.get('keyAndMeter');

  const {
    partIndex,
    lineIndex,
    elementIndex,
  } = state.getIn(['params', 'cursor']);

  let newState;

  let notesData;
  let elementInScoreIndex = elementIndex;

  if (notes) {
    notesData = notes.map(note => newSvg(makeNoteFeature(addId(note, partIndex)), styles));
  }

  let spliceParams = [];

  let deleteNum = config && config.deleteNum;

  switch (operation) {
  case 'add':
    // 添加第一个元素
    // debugger;
    // 插入前方是start 各index+1
    if (state.getIn(['renderedScores', partIndex, lineIndex, elementIndex + 1]) && state.getIn(['renderedScores', partIndex, lineIndex, elementIndex + 1, 'originData', 'type']) === Type.BAR_START_FEATURE) {
      elementInScoreIndex++;
    }
    spliceParams = [elementInScoreIndex + 1, 0, ...notesData];
    if (notesData[notesData.length - 1].getIn(['originData', 'type']) === Type.BAR_START_FEATURE) {
      elementInScoreIndex += notesData.length - 1;
    } else {
      elementInScoreIndex += notesData.length;
    }
    break;
  case 'delete':
    // debugger;
    if (state.getIn(['renderedScores', partIndex, lineIndex, elementIndex + 1]) && state.getIn(['renderedScores', partIndex, lineIndex, elementIndex + 1, 'originData', 'type']) === Type.BAR_START_FEATURE) {
      elementInScoreIndex++;
      deleteNum++;
    }
    if (state.getIn([
      'renderedScores', partIndex, lineIndex, elementIndex - 1, 'originData', 'type',
    ]) === Type.BAR_START_FEATURE) {
      elementInScoreIndex--;
    }
    // 前面一个是startFeature

    elementInScoreIndex -= deleteNum;
    spliceParams = [elementIndex, deleteNum];
    // TODO: elementInScoreIndex += notesData.length;
    break;
  case 'replace':
    console.log(elementIndex, config.deleteNum, notesData);
    spliceParams = [elementIndex, config.deleteNum, ...notesData];
    // TODO: elementInScoreIndex += notesData.length;
    break;
  // case 'changeFeature':
  //   for(let i = )
  //   elementIndex
  //   spliceParams = [elementIndex + 1, 1, noteData];
  //   break;
  default:
    break;
  }
  // 设置当前元素在整个score中的位置
  for (let i = 0; i < lineIndex; i++) {
    elementInScoreIndex += state.getIn(['renderedScores', partIndex, i]).size;
  }

  if (mode === Mode.SINGLE) {
    newState = state.updateIn(['renderedScores', partIndex, lineIndex], rowData =>
      rowData.splice(...spliceParams),
    );
  } else {
    // if (startFeature.get('unStandardBarData')) {
    //   barArray = barArray.push(startFeature.get('unStandardBarData'));
    // }
    newState = state.updateIn(['renderedScores', partIndex, lineIndex], rowData =>
      sourceAllLine(rowData.splice(...spliceParams), keyAndMeter),
    );
  }

  newState = reRenderScore(newState);

  // 元素在当前行中的位置，即减去前面整行的数值, 这里重新计算不采用原来的值为避免重新渲染后换行
  const thisPartData = newState.getIn(['renderedScores', partIndex]);
  let cursorElementLength = elementInScoreIndex;
  let i = 0;
  for (; i < thisPartData.size; i++) {
    if (cursorElementLength < thisPartData.get(i).size) {
      break;
    } else {
      cursorElementLength -= thisPartData.get(i).size;
    }
  }

  newState = newState.updateIn(['params', 'cursor'], cursorData => cursorData.merge(Map({
    partIndex,
    lineIndex: i,
    elementIndex: cursorElementLength,
  })));
  return newState;
};
