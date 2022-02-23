import { Record } from 'immutable';

const headerRecord = Record({
  marginTop: 8,
  fontSize: 18,
  color: '#000000',
});


const barlineRecord = Record({
  height: 24,
  normalBarWidth: 1,
  returnBarWidth: 10.67,
  endBarWidth: 5.33,
  fill: '#000000',
});

const lineElementMarginHorizentalRecord = Record({
  bar: 8,
  noteInner: 2,
  noteOuter: 8,
  barScaleBase: 2,
});

const wordStyleRecord = Record({
  fontSize: 14,
  fill: '#000000',
  align: 'center',
  margin: 2,
});

const styleItemRecord = Record({
  width: 0,
  height: 0,
  r: 0,
  fill: '#000000',
  stroke: '#000',
  strokeWidth: 1,
  innerMarginTop: 0,
  innerMarginBottom: 0,
  margin: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginleft: 0,
});

const styleRecord = Record({
  stageWidth: 0,
  pageWidth: 900,
  pageHeight: 900 * Math.sqrt(2),
  paddingTop: 40,
  paddingHorizontal: 50,
  headerHeight: 0,
  headerMarginBottom: 16,
  scoreMarginTop: 16,
  lineMargin: 104,
  lineHeight: 32,
  partMargin: 120,
  scoreFontSize: 18,
  blockBaseMargin: 8,
  markLineWidth: 24,
  // wordStyle: {
  //   fontSize: 14,
  //   // fontFamily: 'sans-serif',
  //   fill: '#000000',
  //   align: 'center',
  //   margin: 2,
  // },
  title: new headerRecord({
    fontSize: 32,
  }),
  subtitle: new headerRecord(
  ),
  subtitle2: new headerRecord(),
  keyText: new headerRecord(),
  speed: new headerRecord({
    marginTop: 100,
  }),
  emotion: new headerRecord(),
  meterText: new headerRecord(),
  wordAuthor: new headerRecord({
    marginTop: 100,
  }),
  songAuthor: new headerRecord({
    marginTop: 16,
  }),
  barline: new barlineRecord(),
  lineElementMarginHorizental: new lineElementMarginHorizentalRecord(),

  wordStyle: new wordStyleRecord(),

  cursor: styleItemRecord({
    width: 1.6,
    height: 24,
    fill: '#000000',
  }),

  underline: new styleItemRecord({
    width: 1,
    marginTop: 3,
    innerMarginTop: 3,
    stroke: '#000',
    strokeWidth: 1,
    fill: 'none',
  }),
  arc: new styleItemRecord({
    stroke: '#000',
    strokeWidth: 1,
    fill: 'none',
    width: 0.65,
    marginBottom: 2,
  }),
  part: new styleItemRecord({
    stroke: '#000',
    strokeWidth: 1,
    fill: 'none',
    height: 12,
    marginBottom: 2,
  }),
  // durationLine
  durationLine: new styleItemRecord({
    width: 10,
    height: 2,
    fill: '#000000',
  }),
  octave: new styleItemRecord({
    r: 1.5,
    margin: 3,
    fill: '#000000',
  }),
  dot: new styleItemRecord({
    r: 1.5,
    fill: '#000000',
  }),
  leftAttach: new styleItemRecord({
    width: 8,
    height: 11.2,
    marginTop: 2,
    marginRight: 2,
  }),
  // note
  note: new styleItemRecord({
    width: 14,
    height: 16,
  }),
  accompNote: new styleItemRecord({
    width: 9,
    height: 12,
  }),
  noteStyle: new styleItemRecord({
    fill: '#000000',
  }),
});

class couputedStyle extends styleRecord {
  get stageWidth() {
    return this.pageWidth - (this.paddingHorizontal * 2);
  }

  get barlineY() {
    return (this.lineHeight - this.barline.height) / 2;
  }

  get underLineY() {
    return ((this.lineHeight + this.barline.height) / 2);
  }

  get firstLineOffsetTop() {
    const maxMarginTop = Math.max(
      this.title.marginTop + this.title.fontSize
      + this.subtitle.marginTop + this.subtitle.fontSize
      + this.subtitle2.marginTop + this.subtitle2.fontSize,
      this.wordAuthor.marginTop + this.wordAuthor.fontSize
      + this.songAuthor.marginTop + this.songAuthor.fontSize,
    );

    return this.paddingTop + this.headerMarginBottom + maxMarginTop;
  }
}

export default new couputedStyle();
