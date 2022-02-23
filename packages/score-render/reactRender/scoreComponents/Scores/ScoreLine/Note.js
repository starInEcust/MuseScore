import React from 'react';

export default class ScoreLine extends React.Component {
  render() {
    const {
      originData,
      svgData,
      styles,
    } = this.props;

    const { note } = styles;

    const { noteCenter } = svgData;

    const id = originData.get('id');
    // const svgId = originData.get('svgId');
    // const type = originData.get('type');
    // const drawType = originData.get('drawType');
    const pitch = originData.get('pitch');
    const octave = originData.get('octave');
    const underlineNum = originData.get('underlineNum');
    const attachLeft = originData.get('attachLeft');
    const dot = originData.get('dot');
    const longDurationLine = originData.get('longDurationLine');
    // const words = originData.get('words');
    // const symbolStyles = originData.get('styles');
    // note 初始位置

    let attachLeftSvg = null;

    if (attachLeft) {
      const { leftAttach } = styles;
      // attachLeft.forEach(data => {
      //   switch (data.drawType) {
      //   case AttachType.SHARP: {
      attachLeftSvg = (
        <use
          xlinkHref={`#${attachLeft.get('type')}`}
          width={leftAttach.width}
          height={leftAttach.height}
          id={`note-group-${attachLeft.get('type')}-${id}`}
        />
      );
      //     break;
      //   }
      //   default:
      //   }
      // });
    }

    let octaveSvg = null;

    if (octave && octave !== 0) {
      // debugger;
      const { octave: octaveStyle, underline } = styles;

      let cy = null;

      if (octave > 0) {
        cy = octaveStyle.r;
      } else if (underlineNum) {
        cy = styles.barline.height + (underlineNum * underline.innerMarginTop);
      } else {
        cy = note.height + underline.marginTop;
      }
      octaveSvg = (
        <circle
          cx={noteCenter.x + (note.width / 2)}
          cy={cy}
          r={octaveStyle.r}
          fill={styles.octave.fill}
          id={`note-group-octave-${id}`}
        />
      );
    }

    let dotSvg = null;

    if (dot) {
      const { dot: dotStyle } = styles;

      dotSvg = (
        <circle
          cx={svgData.dot.x}
          cy={svgData.dot.y}
          r={dotStyle.r}
          fill={dotStyle.fill}
          id={`note-group-dot-${id}`}
        />
      );
    }

    let durationLineGroup = null;

    if (longDurationLine) {
      const { durationLine } = styles;

      durationLineGroup = (
        <g id={`note-group-durationLine-group-${id}`}>
          {svgData.longDurationLine.map((lineData, index) => (
            <rect
              key={index}
              x={lineData.x}
              y={lineData.y}
              width={durationLine.width}
              height={durationLine.height}
              fill={durationLine.fill}
              id={`note-group-durationLine-${id}-${index}`}
            />
          ))}
        </g>
      );
    }

    return (
      <g
        id={`whole-note-group-${id}`}
        transform={`matrix(1, 0, 0, 1, ${svgData.x}, ${svgData.y})`}
      >
        <g id={`note-group-${id}`}>
          <use
            xlinkHref={`#note${pitch}`}
            width={note.width}
            height={note.height}
            id={id}
            x={noteCenter.x}
            y={noteCenter.y}
          />
          {attachLeftSvg}
          {octaveSvg}
        </g>
        {dotSvg}
        {durationLineGroup}
      </g>
    );
  }
}
