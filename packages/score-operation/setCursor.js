export default function (stage, actions, store) {
  stage.addEventListener('click', (e) => {
    const state = store.getState().musicData;
    const renderedScores = state.get('renderedScores');
    // 行坐标数据
    const scoreLineParams = state.get('params').scoreLine;
    const {
      paddingHorizontal,
      stageWidth,
      lineHeight,
      firstLineOffsetTop,
      pageWidth,
    } = state.get('styles');

    const offsetY = e.offsetY - firstLineOffsetTop;

    let lineIndex = -1;
    const onClickPartIndex = scoreLineParams.findIndex((part) => {
      lineIndex = part.findIndex((line) => {
        const {
          y,
        } = line;

        return offsetY > y && offsetY < y + lineHeight;
      });

      return lineIndex > -1;
    });


    if (
      e.offsetX > paddingHorizontal
      && e.offsetX < paddingHorizontal + stageWidth
      && onClickPartIndex > -1
    ) {
      // 点中行内
      let clickDataIndex = null;
      // 判断是否点中，同时给index赋值
      const getClickDataIndex = () => {
        clickDataIndex = renderedScores.getIn([onClickPartIndex, lineIndex]).findIndex(
          item => item.getIn(['originData', 'id']) === e.target.getAttribute('id'),
        );
        return clickDataIndex > -1;
      };

      if (e.target && e.target.getAttribute('id') && getClickDataIndex()) {
        // 点中元素
        const clickData = renderedScores.getIn([onClickPartIndex, lineIndex, clickDataIndex]);
        const {
          x,
          width,
        } = clickData.get('svgData');

        actions.setCursor({
          x: x + width + paddingHorizontal,
          y: scoreLineParams.getIn([onClickPartIndex, lineIndex]).y + firstLineOffsetTop,
          partIndex: onClickPartIndex,
          lineIndex,
          elementIndex: clickDataIndex,
        });
      } else {
        // 点中行内空白
        const thisLineList = renderedScores.getIn([onClickPartIndex, lineIndex]);

        let clickIndex = thisLineList.findIndex(item => e.offsetX < (item.get('svgData').x + paddingHorizontal));

        clickIndex--;

        if (clickIndex - 1 > -1) {
          const {
            x,
            width,
          } = thisLineList.getIn([clickIndex, 'svgData']);

          actions.setCursor({
            x: x + width + paddingHorizontal,
            y: scoreLineParams.getIn([onClickPartIndex, lineIndex]).y + firstLineOffsetTop,
            partIndex: onClickPartIndex,
            lineIndex,
            elementIndex: clickIndex,
          });
        }
      }
    } else if (
      e.offsetX > paddingHorizontal + stageWidth
      && e.offsetX < pageWidth
      && onClickPartIndex > -1
    ) {
      const thisLineList = renderedScores.getIn([onClickPartIndex, lineIndex]);

      actions.setCursor({
        x: paddingHorizontal + stageWidth,
        y: scoreLineParams.getIn([onClickPartIndex, lineIndex]).y + firstLineOffsetTop,
        partIndex: onClickPartIndex,
        lineIndex,
        elementIndex: thisLineList.size - 1,
      });
    }
  });
}
