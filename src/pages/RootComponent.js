import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import history from '../configurations/@history';

const RootComponent = () => {
  const auth = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    if (auth.loginStatus) {
      history.push('/home');
    } else {
      history.push('/dashboard');
    }
  }, [auth]);

  return <></>;
};

export default RootComponent;
