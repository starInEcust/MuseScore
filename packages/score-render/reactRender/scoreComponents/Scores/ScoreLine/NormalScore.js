import React from 'react';
import ItemLine from './ItemLine';
import Underline from './Underline';
import Arc from './Arc';
import Part from './Part';

class NormalScore extends React.Component {
  render() {
    const {
      scoreData,
      styles,
      x,
      y,
    } = this.props;

    return (
      <g
        ref={this.scoreLine}
        transform={`matrix(1, 0, 0, 1, ${x}, ${y})`}
      >
        <ItemLine
          lineData={scoreData}
          styles={styles}
          onlyRenderMainLine
        />
        <Underline
          lineData={scoreData}
          styles={styles}
          onlyRenderMainLine
        />
        <Arc
          lineData={scoreData}
          styles={styles}
        />
        <Part
          lineData={scoreData}
          styles={styles}
        />
      </g>
    );
  }
}

export default NormalScore;
