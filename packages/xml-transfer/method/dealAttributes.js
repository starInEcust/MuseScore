export const getTie = (tied, obj, globalParams) => {
  if (tied.attributes.type === 'start') {
    obj.arc.push({
      direction: 'start',
      type: 'tie',
      id: globalParams.idNum,
    });
  } else if (tied.attributes.type === 'stop') {
    obj.arc.push({
      direction: 'stop',
      type: 'tie',
      id: globalParams.idNum,
    });
    globalParams.idNum++;
  }
}