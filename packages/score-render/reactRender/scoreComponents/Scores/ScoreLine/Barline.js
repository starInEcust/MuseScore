import React from 'react';
import { MusicType } from 'score-config/constValue';

export default class ScoreLine extends React.Component {
  render() {
    const {
      originData,
      svgData,
      styles,
    } = this.props;

    const svgId = originData.get('svgId');
    const id = originData.get('id');

    let barline = null;

    const attr = {
      href: `#${svgId}`,
      height: styles.barline.height,
      fill: styles.barline.fill,
      id,
    };

    switch (originData.get('musicType')) {
    case MusicType.END_BAR:
      barline = (
        <use
          {...attr}
          width={styles.barline.endBarWidth}
        />
      );
      break;
    case MusicType.RETURN_START_BAR:
      barline = (
        <use
          {...attr}
          width={styles.barline.returnBarWidth}
        />
      );
      break;
    case MusicType.RETURN_END_BAR:
      barline = (
        <use
          {...attr}
          width={styles.barline.returnBarWidth}
        />
      );
      break;
    default:
      barline = (
        <rect
          width={styles.barline.normalBarWidth}
          height={styles.barline.height}
          fill={styles.barline.fill}
          id={id}
        />
      );
    }
    // 放到g里面才能拿到准确BBox数据

    return (
      <g id={`note-group-${id}`} transform={`matrix(1, 0, 0, 1, ${svgData.x}, ${svgData.y})`}>
        {barline}
      </g>
    );
  }
}
