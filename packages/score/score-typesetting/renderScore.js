import { fromJS, List } from 'immutable';
import { Mode } from 'score-config/constValue';
import actions from 'score-store/actions';
import store from 'score-store';
import markNote from './markNoteFeature';
import mapIds, { resetId } from './mapIds';
import divScoreRow from './divScoreRow';
import adjustWidth from './adjustWidth';
import initSvg from './newSvg';
import getMaxWidthScore from './getMaxWidthScore';
import { sourceAllLine } from './sourceToRenderData';
import { alignAllScore } from './alignMaxScore';

export default function (musicData) {
  const musicScores = musicData.get('musicScores');
  const { mode } = musicData.get('config');
  const keyAndMeter = musicData.get('keyAndMeter');
  const styles = musicData.get('styles');
  // 总画布加上padding
  // 初始化阶段，加入各种标识，执行svg生成函数
  if (mode === Mode.MULTI) {
    const initAllLine = musicScores.map((partScore, index) => sourceAllLine(initSvg(
      markNote(
        mapIds(partScore.get('score'), index),
      ), styles,
    ), keyAndMeter));
    console.log(initAllLine);
    const maxWidth = getMaxWidthScore(initAllLine, keyAndMeter);
    const markMusicScores = markNote(mapIds(maxWidth, 'max'));
    const madeSvgData = initSvg(markMusicScores, styles);
    const sourceData = sourceAllLine(madeSvgData, keyAndMeter);
    const scoreRowArray = divScoreRow(sourceData, styles);
    const finalMaxWidthScore = adjustWidth(scoreRowArray, styles);
    console.log(finalMaxWidthScore);
    const alignedScores = alignAllScore(
      initAllLine,
      finalMaxWidthScore,
      styles,
    );
    console.log(alignedScores);
    // store.dispatch(actions.renderedScore(List([finalMaxWidthScore])));

    store.dispatch(actions.renderedScore(alignedScores));
  } else if (mode === Mode.SINGLE) {
    const allScoreLine = musicScores.map((partScore, index) => {
      const markMusicScores = markNote(mapIds(partScore.get('score'), index));
      // 生成的svg扔到elements里, 产生新的数据, 有了svgData和originData
      const madeSvgData = initSvg(markMusicScores, styles);
      const sourceData = sourceAllLine(madeSvgData, keyAndMeter);
      // 自动换行;
      const scoreRowArray = divScoreRow(sourceData, styles);
      return adjustWidth(scoreRowArray, styles);
    });
    console.log(allScoreLine);
    store.dispatch(actions.renderedScore(allScoreLine));
  }
}
