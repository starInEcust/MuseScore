import museScore from 'score';
import transfer from 'xml-transfer';

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
