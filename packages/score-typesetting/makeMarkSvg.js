import { DrawType } from 'score-config/constValue';
import elements from '../../elements';
import { translate } from '../drawMethod';
// 多行标线
export default function (scoreArray, styles) {
  const { stage } = elements;

  scoreArray.forEach((score) => {
    score.forEach((item) => {
      const {
        originData: { drawType, id },
        svgData,
      } = item;

      if (drawType === DrawType.NOTE) {
        // 删除元素变成对齐标线
        elements[id].note.remove();
        elements[id].note = stage.paper.use('mark-line').attr({
          id,
          width: styles.markLineWidth,
          height: 77,
        });
        elements[id].main.append(elements[id].note);
        translate(elements[id].note, svgData.noteCenter.x + (svgData.noteCenter.width / 2) - (styles.markLineWidth / 2), svgData.noteCenter.y);
      } else if (drawType === DrawType.BARLINE) {
        // elements[id].main.remove();
        // elements[id].main = stage.paper.use('endBar').attr({
        //   id,
        //   width: styles.endBarWidth,
        //   height: styles.barlineHeight,
        // });
        // translate(elements[id].main, svgData.x, svgData.y);
      }
    });
  });
}
