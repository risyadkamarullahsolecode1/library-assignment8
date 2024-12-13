import React,{useState, useEffect} from 'react';
import { Container, Button, Table, ListGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookList from '../organisms/BookList';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import BookService from '../../service/BookService';

const fetchBooks = async ({ page, pageSize,  sortField, sortOrder }) => {
    const { data } = await BookService.search({
      PageNumber: page,
      PageSize: pageSize,
      SortBy: sortField,
      SortOrder : sortOrder
    });
    return data;
  };

const BookManagemets = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const pageSizes = [3, 6, 9];
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

//   useEffect(() => {
//     // Fetch books from API
//     apiClient.get('/Book')
//       .then((response) => {
//         setBooks(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError("Failed to load books.");
//         setLoading(false);
//       });
//   }, []);

  // Use react-query to fetch the data with page and pageSize
  const { data, isLoading, isError } = useQuery({
    queryKey: ['books', page, pageSize, sortField, sortOrder],
    queryFn: () => fetchBooks({ page, pageSize, sortField, sortOrder }),
    keepPreviousData: true,
    onSuccess: (data) => {
        console.log(data); // Log the data to inspect its structure
      },
    placeholderData: keepPreviousData
  });

  // Check if the data is loading or error occurred
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching posts</p>;

  // Ensure data exists and has the structure we expect
  const pageCount = Math.ceil(data.total / pageSize);

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1); // Reset to page 1 when page size changes
  };

  // Handle page click for pagination
  const handlePageClick = ({ selected }) => {
    setPage(selected + 1); // React-Paginate uses 0-based index
  };

  const handleSort = (field) => {
    if (field === sortField) {  
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); 
    } else {
    setSortField(field);
    setSortOrder('asc');
    } 
  };
  // Get sort icon

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <Container>
      <h1>Books</h1>
      <Link to="/books/search">
        <Button variant="primary" className="mb-3">
            <FontAwesomeIcon icon={faMagnifyingGlass}/> Search
        </Button>
      </Link>
      <Link to="/books/add">
        <Button variant="primary" className="mb-3">Add New Book</Button>
      </Link>

      <Table bordered hover responsive>
            <thead>
                <tr>
                    <th style={{ width: '80px' }}>
                        <Button variant="link"
                        onClick={() => handleSort('id')}
                        className="text-decoration-none text-dark p-0">
                        ID {getSortIcon('id')}
                        </Button>
                    </th>
                    <th style={{ width: '80px' }}>
                        <Button variant="link"
                        onClick={() => handleSort('author')}
                        className="text-decoration-none text-dark p-0">
                        Author {getSortIcon('author')}
                        </Button>
                    </th>
                    <th style={{ width: '80px' }}>
                        <Button variant="link"
                        onClick={() => handleSort('title')}
                        className="text-decoration-none text-dark p-0">
                        Title {getSortIcon('title')}
                        </Button>
                    </th>
                </tr>
            </thead>
      </Table>

      <ListGroup className="mb-4">
        {data?.data?.map((book) => (
          <ListGroup.Item key={book.id}>
            {book.id}. the book title is {book.title} by {book.author} with category {book.category}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Container className="mt-3">
        {"Items per Page: "}
        <Form.Select onChange={handlePageSizeChange} value={pageSize}>
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Form.Select>
      </Container>

      
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
      <BookList 
      />
    </Container>
  );
};

export default BookManagemets;