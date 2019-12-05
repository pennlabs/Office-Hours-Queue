import React from 'react';
import { Segment, Menu, Header, Grid, Image, Label, Modal, Dropdown, TextArea, Form, Button } from 'semantic-ui-react';
import QuestionCard from './QuestionCard';
import { fakeCourse } from './questiondata.js';
import * as ROUTES from '../../constants/routes';


import { withAuthorization } from '../Session';
import { compose } from 'recompose';

const deleteOptions = [
  {key: 'NOT_HERE', value: 'NOT_HERE', text: 'Not Here'},
  {key: 'OH_ENDED', value: 'OH_ENDED', text: 'OH Ended'},
  {key: 'NOT_SPECIFIC', value: 'NOT_SPECIFIC', text: 'Not Specific'},
  {key: 'WRONG_QUEUE', value: 'WRONG_QUEUE', text: 'Wrong Queue'},
  {key: 'OTHER', value: 'OTHER', text: 'Other'}
]

class Queue extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          course: "",
          allTags: [],
          questionToDelete: {},
          deleteModal: {
            open: false,
            reason: "",
            textDisabled: true,
            text: ""
          }
        };

        this.handleAnswerQuestion = this.handleAnswerQuestion.bind(this);

        this.handleTagClick = this.handleTagClick.bind(this);
        this.handleTagClear = this.handleTagClear.bind(this);
        this.containsActiveTag = this.containsActiveTag.bind(this);

        this.handleDeleteDropdownChange = this.handleDeleteDropdownChange.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);

      }

      componentDidMount() {
        var tags = [];

        fakeCourse.queues.forEach(queue => {
            queue.tags.forEach(tag => {
              tags.push({ name: tag, isActive: false });
            });
        });

        this.setState({
          course: fakeCourse,
          allTags: tags
        });
      }

      handleArchivedChange() {
        this.setState({ showArchived: !this.state.showArchived });
      }

      handleAnswerQuestion(queueIndex) {
      }

      handleDeleteQuestion() {
        var course = this.state.course;
        var queue = course.queues[this.state.questionToDelete.queueIndex];
        var question = queue.questions[this.state.questionToDelete.questionIndex];
        question.isDeleted = true;

        this.setState({ course: course, questionToDelete: question });
        this.closeDeleteModal();
      }

      handleTagClick(index) {
        var tags = this.state.allTags;
        var tag = tags[index];
        tag.isActive = !tag.isActive;
        this.setState({ allTags: tags });
      }

      handleTagClear() {
        var tags = this.state.allTags;
        tags.map(tag => {
          tag.isActive = false;
        });

        this.setState({ allTags: tags });
      }

      containsActiveTag(question) {
        //why tf do i hav to do it this way
        var bool = false;
        var activeTags = this.state.allTags.filter(tag => {
          return tag.isActive;
        }).map(tag => tag.name);

        if (activeTags.length == 0) {
          bool = true;;
        }

        question.tags.forEach(tag => {
          if (activeTags.includes(tag)) {
            bool = true;
          }
        });

        return bool;
      }

      handleDeleteDropdownChange(e, { value }) {
        var deleteModal = this.state.deleteModal;
        deleteModal.reason = value;
        deleteModal.textDisabled = deleteModal.reason != "OTHER";
        this.setState({ deleteModal: deleteModal });
      }

      openDeleteModal(queueIndex, questionIndex) {
        var deleteModal = this.state.deleteModal;
        deleteModal.open = true;

        var queue = this.state.course.queues[queueIndex];
        var questionToDelete = queue.questions[questionIndex];
        questionToDelete.queueIndex = queueIndex;
        questionToDelete.questionIndex = questionIndex;

        this.setState({ deleteModal: deleteModal, questionToDelete: questionToDelete });
      }

      closeDeleteModal() {
        var deleteModal = this.state.deleteModal;
        deleteModal.open = false;
        this.setState({ deleteModal: deleteModal });
      }

      render() {
        return (
          <Grid columns={2} divided="horizontally" style={{"width":"100%"}}>
            <Modal open={this.state.deleteModal.open}>
              <Modal.Header>Delete Question</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  You are about to delete the following question from
                  <b>{" " + this.state.questionToDelete.asker}</b>:<br/>
                  <Segment inverted color="blue">{'"' + this.state.questionToDelete.text + '"'}</Segment>
                  <Form>
                    <Form.Field>
                      <Dropdown
                         placeholder="Select Reason"
                         options={deleteOptions}
                         selection
                         onChange={this.handleDeleteDropdownChange}
                         value={this.state.deleteModal.reason}
                       />
                    </Form.Field>
                    <Form.Field
                      control={TextArea}
                      disabled={this.state.deleteModal.textDisabled}
                    />
                  </Form>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button content="Cancel" compact onClick={this.closeDeleteModal}/>
                <Button content="Delete" color="red" compact onClick={this.handleDeleteQuestion}/>
              </Modal.Actions>
            </Modal>
            <Grid.Column width={3}>
              <Segment basic>
                <Image src='../../../ohq.png' size='tiny'/>
                <Menu vertical secondary fluid>
                  <Menu.Item
                    name='Dashboard'
                    href={ROUTES.DASHBOARD}
                    icon='dashboard'
                  />
                  <Menu.Item
                    name="Sample Queue"
                    href={ROUTES.QUEUE}
                    icon='hourglass one'
                    active={true}
                    color={'blue'}
                  />
                  <Menu.Item
                    name="Sample Roster"
                    icon='users'
                    href={ROUTES.ROSTER}
                    />
                </Menu>
              </Segment>
            </Grid.Column>
            <Grid.Column width={13}>
              <Grid columns={2} padded>
                <Grid.Row>
                  {/* COURSE HEADER */}
                  <Segment basic>
                    <Header as="h1">
                      {this.state.course.department + " " + this.state.course.name}
                      <Header.Subheader>
                        {this.state.course.description}
                      </Header.Subheader>
                    </Header>
                  </Segment>
                </Grid.Row>
                <Grid.Row>
                  <Segment basic>
                    <Header as="h3" content="Tags (select to filter)"/>
                    {
                      this.state.allTags.map((tag, index) => (
                        <Label
                          as="a"
                          color={tag.isActive ? "blue" : ""}
                          onClick={() => {this.handleTagClick(index)}}
                        >
                          { tag.name }
                        </Label>
                      ))
                    }
                    <a style={{"margin-left":"12px", "text-decoration":"underline"}}
                      onClick={this.handleTagClear}
                    >Clear All</a>
                  </Segment>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Header as="h3">
                      {
                        this.state.course.queues &&
                        this.state.course.queues.length > 0 &&
                        this.state.course.queues[0].name
                      }
                      <Header.Subheader>
                        {
                          this.state.course.queues &&
                          this.state.course.queues.length > 0 &&
                          this.state.course.queues[0].description
                        }
                      </Header.Subheader>
                    </Header>
                    {/* add main queue cards */}
                    <Grid.Row columns={1} padded="true">
                        {
                          this.state.course.queues &&
                          this.state.course.queues.length > 0 &&
                          this.state.course.queues[0].questions.map((question, index) => (
                            !question.isDeleted && !question.isAnswered &&
                            this.containsActiveTag(question) &&
                            <Grid.Row>
                              <QuestionCard
                                asker={question.asker}
                                text={question.text}
                                time_asked={question.timeAsked}
                                tags={question.tags}
                                queueIndex={0}
                                id={index}
                                deleteFunc={this.openDeleteModal}
                              />
                            </Grid.Row>
                          ))
                        }
                    </Grid.Row>
                  </Grid.Column>
                  <Grid.Column>
                    <Header as="h3">
                      {
                        this.state.course.queues &&
                        this.state.course.queues.length > 1 &&
                        this.state.course.queues[1].name
                      }
                      <Header.Subheader>
                        {
                          this.state.course.queues &&
                          this.state.course.queues.length > 1 &&
                          this.state.course.queues[1].description
                        }
                      </Header.Subheader>
                    </Header>
                    {/* add Debugging queue cards */}
                    <Grid.Row columns={1} padded="true">
                        {
                          this.state.course.queues &&
                          this.state.course.queues.length > 1 &&
                          this.state.course.queues[1].questions.map((question, index) => (
                            !question.isAnswered && !question.isDeleted &&
                            this.containsActiveTag(question) &&
                            <Grid.Column>
                              <QuestionCard
                                asker={question.asker}
                                text={question.text}
                                time_asked={question.timeAsked}
                                tags={question.tags}
                                queueIndex={1}
                                id={index}
                                deleteFunc={this.openDeleteModal}
                              />
                            </Grid.Column>
                          ))
                        }
                    </Grid.Row>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid>
        );
      }

}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
)(Queue);
