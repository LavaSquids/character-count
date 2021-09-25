import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
const { user, constants: { Constants } } = require('@vizality/discord');
import { getModule } from '@vizality/webpack';

const { characterCount, error, flairContainer } = getModule('characterCount', 'upsell');

export default class extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    patch(getModule(m => m.default?.displayName === 'SlateCharacterCount'), 'default', (args, res) => {
      const { currentLength, maxCharacterCount } = args[0];

      const className = currentLength > maxCharacterCount ? `${characterCount} ${error} CC-Container` : `${characterCount} CC-Container`;

      return <div className={className}><div className={`${flairContainer} CC-Count`}>{`${currentLength}/${maxCharacterCount}`}</div></div>;
    });

    patch(getModule(m => m.displayName === 'MessageEditor').prototype, 'render', (args, res) => {
      const { children } = res.props;

      const CurrentLength = children[0].props.textValue.length;
      const MaxMessageLength = user.getCurrentUser().premiumType === 2 ? Constants.MAX_MESSAGE_LENGTH_PREMIUM : Constants.MAX_MESSAGE_LENGTH;

      const className = CurrentLength > MaxMessageLength ? `${characterCount} ${error} CC-EditCount` : `${characterCount} CC-EditCount`;

      children.push(<div className={className}><div className={flairContainer}>{`${CurrentLength}/${MaxMessageLength}`}</div></div>);

      return res;
    });
  }
}
