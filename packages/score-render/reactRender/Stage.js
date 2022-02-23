import React from 'react';
import Symbols from './scoreComponents/symbol';
import ScoreContent from './scoreComponents/Scores/ScoreContent';
import Header from './scoreComponents/Header';
import Cursor from './cursor';

class Stage extends React.Component {
  render() {
    const renderedScores = this.props.musicData.get('renderedScores');
    const styles = this.props.musicData.get('styles');
    const params = this.props.musicData.get('params');
    return (
      <svg
        ref={this.props.forwardedRef}
        width={styles.pageWidth}
        height={styles.pageHeight}
        viewBox={`0 0 ${styles.pageWidth} ${styles.pageHeight}`}
      >
        <Symbols />
        <Cursor
          styles={styles}
          params={params}
        />
        <Header musicData={this.props.musicData} />
        <ScoreContent
          musicData={this.props.musicData}
          data={renderedScores}
          styles={styles}
          params={params}
          actions={this.props.actions}
        />
      </svg>
    );
  }
}

export default React.forwardRef((props, ref) => <Stage {...props} forwardedRef={ref} />);
