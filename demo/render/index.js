import museScore from '../../packages/score/index';
import transfer from '../../packages/xml-transfer';

window.onload = (() => {
  fetch('./assets/pugongying.musicxml').then(data => {
    return data.text();
  }).then((xml) => {
    const testJson = transfer(xml);
    museScore(
      { 
        selector: '#museScoreView',
        scoreData: testJson,   
        config: {
        mode: 'single',
        withEdit: true,
      },
    })
  });
});
