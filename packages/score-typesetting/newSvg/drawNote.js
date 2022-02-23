import { Map, List } from 'immutable';
import {
  Type,
  MusicType,
} from 'score-config/constValue';
import { NoteSvgData, normalSvg } from 'score-config//Record';

export default function (noteData, styles) {
  const type = noteData.get('type');
  // const drawType = noteData.get('drawType');
  const octave = noteData.get('octave');
  const attachLeft = noteData.get('attachLeft');
  const dot = noteData.get('dot');
  const longDurationLine = noteData.get('longDurationLine');
  const words = noteData.get('words');
  const symbolStyles = noteData.get('styles');

  let width;
  let height;
  let groupWidth = 0;
  let groupHeight = 0;

  if (type === Type.SYMBOL) {
    // 画特殊符号
    width = symbolStyles.width;
    height = symbolStyles.height;
    // thisNote = stage.paper.use(svgId).attr({
    //   id,
    //   width,
    //   height,
    //   // styles.width,
    //   // styles.height,
    // });
  } else {
    // 是否是间奏
    if (noteData.get('musicType') === MusicType.ACCOMP_NOTE) {
      width = styles.accompNote.width;
      height = styles.accompNote.height;
    } else {
      width = styles.note.width;
      height = styles.note.height;
    }
    groupWidth += width;
    groupHeight += height;

    // 正常的音符，在这里生成svg，只有一个数字
    // thisNote = stage.paper.use(`note${pitch}`).attr({
    //   id,
    //   width,
    //   height,
    // });
  }
  const {
    leftAttach: {
      width: attachWidth,
      height: attachHeight,
      marginTop,
      marginRight,
    },
    octave: octaveStyle,
  } = styles;

  let noteY = 0;
  let noteX = 0;

  if (octave && octave > 0) {
    // TODO: 可以避免多次计算优化  换到computed里
    noteY += octaveStyle.margin + octaveStyle.r * 2;
  }

  if (attachLeft) {
    // TODO: 忘记为什么要forEach~ 多个attach有吗？
    noteX += attachWidth + marginRight;
    if (!(octave && octave > 0)) noteY += marginTop;
  }

  // 画长时值
  let longDurationLineList = null;

  if (longDurationLine) {
    longDurationLineList = List();
    // TODO: 换到computed里
    const y = noteY + ((height - styles.durationLine.height) / 2);
    for (let i = 1; i <= longDurationLine; i++) {
      longDurationLineList = longDurationLineList.push(new normalSvg({
        width: styles.durationLine.width,
        height: styles.durationLine.height,
        x: 0,
        y,
      }));
    }
  }

  if (words) {
    // otherData.wordsGroup = [];

    // words.forEach((oneLineWords, lineIndex) => {
    //   if (oneLineWords.main) {
    //     const mainWords = stage.paper.g();
    //     const wordsArray = oneLineWords.main.text.split('');
    //     const wordsSvgArray = [];
    //     for (let i = 0; i < wordsArray.length; i++) {
    //       const wordSvg = stage.paper.text(0, 0, wordsArray[i]);
    //       wordsSvgArray.push(wordSvg);
    //       if (i > 0) {
    //         const { x, width: wordWidth } = wordsSvgArray[i - 1].getBBox();
    //         translate(wordSvg, x + wordWidth + styles.wordMargin, 0);
    //       } else {
    //           // 第一个字母的宽度为基准
    //         const startPosition = ((width - wordSvg.getBBox().width) / 2) + noteX;

    //         translate(wordSvg, startPosition, 0);
    //       }
    //       mainWords.add(wordSvg);
    //     }
    //     translate(mainWords, 0, (lineIndex + 1) * 40);
    //     otherData.wordsGroup.push(mainWords);
    //     // wholeGroup.add(mainWords);
    //   }
    // });
  }
  groupWidth += noteX;
  groupHeight += noteY;

  const svgData = {
    x: 0,
    y: (styles.lineHeight - height) / 2 - noteY,
    width: groupWidth,
    height: groupHeight,
    noteCenter: new normalSvg({
      height,
      width,
      // 相对于group的位置，一般为0;
      x: noteX,
      y: noteY,
    }),
  };

  if (dot) {
    svgData.dot = new normalSvg({
      height: styles.dot.r,
      width: styles.dot.r,
      // 相对于group的位置，一般为0;
      x: 0,
      y: 0,
    });
  }

  if (longDurationLineList) {
    svgData.longDurationLine = longDurationLineList;
  }

  return Map({
    originData: noteData,
    svgData: new NoteSvgData(svgData),
  });
}
