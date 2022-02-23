import store from 'score-store';
import onSetCursor from './setCursor';
import onKeyborad from './keyborad';

export default function (stage, actions) {
  onSetCursor(stage, actions, store);
  onKeyborad(stage, actions, store);
}
