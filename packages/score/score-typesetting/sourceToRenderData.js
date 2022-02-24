/*
可能出现的key
{
  duration: num,
  isFirstNote: bool,
  isBarStartNote: bool,
  arcStart: object,
  isBarEndNote: bool,
  isBarEndNote: bool,
  isGroupStartNote: bool,
  isGroupEndNote: bool,
  dot: bool,
  drawType: string
}
*/
import { Map } from 'immutable';
import { Type } from 'score-config/constValue';
import chunkScore from './chunkScore';

// 从note开始归属到note元素，第一个不是note的归属到剩余元素，

function deleteKeys(mapData, keys) {
  keys.forEach((key) => {
    if (mapData.get(key)) {
      mapData = mapData.delete((key));
    }
  });
  return mapData;
}

// 设置小节的一些参数
export default function sourceBar(barArray, keyAndMeter, types) {
  console.log(barArray);
  // 只有一个startF
  if (barArray.size === 1) return barArray;
  const setKeyBool = (index, keys, value) => {
    barArray = barArray.updateIn([index, 'originData'], originData => originData.merge(Map(
      keys.reduce((prev, curr) => ({
        [curr]: typeof value === 'boolean' ? value : true, ...prev,
      }), {}),
    )));
  };

  const sourceMethod = {
    groupDiv() {
      let totalDuration = 0;

      const groupDuration = keyAndMeter.divisions;

      const startFeature = barArray.get(0);
      // 取除第一个后面的
      barArray = barArray.rest();
      // 设置头尾
      barArray = barArray.map(data => data.update('originData', originData => deleteKeys(originData, [
        'isBarEndNote',
        'isGroupEndNote',
        'isBarStartNote',
        'isGroupStartNote',
        'isRowFirst',
        'isRowLast',
      ])));
      setKeyBool(0, ['isBarStartNote', 'isGroupStartNote']);
      setKeyBool(barArray.size - 1, ['isGroupEndNote', 'isBarEndNote']);

      for (let i = 0; i < barArray.size; i++) {
        let data = barArray.getIn([i, 'originData']);
        let hasNext = i + 1 < barArray.size;
        // 设置非note
        if (data.get('type') !== Type.NOTE) {
          if (data.get('type') === Type.SYMBOL) {
            setKeyBool(i, ['isGroupStartNote', 'isGroupEndNote']);
          }
          // 前后都设置group
          if (i - 1 >= 0) {
            setKeyBool(i - 1, ['isGroupEndNote']);
          }
          if (hasNext) {
            setKeyBool(i + 1, ['isGroupStartNote']);
          }
          // 不是note的跳过，充值totoalDuration
          totalDuration = 0;
          continue;
        }

        /*
          在这先瞅一眼，举个例子：如果4/4的情况下，
          前面是带个附点的3/8，后面即便是1/8也要自己一伙，
          满足不是小节第一个，前面是个附点，自己还不大于1/4。
        */
        if (
          !data.get('isBarStartNote')
          && data.get('duration') <= (groupDuration / 2)
          && ((groupDuration * 1.5) === barArray.getIn([i - 1, 'originData', 'duration']))
        ) {
          // 瞅一眼自己和附点是不是连在一起的，也许附点和前面的1/8连着呢，就不管了
          // 从前一个到小节开始的时长
          let presentBarDuration = 0;

          presentBarDuration = barArray.take(i + 1).reduce((prev, curr) => prev + curr.getIn(['originData', 'duration']), 0);
          // 发现自己连着呢，自己设为开始,这次不往前了，从自己向后找，划分1/8一组
          if (presentBarDuration % groupDuration !== 0) {
            data.isGroupStartNote = true;
            // 这里的循环条件已经确定了i不会超出长度
            for (let loopIndex = i, loopTotalDuration = 0; loopIndex < barArray.size; loopIndex++) {
              const nextNote = loopIndex + 1 <= barArray.size ? barArray.get(loopIndex + 1) : null;

              if (!nextNote) {
                setKeyBool(loopIndex, ['isGroupEndNote']);
              }
              const nowNote = barArray.getIn([loopIndex, 'originData']);

              loopTotalDuration += nowNote.get('duration');

              if (loopTotalDuration === groupDuration / 2) {
                setKeyBool(loopIndex, ['isGroupEndNote']);

                if (nextNote) {
                  setKeyBool(loopIndex + 1, ['isGroupStartNote']);
                }
                break;
              } else if (loopTotalDuration > groupDuration / 2) {
                // 如果和下一个加起来大于1/4，设前一个end设置现在为start, i - 1不会超出长度
                setKeyBool(loopIndex, ['isGroupStartNote']);
                setKeyBool(loopIndex - 1, ['isGroupEndNote']);
                i = loopIndex;
                break;
              }
            }
          }
          data = barArray.getIn([i, 'originData']);
          hasNext = i + 1 < barArray.size;
        }

        totalDuration += data.get('duration');

        const nextDuration = hasNext ? barArray.getIn([i + 1, 'originData', 'duration']) : 0;

        // 总duration大于等于1/4设置结束，下一个开始
        const isPresentGroupEndAndNextStart = (
          totalDuration >= groupDuration
          || (totalDuration + nextDuration) > groupDuration
        );

        if (isPresentGroupEndAndNextStart) {
          totalDuration = 0;
          setKeyBool(i, ['isGroupEndNote']);

          if (hasNext) {
            setKeyBool(i + 1, ['isGroupStartNote']);
          }
        }
      }
      barArray = barArray.unshift(startFeature);
      return barArray;
    },
    checkBarDurationFull() {
      const totalDuration = barArray.reduce((prev, curr) => {
        const duration = curr.getIn(['originData', 'duration']);
        if (duration) {
          prev += duration;
        }
        return prev;
      }, 0);

      setKeyBool(0, ['isBarDurationStandard'], totalDuration === keyAndMeter.divisions * keyAndMeter.beatType);
    },
    // 单独设置note应该放在前面，不然drawNote无法设置相应的值
    // makeNoteTypeFeature() {
    //   barArray = barArray.map((data) => {
    //     // debugger;
    //     const originData = data.get('originData');
    //     switch (originData.get('noteDurationType')) {
    //     // case '64th':
    //     //   return data.setIn(['originData', 'underlineNum'], 4);
    //     // case '32nd':
    //     //   return data.setIn(['originData', 'underlineNum'], 3);
    //     // case '16th':
    //     //   return data.setIn(['originData', 'underlineNum'], 2);
    //     // case 'eighth':
    //     //   return data.setIn(['originData', 'underlineNum'], 1);
    //     case 'half':
    //       return data.setIn(['originData', 'longDurationLine'], 2);
    //     case 'whole':
    //       return data.setIn(['originData', 'longDurationLine'], 3);
    //     default:
    //       return data;
    //     }
    //   });
    //   console.log(barArray);
    // },
  };

  if (types) {
    Object.keys(sourceMethod).filter(key => types.some(type => type === key)).forEach((key) => {
      sourceMethod[key]();
    });
  } else {
    Object.keys(sourceMethod).forEach((key) => {
      sourceMethod[key]();
    });
  }
  return barArray;
}

export function sourceAllLine(score, keyAndMeter) {
  console.log(score);
  const { noteList, barList } = chunkScore(score);
  const sourcedList = noteList.map(barArray => sourceBar(barArray, keyAndMeter));
  // 小节和小节线数相等
  if (noteList.size === barList.size) {
    console.log('sourced', sourcedList.interleave(barList).flatten(true));

    return sourcedList.interleave(barList).flatten(true);
  }
  // 小节线比小节多，忘了为什么了。。。有了startFeature之后走不到这里了
  // if (noteList.size < barList.size) {
  //   return sourcedList
  //     .interleave(barList.slice(1))
  //     .unshift(barList.get(0))
  //     .flatten(true);
  // }
  // 小节比小节线多, 刚开始写没有小节线,或者后面小节线还没输入
  if (noteList.size > barList.size) {
    let result = null;
    if (sourcedList.size > 1) {
      let prevList = sourcedList.slice(0, sourcedList.size - 1);
      result = prevList.interleave(barList).flatten(true).concat(sourcedList.get(sourcedList.size - 1));
    } else {
      result = sourcedList.flatten(true);
    }

    console.log('sourced', result);
    return result;
  }
  throw new Error('chunk error');
  // return sourcedList.flatten(true);
}
