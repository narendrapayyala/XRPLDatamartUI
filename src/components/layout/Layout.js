import { useContext, useCallback, useRef, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles';
import AppContext from '../AppContext';
import { generateSettings, setSettings } from '../../store/settingsSlice';
import _ from '../../configurations/@lodash';
import { useDeepCompareEffect } from '../hooks';
import Layouts from './Layouts';

const useStyles = makeStyles((theme) => ({
  '@global': {
    'code:not([class*="language-"])': {
      color: theme.palette.secondary.dark,
      backgroundColor:
        theme.palette.type === 'light' ? 'rgba(255, 255, 255, .9)' : 'rgba(0, 0, 0, .9)',
      padding: '2px 3px',
      borderRadius: 2,
      lineHeight: 1.7
    },
    'table.simple tbody tr td': {
      borderColor: theme.palette.divider
    },
    'table.simple thead tr th': {
      borderColor: theme.palette.divider
    },
    'a:not([role=button])': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    'a.link, a:not([role=button])[target=_blank]': {
      background: alpha(theme.palette.secondary.main, 0.2),
      color: 'inherit',
      borderBottom: `1px solid ${theme.palette.divider}`,
      textDecoration: 'none',
      '&:hover': {
        background: alpha(theme.palette.secondary.main, 0.3),
        textDecoration: 'none'
      }
    },
    '[class^="border-"]': {
      borderColor: theme.palette.divider
    },
    '[class*="border-"]': {
      borderColor: theme.palette.divider
    },
    hr: {
      borderColor: theme.palette.divider
    }
  },
  root: {
    backgroundColor: theme.palette.background.grey,
    color: theme.palette.text.primary
  }
}));
const Layout = (props) => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings.current);
  const defaultSettings = useSelector((state) => state.settings.defaults);

  const appContext = useContext(AppContext);
  const { routes } = appContext;
  const classes = useStyles(props);
  const location = useLocation();
  const matched = matchRoutes(routes, location.pathname)[0];
  const newSettings = useRef(null);

  const shouldAwaitRender = useCallback(() => {
    let _newSettings;

    if (matched && matched.route.settings) {
      const routeSettings = matched.route.settings;

      _newSettings = generateSettings(defaultSettings, routeSettings);
    } else if (!_.isEqual(newSettings.current, defaultSettings)) {
      _newSettings = _.merge({}, defaultSettings);
    } else {
      _newSettings = newSettings.current;
    }

    if (!_.isEqual(newSettings.current, _newSettings)) {
      newSettings.current = _newSettings;
    }
  }, [defaultSettings, matched]);

  shouldAwaitRender();

  useDeepCompareEffect(() => {
    if (!_.isEqual(newSettings.current, settings)) {
      dispatch(setSettings(newSettings.current));
    }
  }, [dispatch, newSettings.current, settings]);

  const LayoutExt = useMemo(() => Layouts[settings.layout.style], [settings.layout.style]);

  return _.isEqual(newSettings.current, settings) ? (
    <LayoutExt classes={{ root: classes.root }} {...props} />
  ) : null;
};

export default memo(Layout);
