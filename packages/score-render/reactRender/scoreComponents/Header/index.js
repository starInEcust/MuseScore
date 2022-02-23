import React from 'react';
import { getSvgsRect } from 'score-method';

class ScoreLine extends React.Component {
  title = React.createRef()

  subtitle = React.createRef()

  state = {
    rects: [],
  }

  componentWillMount() {
    this.getAllSvgRect();
  }

  componentDidMount() {
    // console.log(getSvgRect('123'));

    // this.updatePosion();
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.musicData.get('header') !== this.props.musicData.get('header')
      || nextProps.musicData.get('styles') !== this.props.musicData.get('styles')
    ) {
      return true;
    }
    return false;
  }

  componentWillUpdate() {
    this.getAllSvgRect();
  }

  getAllSvgRect() {
    console.log(this.props.musicData);
    const headerData = this.props.musicData.get('header');
    const keyAndMeter = this.props.musicData.get('keyAndMeter');
    const styles = this.props.musicData.get('styles');
    console.log(headerData);

    const title = headerData.get('title');
    const subtitle = headerData.get('subtitle');
    const subtitle2 = headerData.get('subtitle2');
    const wordAuthor = headerData.get('wordAuthor');
    const songAuthor = headerData.get('songAuthor');
    const speed = headerData.get('speed');
    const emotion = headerData.get('emotion');

    const {
      key,
      beatType,
      beats,
    } = keyAndMeter;

    const keyText = '1=';
    const meterText = `${beatType}/${beats}`;

    const rects = getSvgsRect([
      { text: title, fontSize: styles.title.fontSize },
      { text: subtitle, fontSize: styles.subtitle.fontSize },
      { text: subtitle2, fontSize: styles.subtitle2.fontSize },
      { text: wordAuthor, fontSize: styles.wordAuthor.fontSize },
      { text: songAuthor, fontSize: styles.songAuthor.fontSize },
      { text: speed, fontSize: styles.speed.fontSize },
      { text: emotion, fontSize: styles.emotion.fontSize },
      { text: keyText, fontSize: styles.keyText.fontSize },
      { text: meterText, fontSize: styles.meterText.fontSize },
    ]);
    console.log(rects);
    this.setState({
      rects,
    });
  }

  render() {
    console.log(this.props);

    const {
      rects: [
        title,
        subtitle,
        subtitle2,
        wordAuthor,
        songAuthor,
        speed,
        emotion,
        keyText,
        meterText,
      ],
    } = this.state;

    const {
      musicData,
    } = this.props;

    const headerData = musicData.get('header');
    const styles = musicData.get('styles');

    const titleY = styles.paddingTop + styles.title.marginTop;
    const subtitleY = titleY + styles.subtitle.marginTop + title.height;
    const subtitle2Y = subtitleY + styles.subtitle2.marginTop + subtitle.height;

    return (
      <g
        ref={this.scoreLine}
        transform="matrix(1, 0, 0, 1, 0, 0)"
      >
        <text
          x={(styles.pageWidth - title.width) / 2}
          y={titleY}
          fill={styles.title.color}
          alignmentBaseline="hanging"
          style={{
            fontSize: styles.title.fontSize,
          }}
        >
          {headerData.get('title')}
        </text>
        <text
          x={(styles.pageWidth - subtitle.width) / 2}
          y={subtitleY}
          fill={styles.subtitle.color}
          alignmentBaseline="hanging"
          style={{
            fontSize: styles.subtitle.fontSize,
          }}
        >
          {headerData.get('subtitle')}
        </text>
        <text
          x={(styles.pageWidth - subtitle2.width) / 2}
          y={subtitle2Y}
          fill={styles.subtitle2.color}
          alignmentBaseline="hanging"
          style={{
            fontSize: styles.subtitle2.fontSize,
          }}
        >
          {headerData.get('subtitle2')}
        </text>
        <text
          x={styles.paddingHorizontal}
          y={styles.paddingTop + styles.speed.marginTop}
          fill={styles.speed.color}
          alignmentBaseline="hanging"
          style={{
            fontSize: styles.speed.fontSize,
          }}
        >
          {headerData.get('speed')}
          {' '}
          {headerData.get('emotion')}
        </text>
        <text
          x={(styles.stageWidth + styles.paddingHorizontal - wordAuthor.width)}
          y={styles.paddingTop + styles.wordAuthor.marginTop}
          fill={styles.wordAuthor.color}
          alignmentBaseline="hanging"
          style={{
            fontSize: styles.wordAuthor.fontSize,
          }}
        >
          {headerData.get('wordAuthor')}
        </text>
        <text
          x={(styles.stageWidth + styles.paddingHorizontal - songAuthor.width)}
          y={styles.paddingTop + styles.wordAuthor.marginTop + styles.wordAuthor.fontSize + styles.songAuthor.marginTop}
          fill={styles.songAuthor.color}
          alignmentBaseline="hanging"
          style={{
            fontSize: styles.songAuthor.fontSize,
          }}
        >
          {headerData.get('songAuthor')}
        </text>
      </g>
    );
  }
}

export default ScoreLine;
