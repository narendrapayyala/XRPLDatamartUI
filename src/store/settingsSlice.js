import { createSlice } from '@reduxjs/toolkit';
import SettingsConfig from '../configurations/settingsConfig';
import _ from '../configurations/@lodash';
import LayoutConfigs from '../components/layout/LayoutConfig';

function getInitialSettings() {
  const defaultLayoutStyle =
    SettingsConfig.layout && SettingsConfig.layout.style ? SettingsConfig.layout.style : 'layout1';
  const layout = {
    style: defaultLayoutStyle,
    config: LayoutConfigs.defaults
  };
  return _.merge({}, { layout }, SettingsConfig);
}

export function generateSettings(_defaultSettings, _newSettings) {
  const response = _.merge(
    {},
    _defaultSettings,
    _newSettings && _newSettings.layout && _newSettings.layout.style
      ? {
          layout: {
            config: LayoutConfigs.defaults
          }
        }
      : {},
    _newSettings
  );

  return response;
}

const initialSettings = getInitialSettings();

const initialState = {
  initial: initialSettings,
  defaults: _.merge({}, initialSettings),
  current: _.merge({}, initialSettings)
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action) => {
      const current = generateSettings(state.defaults, action.payload);
      return {
        ...state,
        current
      };
    },
    setDefaultSettings: (state, action) => {
      const defaults = generateSettings(state.defaults, action.payload);
      return {
        ...state,
        defaults: _.merge({}, defaults),
        current: _.merge({}, defaults)
      };
    },
    setInitialSettings: () => _.merge({}, initialState),
    resetSettings: (state) => ({
      ...state,
      defaults: _.merge({}, state.defaults),
      current: _.merge({}, state.defaults)
    })
  }
});

export const { resetSettings, setDefaultSettings, setInitialSettings, setSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
