import { Record, List } from 'immutable';

const noteRecord = Record({
  octave: 0,
  noteDurationType: 'eighth',
  duration: 2,
  drawType: 'NOTE',
  type: 'NOTE',
  dot: false,
});

const editRecord = Record({
  noteState: null,
});

class noteState extends editRecord {

}

export default new noteState({
  noteState: noteRecord(),
});
