import React, {
    useContext,
    useEffect,
    useState,
    MutableRefObject,
} from "react";
import {
    Grid,
    Segment,
    Header,
    Icon,
    ButtonProps,
    Message,
} from "semantic-ui-react";
import CourseSidebar from "./CourseSidebar";

import { AuthUserContext } from "../../context/auth";
import { useCourse, useStaff } from "../../hooks/data-fetching/course";
import * as bellAudio from "./InstructorQueuePage/notification.mp3";
import Footer from "../common/Footer";
import { usePlayer } from "../../hooks/player";
import { Course as CourseType, Membership } from "../../types";

interface CourseProps {
    render: (
        staff: boolean,
        play: MutableRefObject<(() => void) | undefined>
    ) => JSX.Element;
    course: CourseType;
    leadership: Membership[];
}

const ANALYTICS_SURVEY_SHOWN_LS_TOKEN = "__instructor_analytics_survey_shown";

const CourseWrapper = ({ render, ...props }: CourseProps) => {
    const { course: rawCourse, leadership } = props;
    const [course, , ,] = useCourse(rawCourse.id, rawCourse);
    const [surveyDisp, setSurveyDisp] = useState(false);

    useEffect(() => {
        const state = localStorage.getItem(ANALYTICS_SURVEY_SHOWN_LS_TOKEN);
        const toDisp = state !== "true";
        setSurveyDisp(toDisp);
    }, []);

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
            <CourseSidebar course={course} leadership={leadership} />
            <Grid.Column
                width={13}
                style={{ display: "flex", flexDirection: "column" }}
            >
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

                        {staff && surveyDisp && (
                            <Grid.Column>
                                <div style={{ padding: "0.8rem" }}>
                                    <Message
                                        onDismiss={() => {
                                            setSurveyDisp(false);
                                            localStorage.setItem(
                                                ANALYTICS_SURVEY_SHOWN_LS_TOKEN,
                                                "true"
                                            );
                                        }}
                                        size="mini"
                                        header="Want to see your stats?"
                                        content={
                                            <>
                                                Help us build OHQ Analytics by
                                                filling out{" "}
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href="https://airtable.com/shrzhy6mxzLmjF1JD"
                                                >
                                                    this survey
                                                </a>
                                                !
                                            </>
                                        }
                                    />
                                </div>
                            </Grid.Column>
                        )}

                        <Grid.Column>
                            <Segment basic>
                                <div
                                    style={{
                                        float: "right",
                                        paddingTop: "0.71rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "inline",
                                            position: "relative",
                                            top: "0.14rem",
                                            fontSize: "1.29rem",
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
                                            paddingLeft: "0.71rem",
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
                <Footer />
            </Grid.Column>
        </>
    ) : (
        <></>
    );
};

export default CourseWrapper;
