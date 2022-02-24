import { List } from 'immutable';
import { DrawType, Type } from 'score-config/constValue';

// 换一行，剩一部分
export const breakOneLine = (renderScoreData, styles) => {
  // 画笔位置
  const stageWidth = styles.stageWidth;
  let penX = 0;
  // barline的index，可以在换行时找到前一个barline的index
  const barlineIndexList = [];
  // 上次换行位置 ? 为什么是
  const lastBreakIndex = 0;
  // 只移动画笔计算换行距离, 每次移动到当前svg后面
  for (let index = 0; index < renderScoreData.size; index++) {
    const data = renderScoreData.get(index);
    const originData = data.get('originData');
    const svgData = data.get('svgData');

    if (originData.get('drawType') === DrawType.BARLINE) {
      // 移动到小节线左边
      penX += styles.lineElementMarginHorizental.bar;
      // 这个地方放下面也行，记录每个barline的数组index
      barlineIndexList.push({ index, penX });
      // 小节线超出stage
      if ((penX + svgData.get('width')) > stageWidth) {
        // 前一小结差一点超过，这一小节超过很多，这一小节换行，前一小节拉伸至一整行
        if ((penX + svgData.get('width')) - stageWidth > (stageWidth / 20) && barlineIndexList.length > 1) {
          const prevBarlineIndex = barlineIndexList[barlineIndexList.length - 2].index;
          index = prevBarlineIndex;
          penX = barlineIndexList[barlineIndexList.length - 2].penX;
        }
        // 如果没有进入if有两种情况
        // 1.这种情况几乎不能存在，只有当前barline元素，当前小节独占一行 barlineIndexList.length === 1
        // 2.超过的不是很多，压缩至一整行
        // 这里合并了两种情况，逻辑一致
        let rowData = renderScoreData.slice(lastBreakIndex, index + 1);
        rowData = rowData.setIn([1, 'originData', 'isRowFirst'], true);
        rowData = rowData.setIn([rowData.size - 1, 'originData', 'isRowLast'], true);
        // 记录当前行最末处坐标
        rowData.baseWidth = penX + svgData.width;
        // 超过阈值，但是刚好是最后一个
        if (index === renderScoreData.size - 1) {
          return { rowData, leftScoreData: null };
        }
        return { rowData, leftScoreData: renderScoreData.skip(index + 1) };
      }
      // 没有到达最后一个小节，画笔继续移动
      penX += svgData.width;
    } else if (originData.get('drawType') === DrawType.NOTE) {
      // let noteSvg;
      // if (originData.get('type') === Type.SYMBOL) {
      //   noteSvg = elements[originData.get('id')].main;
      // } else {
      //   noteSvg = elements[originData.get('id')].noteGroup;
      // }
      // 不计算group end的移动距离.
      if (originData.get('isGroupStartNote')) {
        if (originData.get('isBarStartNote')) {
          // 移动到组第一音符位置
          penX += styles.lineElementMarginHorizental.bar;
        } else {
          // 正常移动到下一组
          penX += styles.lineElementMarginHorizental.noteOuter;
        }
      } else {
        // 移动到组内下一个
        penX += styles.lineElementMarginHorizental.noteInner;
      }
      // 如果有词可能是多列的，算出最宽的一个
      // if (elements[originData.get('id')].wordsGroup) {
      // const maxWidthWordsLine = Math.max(
      //    ...elements[originData.get('id')].wordsGroup.map(wordSvg => wordSvg.getBBox().width)
      //  );
      //  // 移动带歌词的宽度
      // penX += Math.max(elements[originData.get('id')].noteGroup.getBBox().width, maxWidthWordsLine);
      // } else {
      // 移动一个音符的宽度
      penX += svgData.get('width');
      // }
      // 移动附点
      if (originData.get('dot')) {
        penX += styles.lineElementMarginHorizental.noteInner + (styles.dot.r * 2);
      }
      // 空出长线距离
      if (originData.get('longDurationLine')) {
        penX
           += (styles.lineElementMarginHorizental.noteOuter + styles.durationLine.width)
           * originData.get('longDurationLine');
      }
    }
    // 宽度没到阈值，但是是最后一个
    if (index === renderScoreData.size - 1) {
      let rowData = renderScoreData.slice(lastBreakIndex);
      rowData = rowData.setIn([1, 'originData', 'isRowFirst'], true);
      rowData = rowData.setIn([rowData.size - 1, 'originData', 'isRowLast'], true);
      rowData.baseWidth = penX;
      console.log(rowData.baseWidth);
      return { rowData, leftScoreData: null };
    }
  }
};
// 全部换行
export default function (renderScore, styles) {
  const getBreakRowList = (letfRenderScoreData, breakedRowList = new List()) => {
    const { rowData, leftScoreData } = breakOneLine(letfRenderScoreData, styles);

    breakedRowList = breakedRowList.push(rowData);
    if (leftScoreData) {
      return getBreakRowList(leftScoreData, breakedRowList);
    }
    return breakedRowList;
  };

  return getBreakRowList(renderScore);
}
