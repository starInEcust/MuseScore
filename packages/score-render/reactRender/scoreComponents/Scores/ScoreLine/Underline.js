import React from 'react';
import { Type } from 'score-config/constValue';
// TODO 改为原来的group beam 没有8分支1
export default class ScoreLine extends React.Component {
  render() {
    const {
      lineData,
      styles,
      onlyRenderMainLine,
    } = this.props;

    const lineNumPathMap = {};
    let thisBarFeature = null;

    for (let i = 0; i < lineData.size; i++) {
      const item = lineData.get(i);
      const originData = item.get('originData');
      const type = originData.get('type');
      const svgData = item.get('svgData');
      const underlineNum = originData.get('underlineNum');
      const isGroupStartNote = originData.get('isGroupStartNote');

      if (type === Type.BAR_START_FEATURE) {
        thisBarFeature = originData;
      }
      // 暂时注释掉，可能影响多行渲染
      // if (!thisBarFeature.get('isBarDurationStandard') && !onlyRenderMainLine) {
      //   continue;
      // }
      if (underlineNum > 0) {
        for (let num = 1; num <= underlineNum; num++) {
          if (!lineNumPathMap[num]) {
            lineNumPathMap[num] = [];
          }
          if (
            isGroupStartNote
            || lineNumPathMap[num].length === 0
            || i - lineNumPathMap[num][lineNumPathMap[num].length - 1].pos !== 1
          ) {
            lineNumPathMap[num]
              .push({ x: svgData.x, type: 'start', pos: i });
          } else {
            // 说明不是Start，和上一个相连， 弹出end, 并更新
            lineNumPathMap[num]
              .pop();
          }
          lineNumPathMap[num].push({ x: svgData.x + svgData.width, type: 'end', pos: i });
        }
      }
    }

    const allPath = Object.keys(lineNumPathMap).map((lineNum) => {
      const y = styles.underline.innerMarginTop * lineNum;
      return lineNumPathMap[lineNum].reduce((prev, curr) => {
        if (curr.type === 'start') {
          prev += ` M${curr.x} ${y}`;
        } else if (curr.type === 'end') {
          prev += ` L${curr.x} ${y}`;
        }
        return prev;
      }, '');
    });

    return (
      <g transform={`matrix(1, 0, 0, 1, 0, ${styles.underLineY})`}>
        {
          allPath.map((pathData, index) => (
            <path
              key={index}
              d={pathData}
              stroke={styles.underline.stroke}
              strokeWidth="1"
              fill={styles.underline.fill}
            />
          ))
        }
      </g>
    );
  }
}
