import stepExchange from './method/stepExchange';
import elementsToObject from './method/elementsToObject';
import { getTie } from './method/dealAttributes';
import getFifths from './method/getFifths';
import getElement from './method/getElement';
import convert from 'xml-js';

const transfer = ((data) => {
  const xmlJson = convert.xml2json(data);
  const forMusicElement = JSON.parse(xmlJson).elements.find(element => element.name === 'score-partwise');
  
  console.log(forMusicElement);
  // 简化elements
  const textArray2test = (element) => {
    const hasOneText = (
      element.elements
      && element.elements.length === 1
      && element.elements[0].type === 'text'
      && element.elements[0].text
      && Object.keys(element.elements[0]).length === 2
    );
    if (hasOneText) {
      element.text = element.elements[0].text;
    } else if (element.elements && element.elements.length > 0) {
      element.elements = element.elements.map(textArray2test);
    }

    return element;
  };

  const textElements = forMusicElement.elements.map(textArray2test);
  const title = getElement(forMusicElement, 'work', 'work-title').text;
  const songAuthor = getElement(forMusicElement, 'identification', 'creator').text
  const credits = forMusicElement.elements.filter(item => item.name === 'credit');

  const creditObject = {};
  try {
    credits.forEach(creditItem => {
      const [key, value] = creditItem.elements.map(item => item.text);
  
      creditObject[key] = value;
    })
  } catch (e) {
    console.error('credits error')
  }

  console.log(creditObject);

  const parts = forMusicElement.elements.filter(element => element.name === 'part');
  // keyAndMeter: {
  //   text: '1=F',
  //   beatType: 4,
  //   beats: 4,
  //   divisions: 4,
  // },
  // console.log(elementsToObject(parts));

  // 每个part遍历
  const partsArray = [];
  const globalParams = {
    idNum: 99910
  };
  const nextCache = {};
  parts.forEach((partData) => {
    console.log(123, partData);
    const onePartArray = [];
    const part = partData.elements.map((measureData) => {
      if (measureData.name === 'measure') {
        // console.log(measureData);
        return measureData.elements.map((itemData) => {
          if (itemData.name === 'barline') {
            console.log(itemData);
          }
          return elementsToObject(itemData, true);
        });
      }
    });
    console.log(234, part);
    part.forEach((measureData, partIndex) => {

      const startFeature = {
        type: 'BAR_START_FEATURE',
      };
      console.log(measureData)
      const attributes = getElement(measureData, 'attributes')
      if (attributes) {
        startFeature.key = getFifths(attributes.key.fifths);
        startFeature.beats = attributes.time.beats;
        startFeature.beatType = attributes.time['beat-type'];
        startFeature.divisions = attributes.divisions;
      }
      
      // 设置小结前后启点
      const noteMeasure = measureData.filter(itemData => itemData.name === 'note');


      

      noteMeasure[0].isBarStartNote = true;

      noteMeasure[noteMeasure.length - 1].isBarEndNote = true;
      onePartArray.push(startFeature);

      // 每小结数据遍历
      measureData.forEach((itemData, index) => {
        let obj = {};

        if (itemData.name === 'note') {
          const {
            isBarStartNote,
            isBarEndNote,
            type,
            dot,
            beam,
          } = itemData;

          if (itemData.rest) {
            // 空拍子
            // todo beam的连接
            obj.octave = 0;
            obj.pitch = 0;
            // obj.isGroupStartNote = true;
            // obj.isGroupEndNote = true;

            // if (itemData.dot) obj.dot = itemData.dot;
          } else {
            // 音符转换
            const {
              pitch: {
                octave,
                step,
              },
              notations,
              tie,
              accidental,
            } = itemData;
            // 一般属性转移
            obj.octave = Number(octave) - 4;
            obj.pitch = stepExchange(step);
            if (accidental) {
              obj.attachLeft = {
                type: accidental,
              };
            }

            if (beam) {
              obj.beam = beam;
              // 分组设定
              if (Array.isArray(beam)) {
                if (
                  beam
                    .filter(
                      beamData => beamData.value !== 'forward hook'
                      && beamData.value !== 'backward hook',
                    )
                    .every(beamData => beamData.value === 'end')
                ) {
                  obj.isGroupEndNote = true;
                } else if (
                  beam.filter(
                    beamData => beamData.value !== 'forward hook'
                      && beamData.value !== 'backward hook',
                  )
                    .every(beamData => beamData.value === 'begin')
                ) {
                  // obj.isGroupStartNote = true;
                }
              } else if (beam.value === 'begin') {
                // obj.isGroupStartNote = true;
              } else if (beam.value === 'end') {
                // obj.isGroupEndNote = true;
              }
            }
            // 音符链接处理
            if (notations) {
              if (!obj.arc) obj.arc = [];
              // console.log(notations);
              if (notations.slur) {
                if (notations.slur.attributes.type === 'start') {
                  obj.arc.push({
                    direction: 'start',
                    id: notations.slur.attributes.number,
                    type: 'slur',
                  });
                } else if (notations.slur.attributes.type === 'stop') {
                  obj.arc.push({
                    direction: 'stop',
                    id: notations.slur.attributes.number,
                    type: 'slur',
                  });
                }
              }

              if (notations.tied) {
                if (Array.isArray(notations.tied)) {
                  notations.tied.forEach(tieItem => getTie(tieItem, obj, globalParams))
                } else {
                  getTie(notations.tied, obj, globalParams);
                }
              }
            }

            if (tie) {
              // 和notation重复原因不明
            }
          }

          // 通用处理
          obj.noteDurationType = type;
          obj.duration = Number(itemData.duration);
          if (type === 'quarter' || (type === 'eighth' && !beam)) {
            // obj.isGroupStartNote = true;
            // obj.isGroupEndNote = true;
          }

          // if (['half', 'whole'].some(longType => type === longType)) {
          //   if (type === 'half') {
          //     if (dot) {
          //       obj.longDurationLine = 2;
          //     } else {
          //       obj.longDurationLine = 1;
          //     }
          //   } else if (type === 'whole') {
          //     obj.longDurationLine = 3;
          //   }
          //   // obj.isGroupStartNote = true;
          //   // obj.isGroupEndNote = true;
          // } else if (dot) {
          //   obj.dot = dot;
          // }

          // if (isBarStartNote) {
          //   obj.isBarStartNote = true;
          // }
          // if (isBarEndNote) {
          //   obj.isBarEndNote = true;
          // }
          obj.drawType = 'NOTE';
          obj.type = 'NOTE';

          onePartArray.push(obj);
        }

        if (itemData.name === 'barline') {
          if (itemData.ending) {
            if (!obj.part) obj.part = [];
            if (itemData.ending.attributes.type === 'start') {
              obj.part.push({
                type: 'start',
                partId: [itemData.ending.attributes.number],
                id: itemData.ending.attributes.number,
              });
            } else if (itemData.ending.attributes.type === 'stop') {
              obj.part.push({
                type: 'stop',
                partId: [itemData.ending.attributes.number],
                id: itemData.ending.attributes.number,
              });
              // idNum++;
            }
          }
          if (itemData.repeat) {
            if (itemData.repeat.attributes.direction === 'forward') {
              obj.barline = {
                type: 'BARLINE',
                drawType: 'BARLINE',
                musicType: 'RETURN_START_BAR',
                svgId: 'returnBarStart',
              };
            } else if (itemData.repeat.attributes.direction === 'backward') {
              Object.assign(obj, {
                type: 'BARLINE',
                drawType: 'BARLINE',
                musicType: 'RETURN_END_BAR',
                svgId: 'returnBarEnd',
              });
            }
          }

          if (itemData['bar-style'] === 'light-heavy') {
            Object.assign(obj, {
              type: 'BARLINE',
              drawType: 'BARLINE',
              musicType: 'END_BAR',
              svgId: 'endBar',
            });
          }

          if (index === measureData.length - 1) {
            onePartArray.push(Object.assign(obj, {
              drawType: 'BARLINE',
              type: 'BARLINE',
            }));
            console.log(onePartArray);
          } else {
            // 一开始就有barline 有可能有别的规则
            // onePartArray.push({
            //   type: 'BAR_START_FEATURE',
            //   ...obj,
            // });
          }
          // else {
          //   onePartArray.push({
          //     drawType: 'BARLINE',
          //   //   partStart:
          //   //   id: 123
          //   //   part:
          //   //     -
          //   //       1
          //   // type: 'BARLINE'
          //   // drawType: 'BARLINE'
          //   // musicType: 'RETURN_START_BAR'
          //   // svgId: "returnBarStart"
          //   });
          // }
        } else if (index === measureData.length - 1) {
          onePartArray.push({
            type: 'BARLINE',
            drawType: 'BARLINE',
          });
          // partsArray.push(itemData);
        }
      });
    });
    partsArray.push(onePartArray);
  });
  // console.log(partsArray);

  const result = {
    header: {
      title,
      songAuthor
    },
    // keyAndMeter: {
    //   text: '1=F',
    //   beatType: 4,
    //   beats: 4,
    //   divisions: 4,
    // },
    musicScores: partsArray.map(partData => ({
      something: '',
      score: partData,
    })),
  };
  console.log(result)
  return result;
});

export default transfer
