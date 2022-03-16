import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../loading';

const Suspense = (props) => {
  const { loadingProps, children } = props;

  return <React.Suspense fallback={<Loading {...loadingProps} />}>{children}</React.Suspense>;
};

Suspense.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  loadingProps: PropTypes.object
};

Suspense.defaultProps = {
  loadingProps: {
    delay: 0
  }
};

export default Suspense;
