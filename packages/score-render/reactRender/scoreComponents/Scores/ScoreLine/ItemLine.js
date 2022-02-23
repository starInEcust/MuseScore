import React from 'react';
import { Type, DrawType, Mode } from 'score-config/constValue';
import Note from './Note';
import Barline from './Barline';
import NormalScore from './NormalScore';

export default class ItemLine extends React.Component {
  renderFeature = (originData) => {
    // return null;
    const {
      styles,
      onlyRenderMainLine,
    } = this.props;
    let temporaryBarline = null;
    let temporaryLine = null;

    if (!onlyRenderMainLine) {
      if (!originData.get('isBarDurationStandard') && this.props.musicData.mode === Mode.MULTI) {
        temporaryBarline = (
          <rect
            x={originData.get('barEndX') - originData.get('barStartX')}
            width={styles.barline.normalBarWidth}
            height={styles.barline.height}
            fill={styles.barline.fill}
            id={`${originData.get('id')}-temporary-barline`}
          />
        );
        temporaryLine = (
          <NormalScore
            scoreData={originData.get('unStandardBarData')}
            styles={styles}
            x={0}
            y={-40}
          />
        );
      }
    }
    if (!originData.get('barStartX')) return null;
    return (
      <g
        key={originData.get('id')}
        id={`note-group-${originData.get('id')}`}
        transform={`matrix(1, 0, 0, 1, ${originData.get('barStartX')}, 0)`}
      >
        {temporaryBarline}
        {temporaryLine}
      </g>
    );
  }

  render() {
    const {
      lineData,
      styles,
      onlyRenderMainLine,
    } = this.props;

    let thisBarFeature = null;
    console.log(lineData);
    return (
      <g>
        <rect x="0" y="0" width={styles.stageWidth} height="1" fill="none" />
        {
          lineData.map((item) => {
            const originData = item.get('originData');
            const svgData = item.get('svgData');
            const drawType = originData.get('drawType');
            const type = originData.get('type');
            if (type === Type.BAR_START_FEATURE) {
              thisBarFeature = originData;
              return this.renderFeature(originData, item);
            }
            if (!thisBarFeature.get('isBarDurationStandard') && !onlyRenderMainLine && this.props.musicData.mode === Mode.MULTI) {
              return null;
            }
            if (drawType === DrawType.NOTE) {
              return (
                <Note
                  key={originData.get('id')}
                  originData={originData}
                  svgData={svgData}
                  styles={styles}
                  // otherFeature={{
                  // unDurationStandardBarNote: !thisBarFeature.get('isBarDurationStandard'),
                  // }}
                />
              );
            }

            if (drawType === DrawType.BARLINE) {
              return (
                <Barline
                  key={originData.get('id')}
                  originData={originData}
                  svgData={svgData}
                  styles={styles}
                  // otherFeature={{
                  //   offsetX: thisBarFeature.offsetX,
                  // }}
                />
              );
            }
            console.log('unknow note');
            return null;
          })
        }
      </g>
    );
  }
}
