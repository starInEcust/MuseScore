import React from 'react';
import './style.scss';

class Cursor extends React.Component {
  render() {
    const {
      styles,
      params,
    } = this.props;

    return (
      <rect
        x={params.cursor.x}
        y={params.cursor.y + 4}
        width={styles.cursor.width}
        height={styles.cursor.height}
        fill={styles.cursor.fill}
        className="music-score-cursor"
        id="musicCursor"
      />
    );
  }
}

export default Cursor;
