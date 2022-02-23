import Mousetrap from 'mousetrap';
import { Map } from 'immutable';

export const keyState = {
  isPressCmd: false,
};

export const noteState = {
  octave: 0,
  noteType: 'eighth',
};

export default function (stage, actions) {
  console.log(actions);
  // add duration
  Mousetrap.bind('=', (e, combo) => {
    actions.changeDuration('+');
  });
  Mousetrap.bind('-', (e, combo) => {
    actions.changeDuration('-');
    console.log(combo); // logs 'ctrl+shift+up'
  });
  Mousetrap.bind('\\', (e, combo) => {
    actions.addBarline();
  });
  Mousetrap.bind('shift+=', () => {
    actions.changeOctave('+');
  });
  Mousetrap.bind('shift+-', () => {
    actions.changeOctave('-');
  });
  Mousetrap.bind('mod', () => {
    keyState.isPressCmd = false;
  }, 'keydown');

  Mousetrap.bind('right', () => {
    console.log('right');
  });

  Mousetrap.bind('backspace', () => {
    console.log('backspace');
    actions.deleteNote();
  });

  Mousetrap.bind(['1', '2', '3', '4', '5', '6', '7'], (e, combo) => {
    console.log(combo);
    const note = Map({
      pitch: Number(combo),
    });
    actions.addNote({ note });
  });
}
