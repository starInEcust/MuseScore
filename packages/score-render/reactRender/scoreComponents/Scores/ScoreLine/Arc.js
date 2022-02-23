import React from 'react';
// import { DrawType } from '../../constants/constValue';

export default class ScoreLine extends React.Component {
  render() {
    const {
      lineData,
      styles,
    } = this.props;

    let allArc = [];
    const arcStartArray = [];

    lineData
      .filter(item => item.getIn(['originData', 'arc']))
      .forEach((item) => {
        const originData = item.get('originData');
        const svgData = item.get('svgData');

        originData.get('arc').forEach((arcData) => {
          // 找到开始的放数组里
          if (arcData.get('direction') === 'start') {
            arcStartArray.push({ arcData, svgData });
          }
          // 找到结束的再从开始数组中找与之匹配的
          if (arcData.get('direction') === 'stop') {
            const startNoteIndex = arcStartArray.findIndex(startData => startData.arcData.get('id') === arcData.get('id'));
            const startNote = arcStartArray[startNoteIndex];
            if (startNote) {
              // 找到了说明在同一行可以开始画
              const startSvg = startNote.svgData;
              const startX = startSvg.x + startSvg.noteCenter.x + (startSvg.noteCenter.width / 2);
              const endX = svgData.x + svgData.noteCenter.x + (svgData.noteCenter.width / 2);
              const startY = Math.min(startSvg.y, svgData.y) - styles.arc.marginBottom;
              const width = endX - startX;
              const midDistance = 3 + (((width / 2) - 10) * 0.1);
              const topY = startY - (4 + (((width / 2) - 10) * 0.05));
              const x1 = startX + midDistance;
              const x2 = startX + (width / 2);
              const x3 = endX - midDistance;
              const q2 = styles.arc.width + topY;

              const arc = `
                M${startX}, ${startY}
                Q${x1}, ${q2} ${x2}, ${q2}
                Q${x3}, ${q2} ${endX}, ${startY}
                Q${x3}, ${topY} ${x2}, ${topY}
                Q${x1}, ${topY} ${startX}, ${startY}
              `;

              allArc.push(arc);
              arcStartArray.splice(startNoteIndex, 1);
            } else {
              // 有结束没开始
              const endX = svgData.x + svgData.noteCenter.x + (svgData.noteCenter.width / 2);
              const endY = svgData.y - styles.arcMarginBottom;
              const width = endX * 2;
              const midDistance = 3 + (((width / 2) - 10) * 0.1);
              const topY = endY - (4 + (((width / 2) - 10) * 0.05));
              const x1 = endX - midDistance;

              const arc = `
                M 0, ${topY}
                Q${x1}, ${topY} ${endX}, ${endY}
                Q${x1}, ${styles.arcWidth + topY} 0, ${styles.arc.width + topY}
              `;
              allArc.push(arc);
            }
          }
        });
      });
    if (arcStartArray.length > 0) {
      // 说明这行有开始没结束
      arcStartArray.forEach((data) => {
        const svgData = data.svgData;
        const startX = svgData.x + svgData.noteCenter.x + (svgData.noteCenter.width / 2);
        const startY = svgData.y - styles.arc.marginBottom;
        const endX = styles.stageWidth;
        const halfWidth = styles.stageWidth - startX;
        const midDistance = 3 + ((halfWidth - 10) * 0.1);
        const topY = startY - (4 + ((halfWidth - 10) * 0.05));
        const x1 = startX + midDistance;
        const arc = (`
              M ${startX}, ${startY}
              Q${x1}, ${topY} ${endX}, ${topY}
              Q${x1}, ${styles.arc.width + topY} ${startX}, ${startY}
            `);
        allArc.push(arc);
      });
    }

    return (
      <g>
        {
          allArc.map((pathData, index) => (
            <path
              key={index}
              d={pathData}
              stroke={styles.arc.stroke}
              strokeWidth="1"
              strokeLinecap="butt"
              strokeLinejoin="bevel"
              width="0.65"
              fill={styles.arc.fill}
            />
          ))
        }
      </g>
    );
  }
}
