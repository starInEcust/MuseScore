import React from 'react';
import ItemLine from './ItemLine';
import Underline from './Underline';
import Arc from './Arc';
import Part from './Part';

class ScoreLine extends React.Component {
  constructor(props) {
    super(props);
    this.scoreLine = React.createRef();
  }

  componentDidMount() {
    this.updatePosion();
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.lineData !== this.props.lineData
      || nextProps.styles !== this.props.styles
      || nextProps.params.scoreLine !== this.props.params.scoreLine
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    this.updatePosion(prevProps);
  }

  // dom加载完成后计算位置
  updatePosion(prevProps) {
    const {
      styles, lineIndex, partIndex, actions, params,
    } = this.props;

    const y = styles.lineMargin * lineIndex
      + styles.partMargin * partIndex
      - this.scoreLine.current.getBBox().y;
    const paramsData = params.scoreLine.getIn([partIndex, lineIndex]);

    if (prevProps && paramsData && y === paramsData.y) {
      console.log(this.props, prevProps);
      if (
        prevProps.lineIndex !== lineIndex
        || prevProps.partIndex !== partIndex
        || prevProps.params.cursor.elementIndex !== params.cursor.elementIndex
      ) {
        actions.refreshCursor({
          partIndex,
          lineIndex,
        });
      }
      return;
    }

    const x = styles.paddingHorizontal;

    actions.setLine({
      partIndex,
      lineIndex,
      x,
      y,
    });
    // 更新行位置后更新光标位置
    actions.refreshCursor({
      partIndex,
      lineIndex,
    });
  }

  render() {
    const {
      lineData, styles, partIndex, lineIndex, params,
    } = this.props;

    return (
      <g
        ref={this.scoreLine}
        transform={`matrix(1, 0, 0, 1, 0, ${
          params.scoreLine.getIn([partIndex, lineIndex])
            ? params.scoreLine.getIn([partIndex, lineIndex]).y
            : 0
        })`}
      >
        <ItemLine
          musicData={this.props.musicData}
          lineData={lineData}
          styles={styles}
        />
        <Underline lineData={lineData} styles={styles} />
        <Arc lineData={lineData} styles={styles} />
        <Part lineData={lineData} styles={styles} />
      </g>
    );
  }
}

export default ScoreLine;
