import React, { useState, useContext, createRef } from "react";
import {
    Grid,
    Segment,
    Header,
    Checkbox,
    CheckboxProps,
    Icon,
    Button,
    ButtonProps,
} from "semantic-ui-react";
import CourseSidebar from "./CourseSidebar";

import { AuthUserContext } from "../../context/auth";
import { useCourse, useStaff } from "../../hooks/data-fetching/course";
import * as bellAudio from "./InstructorQueuePage/notification.mp3";
import { usePlayer } from "../../hooks/player";
import { Course as CourseType, Membership } from "../../types";

interface CourseProps {
    render: (staff: boolean, play: () => void) => JSX.Element;
    course: CourseType;
    leadership: Membership[];
}
const CourseWrapper = ({ render, ...props }: CourseProps) => {
    const { course: rawCourse, leadership } = props;
    const [course, , ,] = useCourse(rawCourse.id, rawCourse);
    const { user: initialUser } = useContext(AuthUserContext);
    if (!initialUser) {
        throw new Error(
            "Invariant broken: withAuth must be used with component"
        );
    }

    const [, staff, , ,] = useStaff(rawCourse.id, initialUser);

    const [notifs, setNotifs, play] = usePlayer(bellAudio);

    const toggleNotifs = (
        event: React.MouseEvent<HTMLButtonElement>,
        data: ButtonProps
    ) => {
        setNotifs(!notifs);
        document.body.focus();
    };

    return course ? (
        <>
            <CourseSidebar courseId={course.id} leadership={leadership} />
            <Grid.Column width={13}>
                {course.department && (
                    <Grid columns="equal">
                        <Grid.Column>
                            <Segment basic>
                                <Header as="h1">
                                    {`${course.department} ${course.courseCode}`}
                                    <Header.Subheader>
                                        {course.courseTitle}
                                    </Header.Subheader>
                                </Header>
                            </Segment>
                        </Grid.Column>

                        <Grid.Column>
                            <Segment basic>
                                <div
                                    style={{
                                        float: "right",
                                        paddingTop: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "inline",
                                            position: "relative",
                                            top: "2px",
                                            fontSize: "18px",
                                            fontFamily: "Lato",
                                            color: "#666666",
                                        }}
                                    >
                                        Notifications are{" "}
                                        {notifs ? "ON" : "OFF"}
                                    </div>
                                    <Icon
                                        size="large"
                                        style={{
                                            paddingLeft: "10px",
                                            cursor: "pointer",
                                            color: "rgba(0, 0, 0, 0.6)",
                                        }}
                                        name={
                                            notifs
                                                ? "bell outline"
                                                : "bell slash outline"
                                        }
                                        onClick={toggleNotifs}
                                    />
                                </div>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                )}
                {render(staff, play)}
            </Grid.Column>
        </>
    ) : (
        <></>
    );
};

export default CourseWrapper;
