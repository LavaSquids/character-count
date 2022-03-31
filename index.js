import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

const Constants = getModule(m => m.API_HOST);
const { canUseIncreasedMessageLength } = getModule(m => m.canUseIncreasedMessageLength);
const { getCurrentUser } = getModule(m => m.getCurrentUser && m.getUser);

const { characterCount, error, flairContainer } = getModule('characterCount', 'upsell');

export default class CharacterCount extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    patch(getModule(m => m.default?.displayName === 'SlateCharacterCount'), 'default', args => {
      const { textValue } = args[0];
      const currentCharacterCount = textValue.length;
      const maxCharacterCount = canUseIncreasedMessageLength(getCurrentUser()) ? Constants.MAX_MESSAGE_LENGTH_PREMIUM : Constants.MAX_MESSAGE_LENGTH;

      const className = currentCharacterCount > maxCharacterCount ? `${characterCount} ${error} CC-Container` : `${characterCount} CC-Container`;

      return <div className={className}><div className={`${flairContainer} CC-Count`}>{`${currentCharacterCount}/${maxCharacterCount}`}</div></div>;
    });
  }
}
