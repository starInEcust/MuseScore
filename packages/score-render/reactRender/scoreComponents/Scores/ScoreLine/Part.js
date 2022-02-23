import React from 'react';

export default class Part extends React.Component {
  render() {
    const {
      lineData,
      styles,
    } = this.props;

    const allPart = [];
    const partStartArray = [];
    for (let i = 0; i < lineData.size; i++) {
      const item = lineData.get(i);

      if (item.getIn(['originData', 'part'])) {
        const originData = item.get('originData');
        const svgData = item.get('svgData');

        for (let j = 0; j < originData.get('part').size; j++) {
          const partData = originData.getIn(['part', j]);
          // 找到开始的放数组里
          if (partData.get('type') === 'start') {
            partStartArray.push({ partData, index: i });
          }
          // 找到结束的再从开始数组中找与之匹配的
          if (partData.get('type') === 'stop') {
            const startDataIndex = partStartArray.findIndex(startData => startData.partData.get('id') === partData.get('id'));
            // 起点
            let startData = partStartArray[startDataIndex];
            if (startData) {
              let startX = null;
              let endX = null;
              const bottomY = svgData.y - styles.part.marginBottom;
              const topY = bottomY - styles.part.height;
              if (startData.index === 0) {
                // 在第一个开始
                startX = 0.5;
              } else {
                // 小节信息前的barline svg
                const startSvg = lineData.get(startData.index - 1).get('svgData');
                // 找到了说明在同一行可以开始画 使用的数据有开始元素和当前元素

                if (startSvg.width > 1) {
                  startX = startSvg.x + startSvg.width - 2;
                } else {
                  // 起始位置+0.5 和rect的barline对齐, 因为rect和path的起点不一样，path是0.5起
                  startX = startSvg.x + 0.5;
                }
              }
              if (svgData.width > 1) {
                endX = svgData.x + svgData.width - 2;
              } else {
                endX = svgData.x + 0.5;
              }
              const partPath = `
                M ${startX}, ${bottomY}
                L ${startX}, ${topY}
                L ${endX - 1}, ${topY}
                L ${endX - 1}, ${bottomY}
              `;

              const partText = startData.partData.get('partId').map((partId, index) => ({
                x: startX + 6 + index * 12,
                y: 2,
                partId,
              }));
              allPart.push({ partPath, partText });
              // 删除找到的开始元素
              partStartArray.splice(startDataIndex, 1);
            } else {
              // 有结束没开始
              let endX = null;
              if (svgData.width > 1) {
                endX = svgData.x + svgData.width - 2;
              } else {
                endX = svgData.x + 0.5;
              }
              const endY = svgData.y - styles.part.marginBottom;
              const topY = endY - styles.part.height;

              const partPath = `
                M 0, ${topY}
                L ${endX}, ${topY}
                L ${endX}, ${endY}
              `;

              allPart.push({ partPath });
            }
          }
        }
      }
    }

    if (partStartArray.length > 0) {
      // 说明这行有开始没结束
      partStartArray.forEach((startData) => {
        // const originData = lineData.get(startData.index - 1).get('originData');
        const svgData = lineData.get(startData.index - 1).get('svgData');

        let startX = null;
        if (svgData.width > 1) {
          startX = svgData.x + svgData.width - 2;
        } else {
          // 起始位置+0.5 和rect的barline对齐
          startX = svgData.x + 0.5;
        }
        const startY = svgData.y - styles.part.marginBottom;
        const endX = styles.stageWidth;
        const topY = startY - styles.part.height;

        const partPath = `
          M ${startX}, ${startY}
          L ${startX}, ${topY}
          L ${endX}, ${topY}
        `;
        const partText = startData.partData.get('partId').map((partId, index) => ({
          x: startX + 6 + index * 12,
          y: 2,
          partId,
        }));
        allPart.push({ partPath, partText });
        // fontSize: 10,
        // fontStyle: 'italic',
      });
    }
    if (allPart.length === 0) {
      return null;
    }

    return (
      <g>
        {
          allPart.map((pathData, index) => (
            <g key={index}>
              <path
                d={pathData.partPath}
                stroke={styles.part.stroke}
                strokeWidth={styles.part.strokeWidth}
                fill={styles.part.fill}
              />
              {
                pathData.partText && pathData.partText.map(text => (
                  <text
                    key={text.partId}
                    x={text.x}
                    y={text.y}
                    stroke="blue"
                    fill="none"
                    fontSize="10"
                    fontStyle="italic"
                    strokeWidth=".5"
                  >
                    {text.partId}
                    {' '}
.
                  </text>
                ))
              }
            </g>
          ))
        }
      </g>
    );
  }
}
