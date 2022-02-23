export default {
  past: [],
  futrue: [],
  present: undefined,
  hasRecord(type) {
    return this[type].length > 0;
  },
  hasPresent() {
    return this.present !== undefined;
  },
  setPresent(state) {
    this.present = state;
  },
  movePresentToPast() {
    this.past.push(this.present);
  },
  push(currentState) {
    if (this.hasPresent()) {
      this.past.push(this.present);
    }
    this.setPresent(currentState);
  },
  getIndex() {
    return this.past.length;
  },
  undo() {
    if (this.hasRecord('past')) {
      this.gotoState(this.getIndex() - 1);
    }
  },
  redo() {
    if (this.hasRecord('futrue')) {
      this.gotoState(this.getIndex() + 1);
    }
  },
  gotoState(i) {
    const index = i * 1;
    const allState = [...this.past, this.present, ...this.futrue];
    this.present = allState[index];
    this.past = allState.slice(0, index);
    this.futrue = allState.slice(index + 1, allState.length);
  },
};
