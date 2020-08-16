import React, { useState, useEffect } from 'react';
import { RootState } from 'src/redux';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import {
  addFilter,
  loadNewsletters,
  removeFilter,
  loading,
} from 'src/redux/modules/newsletter';

import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Tag from 'src/components/tags/Tag';
import { formatDate, unauthenticated } from 'src/utils/utils';
import TagSelector from '../../tags/TagSelector';
import { logout } from '../../../redux/modules/user';
import { loadTags } from '../../../redux/modules/tag';
import { Container, Spinner } from 'react-bootstrap';

const mapStateToProps = (state: RootState) => ({
  newsletters: state.newsletters,
  tags: state.tags,
  user: state.user,
  filters: state.newsletters.selectedFilters,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      loadNewsletters,
      addFilter,
      removeFilter,
      loadTags,
      loading,
      logout,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedNewsletterHistory: React.FC<PropsFromRedux> = ({
  newsletters,
  loadNewsletters,
  user,
  tags,
  filters,
  loadTags,
  addFilter,
  removeFilter,
  loading,
  logout,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [filteredNewsletters, setFilteredNewsletters] = useState<
    NewsletterLog[]
  >([]);

  const token = user.user.token;
  const org = user.user.org;

  useEffect(() => {
    if (!hasFetched && org) {
      loadNewsletters(token);
      loadTags(token, org.id);
      setHasFetched(true);
    }

    let filteredResults = newsletters.newsletters.filter((newsletter) =>
      newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (filters.length > 0) {
      filteredResults = filteredResults.filter((newsletter) => {
        let passes: boolean = true;
        filters.forEach((t) => {
          if (!newsletter.tags.some((tag) => tag.id === t.id)) {
            passes = false;
          }
        });
        return passes;
      });
    }
    setFilteredNewsletters(filteredResults);
  }, [
    hasFetched,
    newsletters,
    searchQuery,
    loadNewsletters,
    loadTags,
    filters,
    tags,
    org,
    token,
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (unauthenticated([newsletters.error.message, tags.error.message])) {
    loading();
    logout();
  }

  const spinner = (
    <Container id="contacts-spinner">
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Container>
  );

  let page_id = 'content';
  if (newsletters.loading || tags.loading) {
    page_id = 'faded';
  }

  return (
    <div className="d-flex flex-row">
      <section
        id={page_id}
        className="d-flex flex-column w-25 shadow-sm vh-100 bg-white align-items-center">
        <div className="d-flex flex-column my-5 mx-3 justify-content-center">
          <Form className="mr-3 mb-3 ">
            <FormControl
              type="text"
              placeholder="Search newsletter title"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Form>
          <span className="black-500 mt-3">Filter by</span>
          <TagSelector
            tags={tags.tags}
            selectedTags={filters}
            addTag={addFilter}
            removeTag={removeFilter}
            token={token}
            orgId={org ? org.id : null}
          />
        </div>
      </section>

      <section id={page_id} className="d-flex flex-column m-5 w-100">
        <div className="d-flex flex-row justify-content-between">
          <span className="p2 mb-3">Newsletters</span>
          <div>
            <Link to="/newsletter/create" className="btn btn-outline-primary">
              Create newsletter
            </Link>
          </div>
        </div>

        {newsletters.loading && spinner}

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
                    <td>
                      {newsletter.estimatedArrival
                        ? formatDate(newsletter.estimatedArrival)
                        : 'There was a problem estimating the arrival date.'}
                    </td>
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
