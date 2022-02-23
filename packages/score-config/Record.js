import { Record } from 'immutable';

export const normalSvg = Record({
  width: 0,
  height: 0,
  x: null,
  y: null,
}, 'normalSvg');

export const noteRecord = Record({
  width: 0,
  height: 0,
  x: null,
  y: null,
  noteCenter: null,
  dot: null,
  longDurationLine: null,
});


// export const NoteSvgData = new noteRecord({
//   noteCenter: new normalSvg({}),
// });

export class NoteSvgData extends noteRecord {
  // get a() {
  //   console.log(this.noteCenter);
  //   return this.noteCenter.x + this.noteCenter.y;
  // }
}

// const test = new NoteSvgData({ noteCenter: new normalSvg({
//   x: 1,
//   y: 2,
// }) });

// console.log(test);
// console.log(test.a);
