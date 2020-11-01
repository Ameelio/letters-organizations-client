import React, { useState, useEffect, UIEvent } from 'react';
import { RootState } from 'src/redux';
import Table from 'react-bootstrap/Table';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import './index.css';
import { Container, Spinner } from 'react-bootstrap';
import { loadLetterDrafts } from 'src/redux/modules/volunteer';

const mapStateToProps = (state: RootState) => ({
  user: state.user,
  drafts: state.volunteers.drafts,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ loadLetterDrafts }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedDrafts: React.FC<PropsFromRedux> = ({
  loadLetterDrafts,
  user,
  drafts,
}) => {
  const [hasFetchedData, setHasFetchedData] = useState<boolean>(false);

  const { token } = user.user;
  const { org } = user.user;

  useEffect(() => {
    if (!hasFetchedData && org) {
      loadLetterDrafts(token, org.id);
      setHasFetchedData(true);
    }
  }, [hasFetchedData, org, loadLetterDrafts, token]);

  const spinner = (
    <Container id="contacts-spinner">
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Container>
  );

  return (
    <div className="d-flex flex-row">
      <section id={'content'} className="d-flex flex-column m-5 w-100">
        <div className="d-flex flex-row justify-content-between">
          <span className="p2 mb-3">Drafts</span>
        </div>

        <div
          id="tableDiv"
          className="vh-100 w-100 shadow-sm p-5 bg-white overflow-auto">
          <Table responsive hover>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((draft) => {
                return (
                  <tr>
                    <td>{draft.first_name + ' ' + draft.last_name}</td>
                    <td>{draft.content}</td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default connector(UnconnectedDrafts);
