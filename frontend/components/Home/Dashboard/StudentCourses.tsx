import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import CourseCard from './Cards/CourseCard';
import AddCard from './Cards/AddCard';
import ModalAddStudentCourse from './Modals/ModalAddStudentCourse';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

/* FUNCTIONAL COMPONENT */
const StudentCourses = (props) => {
  /* STATE */
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false); //opening snackbar


  return (
    [
      <Grid.Row padded="true" stackable>
        <ModalAddStudentCourse
            open={ open }
            closeFunc={ () => setOpen(false) }
            refetch={ props.refetch }
            successFunc={ setSuccess }/>
          {
            props.courses.map((course) => (
              !course.archived &&
              <Grid.Column key={course.id} style={{width:"280px"}}>
                <CourseCard
                  department={course.department}
                  courseCode={course.courseCode}
                  courseTitle={course.courseTitle}
                  semester={course.semester}
                  id={course.id}
                  kind={course.kind}
                  archived={course.archived}/>
              </Grid.Column>
            ))
          }
        <Grid.Column style={{width:"280px"}}>
          <AddCard clickFunc={ () => setOpen(true) } isStudent={ true }/>
        </Grid.Column>
      </Grid.Row>,
      <Snackbar open={ success } autoHideDuration={2000} onClose={ () => setSuccess(false) }>
        <Alert severity="success" onClose={ () => setSuccess(false) }>
          Course added!
        </Alert>
      </Snackbar>
    ]
  );
};

export default StudentCourses;