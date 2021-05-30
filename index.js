import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch, unpatchAll } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default class extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    patch(getModule(m => m?.default?.displayName === 'SlateCharacterCount'), 'default', (args, res) => {
      return <div className={`${getModule('characterCount', 'upsell').characterCount} characterCount`}>{`${args[0].currentLength}/${args[0].maxCharacterCount}`}</div>;
    });
  }

  stop () {
    unpatchAll();
  }
}
