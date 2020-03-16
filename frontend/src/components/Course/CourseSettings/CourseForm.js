import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'semantic-ui-react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { semesterOptions } from "../../../utils/enums";
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

/* GRAPHQL QUERIES/MUTATIONS */
const UPDATE_COURSE = gql`
  mutation UpdateCourse($input: UpdateCourseInput!) {
    updateCourse(input: $input) {
      course {
        id
      }
    }
  }
`;

const CourseForm = (props) => {
  /* GRAPHQL QUERIES/MUTATIONS */
  const [updateCourse, { loading, data }] = useMutation(UPDATE_COURSE);

  /* STATE */
  const [defCourse, setDefCourse] = useState(props.course);
  const [input, setInput] = useState({
    courseId: props.course.id,
    inviteOnly: props.course.inviteOnly,
    requireVideoChatUrlOnQuestions: props.course.requireVideoChatUrlOnQuestions
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  /* HANDLER FUNCTIONS */
  const handleInputChange = (e, { name, value }) => {
    input[name] = name === "inviteOnly" || 
      name === "requireVideoChatUrlOnQuestions" ? !input[name] : value;
    setInput(input);
  };

  const onSubmit = async () => {
    try {
      await updateCourse({
        variables: {
          input: input
        }
      });
      await props.refetch();
      setSuccess(true);
    } catch (e) {
      setError(true);
    }
  };

  const onArchived = async () => {
    await updateCourse({
      variables: {
        input: {
          courseId: input.courseId,
          archived: true
        }
      }
    });
    await props.refetch();
    setOpen(false);
  }

  useEffect(() => {
    setDefCourse(props.course);
  }, [props.course])

  return (
    <Form>
      <Form.Field>
        <label>Department</label>
        <Form.Input
          defaultValue={ defCourse.department }
          name='department'
          disabled={ loading }
          onChange={ handleInputChange }/>
      </Form.Field>
      <Form.Field>
        <label>Course Code</label>
        <Form.Input
          defaultValue={ defCourse.courseCode }
          name='courseCode'
          disabled={ loading }
          onChange={ handleInputChange }/>
      </Form.Field>
      <Form.Field>
        <label>Course Title</label>
        <Form.Input
          defaultValue={ defCourse.courseTitle }
          name='courseTitle'
          disabled={ loading }
          onChange={ handleInputChange }/>
      </Form.Field>
      <Form.Field>
        <label>Year</label>
        <Form.Input
          defaultValue={ defCourse.year }
          name='year'
          disabled={ loading }
          onChange={ handleInputChange }/>
      </Form.Field>
      <Form.Field>
        <label>Semester</label>
        <Form.Dropdown
          defaultValue={ defCourse.semester }
          name="semester"
          disabled={ loading }
          selection options={ semesterOptions }
          onChange={ handleInputChange } />
      </Form.Field>
      <Form.Field>
        <label>Invite Only?</label>
        <Form.Radio
          defaultChecked={ defCourse.inviteOnly }
          name="inviteOnly"
          disabled={ loading }
          value={ input.inviteOnly } toggle
          onChange={ handleInputChange }/>
      </Form.Field>
      <Form.Field>
        <label>Require Video Chat?</label>
        <Form.Radio
          defaultChecked={ defCourse.requireVideoChatUrlOnQuestions }
          name="requireVideoChatUrlOnQuestions"
          disabled={ loading }
          value={ input.requireVideoChatUrlOnQuestions } toggle
          onChange={ handleInputChange }/>
      </Form.Field>
      <Button color='blue' type='submit' disabled={ loading } onClick={ onSubmit }>Submit</Button>
      <Modal open={ open }
        trigger={
          <a style={{"textDecoration":"underline", "cursor":"pointer"}}
            onClick={ () => setOpen(true) }>Archive</a>
        }>
        <Modal.Header>Archive Course</Modal.Header>
        <Modal.Content>
          You are about to archive <b>{ defCourse.department } { defCourse.courseCode }</b>.
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel"
            disabled={ loading }
            onClick={ () => setOpen(false) }/>
          <Button content="Archive"
            onClick={ onArchived }
            disabled={ loading }
            color="red"/>
        </Modal.Actions>
      </Modal>
      <Snackbar open={ success } autoHideDuration={6000} onClose={ () => setSuccess(false) }>
        <Alert severity="success" onClose={ () => setSuccess(false) }>
          <span><b>{`${defCourse.department} ${defCourse.courseCode}`}</b> has been updated!</span>
        </Alert>
      </Snackbar>
      <Snackbar open={ error } autoHideDuration={6000} onClose={ () => setError(false) }>
        <Alert severity="error" onClose={ () => setError(false) }>
          <span>There was an error updating <b>{`${defCourse.department} ${defCourse.courseCode}`}</b>!</span>
        </Alert>
      </Snackbar>
    </Form>
  );
}

export default CourseForm;
