import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch, unpatchAll } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

const { getCurrentUser } = getModule('getCurrentUser');
const { MAX_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH_PREMIUM } = getModule('MAX_MESSAGE_LENGTH');

export default class extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    patch(getModule(m => m?.default?.displayName === 'SlateCharacterCount'), 'default', (args, res) => {
      return <div className={`${getModule('characterCount', 'upsell').characterCount} characterCount`}>{`${args[0].currentLength}/${args[0].maxCharacterCount}`}</div>;
    });

    patch(getModule(m => m?.displayName === 'MessageEditor').prototype, 'render', (args, res) => {
      const { children } = res.props;
      const MaxMessageLength = getCurrentUser().premiumType === 2 ? MAX_MESSAGE_LENGTH_PREMIUM : MAX_MESSAGE_LENGTH;

      children.push(<div className={`${getModule('characterCount', 'upsell').characterCount} editCharacterCount`}>{`${children[0].props.textValue.length}/${MaxMessageLength}`}</div>);
      return res;
    });
  }

  stop () {
    unpatchAll();
  }
}
