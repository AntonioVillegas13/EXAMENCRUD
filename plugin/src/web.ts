import { WebPlugin } from '@capacitor/core';
import { PluginPlugin } from './definitions';

export class PluginWeb extends WebPlugin implements PluginPlugin {
  constructor() {
    super({
      name: 'Plugin',
      platforms: ['web'],
    });
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}

const Plugin = new PluginWeb();

export { Plugin };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(Plugin);
