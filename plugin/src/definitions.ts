declare module '@capacitor/core' {
  interface PluginRegistry {
    Plugin: PluginPlugin;
  }
}

export interface PluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
