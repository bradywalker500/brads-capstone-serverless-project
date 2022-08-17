import React from 'react'
import {
  Button,
  Modal,
  Input,
  Grid,
  Icon
} from 'semantic-ui-react'

function ModalExampleModal(props: any) {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button
          onClick={() => props.handleAddButtonClick()}
          icon
          labelPosition="right"
          primary
        >
          {props.buttonMessage}
          <Icon name="plus" />
        </Button>
      }
    >
      <Modal.Header>Add Book</Modal.Header>
      <Modal.Content>
        <Grid>
          <Grid.Column width={8}>
            <Input
              fluid
              label="Book Name"
              onChange={props.handleBookNameChange}
              value={props.newBookName}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Input
              fluid
              label="Author"
              onChange={props.handleAuthorChange}
              value={props.newAuthor}
            />
          </Grid.Column>
          <Grid.Column width={16}>
            <Input
              fluid
              label="Description"
              onChange={props.handleDescriptionChange}
              value={props.newDescription}
            />
          </Grid.Column>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          loading={props.isSaving}
          content="Save"
          labelPosition="right"
          icon="checkmark"
          onClick={() => props.onBookCreate()}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default ModalExampleModal
