import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Card,
  Checkbox
} from 'semantic-ui-react'

import { createBook, deleteBook, getBooks, patchBook } from '../api/books-api'
import Auth from '../auth/Auth'
import { Book } from '../types/Book'
import ModalExampleModal from '../components/utils/Modal'
import dateFormat from 'dateformat'

interface BooksProps {
  auth: Auth
  history: History
}

interface BooksState {
  books: Book[]
  newBookName: string
  newAuthor: string
  newDescription: string
  loadingBooks: boolean
  isSaving: boolean
}

export class Books extends React.PureComponent<BooksProps, BooksState> {
  state: BooksState = {
    books: [],
    newBookName: '',
    newAuthor: '',
    newDescription: '',
    loadingBooks: true,
    isSaving: false
  }

  handleAddButtonClick = () => {
    this.setState({
      ...this.state,
      newBookName: '',
      newAuthor: '',
      newDescription: ''
    })
  }

  handleBookNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookName: event.target.value })
  }

  handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAuthor: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value })
  }

  onEditButtonClick = (bookId: string) => {
    this.props.history.push(`/books/${bookId}/edit`)
  }

  onBookCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    this.setState({ isSaving: true })
    try {
      const newBook = await createBook(this.props.auth.getIdToken(), {
        bookName: this.state.newBookName,
        author: this.state.newAuthor,
        description: this.state.newDescription
      })
      this.setState({
        books: [...this.state.books, newBook],
        newBookName: '',
        newAuthor: '',
        newDescription: '',
        isSaving: false
      })
      alert('Book Created Successfully')
    } catch (e) {
      this.setState({ isSaving: false })
      let errorMessage = 'Book creation failed'
      if (e instanceof Error) {
        errorMessage = `Book creation failed: ${e.message}`
      }
      alert(errorMessage)
    }
  }

  onBookDelete = async (bookId: string) => {
    try {
      await deleteBook(this.props.auth.getIdToken(), bookId)
      this.setState({
        books: this.state.books.filter((book) => book.bookId !== bookId)
      })
      alert('Book Deleted Successfully')
    } catch (e) {
      let errorMessage = 'Book deletion failed'
      if (e instanceof Error) {
        errorMessage = `Book deletion failed: ${e.message}`
      }
      alert(errorMessage)
    }
  }

  onBookCheck = async (pos: number) => {
    try {
      const book = this.state.books[pos]
      await patchBook(this.props.auth.getIdToken(), book.bookId, {
        bookName: book.bookName,
        author: book.author,
        description: book.description,
        read: !book.read
      })
      this.setState({
        books: update(this.state.books, {
          [pos]: { read: { $set: !book.read } }
        })
      })
    } catch (e) {
      let errorMessage = 'Book deletion failed'
      if (e instanceof Error) {
        errorMessage = 'Book deletion failed' + e.message
      }
      alert(errorMessage)
    }
  }

  async componentDidMount() {
    try {
      const books = await getBooks(this.props.auth.getIdToken())
      this.setState({
        books,
        loadingBooks: false
      })
    } catch (e) {
      let errorMessage = 'Failed to fetch books'
      if (e instanceof Error) {
        errorMessage = `Failed to fetch books: ${e.message}`
      }
      alert(errorMessage)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">My Books Collection</Header>

        <ModalExampleModal
          buttonMessage={'Add Book'}
          handleBookNameChange={this.handleBookNameChange}
          handleAuthorChange={this.handleAuthorChange}
          handleDescriptionChange={this.handleDescriptionChange}
          onBookCreate={this.onBookCreate}
          isSaving={this.state.isSaving}
          newBookName={this.state.newBookName}
          newAuthor={this.state.newAuthor}
          newDescription={this.state.newDescription}
          handleAddButtonClick={this.handleAddButtonClick}
        />

        <hr />

        {this.renderBooks()}
      </div>
    )
  }

  renderBooks() {
    if (this.state.loadingBooks) {
      return this.renderLoading()
    }

    return this.renderBooksList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading BOOKs
        </Loader>
      </Grid.Row>
    )
  }

  renderBooksList() {
    return (
      <Grid columns={4}>
        {this.state.books.map((book, pos) => (
          <Grid.Column key={book.bookId} width={4}>
            <Card>
              {book.attachmentUrl && (
                <Image src={book.attachmentUrl} wrapped ui={false} />
              )}
              <Card.Content>
                <Card.Header>
                  {book.bookName}
                  <div style={{ float: 'right' }}>
                    <Checkbox
                      floated="right"
                      label={{ children: book.read ? 'Read' : 'To Read' }}
                      onChange={() => this.onBookCheck(pos)}
                      checked={book.read}
                    />
                  </div>
                </Card.Header>
                <Card.Meta>
                  <span className="date">
                    Added On {dateFormat(book.addedOn, 'dd-mm-yyyy')}
                  </span>
                </Card.Meta>
                <Card.Description>{book.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui two buttons">
                  <Button
                    icon
                    labelPosition="left"
                    color="teal"
                    onClick={() => this.onEditButtonClick(book.bookId)}
                  >
                    Edit
                    <Icon name="pencil" />
                  </Button>
                  <Button
                    labelPosition="right"
                    icon
                    color="red"
                    onClick={() => this.onBookDelete(book.bookId)}
                  >
                    Delete
                    <Icon name="trash" />
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}
      </Grid>
    )
  }
}
