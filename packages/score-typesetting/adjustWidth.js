import { Map } from 'immutable';
import { Type, DrawType } from 'score-config/constValue';

export const getMarginNum = (rowData) => {
  // 5种空隙数量，如果要首尾对齐bar是-2,下面会单独处理开始和结束
  const marginNum = {
    bar: -2,
    outer: 0,
    inner: 0,
    dot: 0,
    longDurationLine: 0,
  };

  // 数一下各个空隙的数量 去掉bar
  rowData
    .filter(data => data.getIn(['originData', 'drawType']) === DrawType.NOTE)
    .forEach((data) => {
      const originData = data.get('originData');
      // return data.svgObj;
      // 不计算group end的移动距离.
      if (originData.get('isGroupStartNote')) {
        // 移动到组第一音符位置
        if (originData.get('isBarStartNote')) {
          marginNum.bar += 1;
        } else {
          marginNum.outer += 1;
        }
      } else {
        // 移动到组内下一个
        marginNum.inner += 1;
      }
      // TODO: 算法好像从逻辑上不对，最后一个元素没有后面的刚好第一个有，数量上对上了
      if (originData.get('isBarEndNote')) {
        // 移动到小节线
        marginNum.bar += 1;
      }
      if (originData.get('dot')) {
        marginNum.dot += 1;
      }
      if (originData.get('longDurationLine')) {
        marginNum.longDurationLine += originData.get('longDurationLine');
      }
    });
  return marginNum;
};

export const getScaleNum = (rowData, styles, marginNum) => {
  // 换行后和rowWidth的差，可为负
  const difference = styles.stageWidth - rowData.baseWidth;
  // 两种情况一种是多出的距离足够让bar和outer都减少大于1，一种是只要bar或outer的几个位移1px就可以
  const scaleNum = {
    bar: 0,
    outer: 0,
    inner: 0,
  };
  // 默认diffrence比所有空隙都差1px的和大
  // 基本上不会整好
  if (difference !== 0) {
    // 需要位移大于1px
    let firstScaleNum = difference / marginNum.bar;
    let absFirstScale = Math.abs(firstScaleNum);
    // 只缩放bar
    if (absFirstScale >= 1 && absFirstScale <= styles.lineElementMarginHorizental.barScaleBase) {
      scaleNum.bar = firstScaleNum;
    } else {
      firstScaleNum = difference / (marginNum.bar + marginNum.outer + marginNum.longDurationLine);
      absFirstScale = Math.abs(firstScaleNum);
      if (absFirstScale >= 1 && absFirstScale < styles.lineElementMarginHorizental.barScaleBase * 2) {
        // 只缩放bar和outer
        scaleNum.bar = firstScaleNum;
        scaleNum.outer = firstScaleNum;
      } else {
        // 3个都需要放,按照1:8的比例 暂时bar和outer缩放数值一样
        scaleNum.bar = (difference * (8 / 9)) / (marginNum.bar + marginNum.outer + marginNum.longDurationLine);
        scaleNum.outer = scaleNum.bar;
        scaleNum.inner = (difference * (1 / 9)) / (marginNum.inner + marginNum.dot);
      }
    }
  }

  return scaleNum;
};

export const makeFullWidthRow = (rowData, styles, {
  scaleNum = {
    bar: 0,
    outer: 0,
    inner: 0,
  },
  onlyAdjust = false,
}) => {
  let barStartFeatureArray = [];
  // 画笔位置
  let penX = 0;
  // 遍历一行生成调整距离为rowWidth的数组
  let fullWidthRowData = rowData.map((data, itemIndex) => {
    const originData = data.get('originData');
    let svgData = data.get('svgData');
    const drawType = originData.get('drawType');
    const type = originData.get('type');
    if (type === Type.BAR_START_FEATURE) {
      barStartFeatureArray.push({
        itemIndex,
        data,
      });
      return data;
    }

    // 不计算group end的移动距离.
    if (drawType === DrawType.BARLINE) {
      const isRowLast = originData.get('isRowLast');
      // 移动到小节线
      if (isRowLast) {
        // 最后一个barMargin不缩放
        penX += styles.lineElementMarginHorizental.bar;
      } else {
        penX += styles.lineElementMarginHorizental.bar + scaleNum.bar;
      }
      // if (itemIndex === rowData.size - 1 && !onlyAdjust) {
      //   // 设置最后一个barline的svg x，最后一个可能有小数点后几万位误差，直接取宽度
      //   svgData = svgData.set('x', styles.stageWidth - svgData.width);
      // } else {
      // 直线落在整数里;
      svgData = svgData.set('x', Math.round(penX));
      // 画笔到barline后
      penX += svgData.width;
      // }
      // 设置小节结束标记，在多行模式下对齐最大行也有相应逻辑
      let presentFeatureData = barStartFeatureArray[barStartFeatureArray.length - 1];
      presentFeatureData.data = presentFeatureData.data.update('originData', featureData => featureData.merge(Map({ barEndX: penX })));

      return Map({
        originData,
        svgData,
      });
    }

    if (drawType === DrawType.NOTE) {
      const isGroupStartNote = originData.get('isGroupStartNote');
      const isBarStartNote = originData.get('isBarStartNote');
      const isRowFirst = originData.get('isRowFirst');
      const dot = originData.get('dot');
      const longDurationLine = originData.get('longDurationLine');
      // 音符位置计算
      if (isGroupStartNote) {
        // 移动到组第一音符位置,要是一个bar的距离要么一个outer的距离
        if (isBarStartNote) {
          if (isRowFirst) {
          // 第一个barMargin不缩放
            penX += styles.lineElementMarginHorizental.bar;
          } else {
            penX += styles.lineElementMarginHorizental.bar + scaleNum.bar;
          }
          // 设置小节开始
          let presentFeatureData = barStartFeatureArray[barStartFeatureArray.length - 1];
          presentFeatureData.data = presentFeatureData.data.update('originData', featureData => featureData.merge(Map({ barStartX: penX })));
        } else {
          penX += styles.lineElementMarginHorizental.noteOuter + scaleNum.outer;
        }
      } else {
        // 移动到组内下一个
        penX += styles.lineElementMarginHorizental.noteInner + scaleNum.inner;
      }

      svgData = svgData.set('x', penX);
      // svgData = svgData.set('y', ((styles.lineHeight - svgData.getIn(['noteCenter', 'height'])) / 2 - svgData.getIn(['noteCenter', 'y'])));

      // 移动一个svg的距离
      // todo： 这里好像有问题 wholeGroup 本来就是最大宽度
      // if (elements[id].wordsGroup) {
      // const maxWidthWordsLine = Math.max(...elements[id].wordsGroup.map((wordSvg) => wordSvg.getBBox().width));
      // penX += Math.max(elements[id].noteGroup.getBBox().width, maxWidthWordsLine);
      // } else {
      penX += svgData.get('width');
      // }
      // 画附点
      // 画附点 TODO 好像画的不对圆点位置
      if (dot) {
        const moveWidth = styles.lineElementMarginHorizental.noteInner + scaleNum.inner;
        const circleX = svgData.get('width') + moveWidth;
        const circleY = svgData.noteCenter.y + ((svgData.noteCenter.height - styles.dot.r) / 2);

        svgData = svgData.setIn(['dot', 'x'], circleX);
        svgData = svgData.setIn(['dot', 'y'], circleY);

        penX += moveWidth + (styles.dot.r * 2);
      }
      // 画长时值
      if (longDurationLine) {
        const moveWidth = styles.lineElementMarginHorizental.noteOuter + scaleNum.outer;

        // line.lineStyle(styles.durationLine.height, styles.noteStyle.fill);
        // 初始到第一个位置
        const lineX = svgData.get('width') + moveWidth;
        // const lineY = svgData.noteCenter.y + ((svgData.noteCenter.height - styles.durationLine.height) / 2);
        let lineMoveTo = 0;
        for (let i = 0; i < longDurationLine; i++) {
          const LineTo = lineMoveTo + styles.durationLine.width;
          // 减一
          svgData = svgData.setIn(['longDurationLine', i, 'x'], lineX + lineMoveTo);
          // svgData = svgData.setIn(['longDurationLine', i, 'y'], lineY);
          // 处理1px移动
          lineMoveTo = LineTo + moveWidth;
        }
        penX += ((moveWidth + styles.durationLine.width) * longDurationLine);
      }

      return Map({
        originData,
        svgData,
      });
    }
    return data;
  });

  barStartFeatureArray.forEach((featureData) => {
    fullWidthRowData = fullWidthRowData.splice(featureData.itemIndex, 1, featureData.data);
  });


  return fullWidthRowData;
};

export const adjustOneLine = (rowData, styles) => makeFullWidthRow(
  rowData,
  styles,
  {
    scaleNum: getScaleNum(rowData, styles, getMarginNum(rowData)),
  },

);

// 调整宽度的同时顺带把附点和大于2的线画出来,返回每一行画布数据和原始数据的数组，同时加入note的x，y单行坐标
export default function (scoreRowArray, styles) {
  return scoreRowArray.map((rowData, index) => {
    console.log(index, scoreRowArray.size - 1);
    if (index === scoreRowArray.size - 1) {
      return makeFullWidthRow(rowData, styles, { onlyAdjust: true });
    }
    return adjustOneLine(rowData, styles);
  });
}
