import React from 'react';
import { RootState } from '../../../redux';

import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  tags: state.tags.tags,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({}, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedContacts: React.FC<PropsFromRedux> = ({ tags }) => {
  return (
    <div>
      <section className="w-25 shadow-sm"></section>

      <section></section>
    </div>
  );
};

export default connector(UnconnectedContacts);
