import React, { useState, useEffect } from 'react';
import { RootState } from 'src/redux';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { loadNewsletters } from 'src/redux/modules/newsletter';

import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Tag from 'src/components/tags/Tag';
import { formatDate } from 'src/utils/utils';

const mapStateToProps = (state: RootState) => ({
  newsletters: state.newsletters.newsletters,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ loadNewsletters }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedNewsletterHistory: React.FC<PropsFromRedux> = ({
  newsletters,
  loadNewsletters,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [filteredNewsletters, setFilteredNewsletters] = useState<
    NewsletterLog[]
  >([]);

  useEffect(() => {
    if (!hasFetched) {
      loadNewsletters();
      setHasFetched(true);
    }

    const filteredResults = newsletters.filter((newsletter) =>
      newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredNewsletters(filteredResults);
  }, [hasFetched, newsletters, searchQuery, loadNewsletters]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="d-flex flex-row">
      <section className="d-flex flex-column w-25 shadow-sm vh-100 bg-white align-items-center">
        <div className="d-flex flex-column my-5 mx-3 justify-content-center">
          <Form className="mr-3 mb-3 ">
            <FormControl
              type="text"
              placeholder="Search newsletter title"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Form>
        </div>
      </section>

      <section className="d-flex flex-column m-5 w-100">
        <div className="d-flex flex-row justify-content-between">
          <span className="p2 mb-3">Newsletters</span>
          <div>
            <Link to="/newsletter/create" className="btn btn-outline-primary">
              Create newsletter
            </Link>
          </div>
        </div>

        <div className="vh-100 w-100 shadow-sm p-5 bg-white overflow-auto">
          <Table responsive hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Delivered</th>
                <th>In Transit</th>
                <th>Returned</th>
                <th>Estimated Arrival</th>
                <th>Tags</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {filteredNewsletters &&
                filteredNewsletters.map((newsletter) => (
                  <tr key={newsletter.id}>
                    <td>{newsletter.title}</td>
                    <td>{newsletter.delivered}</td>
                    <td>{newsletter.inTransit}</td>
                    <td>{newsletter.returned}</td>
                    <td>{formatDate(newsletter.estimatedArrival)}</td>
                    <td className="d-flex flex-column">
                      {newsletter.tags.map((tag, index) => (
                        <div className="mb-3" key={index}>
                          <Tag label={tag.label} />
                        </div>
                      ))}
                    </td>
                    <td>
                      <a
                        href={newsletter.fileLink}
                        target="_blank"
                        rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default connector(UnconnectedNewsletterHistory);
