import React, { useContext, useState } from "react";
import { Grid } from "semantic-ui-react";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import InstructorQueues from "./InstructorQueues";
import QueueSettings from "./QueueSettings/QueueSettings";
import CreateQueue from "./CreateQueue/CreateQueue";
import { AuthUserContext } from "../../../context/auth";
import { useQueues, useStaff } from "../../../hooks/data-fetching/course";

interface InstructorQueuePageProps {
    courseId: number;
}
const InstructorQueuePage = (props: InstructorQueuePageProps) => {
    const { courseId } = props;

    /* STATE */
    const { user: initialUser } = useContext(AuthUserContext);
    const [leader, staff, staffError, staffLoading, staffMutate] = useStaff(
        courseId,
        initialUser
    );
    const [queues, error, isValidating, mutate] = useQueues(courseId);
    const [success, setSuccess] = useState(false);
    const [activeQueueId, setActiveQueueId] = useState(null);
    const [active, setActive] = useState("queues");

    /* HANDLER FUNCTIONS */
    const onQueueSettings = (id: number) => {
        setActiveQueueId(id);
        setActive("settings");
    };

    const getQueue = (id) => queues.find((q) => q.id === id);

    return (
        <Grid stackable>
            {active === "queues" && queues && (
                <InstructorQueues
                    courseId={courseId}
                    queues={queues}
                    editFunc={onQueueSettings}
                    createFunc={() => {
                        setActive("create");
                    }}
                    mutate={mutate}
                    leader={leader}
                />
            )}
            {active === "settings" && (
                <Grid.Row>
                    <QueueSettings
                        queue={getQueue(activeQueueId)}
                        mutate={mutate}
                        backFunc={() => setActive("queues")}
                    />
                </Grid.Row>
            )}
            {active === "create" && (
                <Grid.Row>
                    <CreateQueue
                        courseId={courseId}
                        mutate={mutate}
                        successFunc={() => setSuccess(true)}
                        backFunc={() => setActive("queues")}
                    />
                </Grid.Row>
            )}
            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={() => setSuccess(false)}
            >
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    <span>Queue successfully created</span>
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default InstructorQueuePage;
