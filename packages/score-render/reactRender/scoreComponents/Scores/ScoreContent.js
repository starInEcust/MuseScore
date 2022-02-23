import React from 'react';
import ScoreLine from './ScoreLine';

export default class ScoreContent extends React.Component {
  render() {
    const {
      paddingHorizontal,
      firstLineOffsetTop,
    } = this.props.styles;

    const hasScore = this.props.data.some(partData =>
      partData.some(lineData => lineData.size > 1),
    );

    return (
      <g transform={`matrix(1, 0, 0, 1, ${paddingHorizontal}, ${firstLineOffsetTop})`}>
        {
          hasScore && this.props.data.map((partData, partIndex) => partData.map((lineData, index) => (
            <ScoreLine
              key={index}
              musicData={this.props.musicData}
              partIndex={partIndex}
              lineIndex={index}
              lineData={lineData}
              params={this.props.params}
              styles={this.props.styles}
              actions={this.props.actions}
            />
          )))
        }
      </g>
    );
  }
}
