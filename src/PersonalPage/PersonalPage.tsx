import { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { AccountInfo, MeetingInfo, SelfMeetingInfo } from '../Interface';
import { backendServerLocation } from '../Constant';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            paddingLeft: theme.spacing(3),
        },
        button: {
            padding: theme.spacing(2),
            marginBottom: theme.spacing(2),
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: theme.palette.grey[200],
            },
        },
        paper: {
            padding: theme.spacing(2),
        },
    })
);

export default function PersonalPage(props: { user: AccountInfo; onMeetingClick: (meetingInfo: MeetingInfo) => void }) {
    const classes = useStyle();

    const [isOpen, setOpen] = useState(false);
    const [ownMeetings, setOwnMeetings] = useState<SelfMeetingInfo[]>([]);
    const [invitedMeetings, setInvitedMeetings] = useState<SelfMeetingInfo[]>([]);

    const handleOpen = async () => {
        setOpen(true);
        // 資料索取
        const data = await fetch(`${backendServerLocation}/api/user/${props.user.id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then((response) => response.json());

        setOwnMeetings(data.ownMeeting);
        setInvitedMeetings(data.invitedMeeting);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = async (meeting: SelfMeetingInfo) => {
        const data: MeetingInfo = await fetch(`${backendServerLocation}/api/meeting/${meeting.id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then((response) => response.json());
        props.onMeetingClick(data);
        handleClose();
    };

    return (
        <>
            <Button color='inherit' variant='outlined' onClick={handleOpen}>
                Profile
            </Button>
            <Dialog open={isOpen} onBackdropClick={handleClose} onEscapeKeyDown={handleClose} fullWidth maxWidth='sm'>
                <DialogContent dividers>
                    <Typography variant='h5' paragraph>
                        Account Information
                    </Typography>
                    <Paper variant='outlined' className={classes.paper}>
                        <Typography gutterBottom>Nickname: {props.user.nickname}</Typography>
                        <Typography gutterBottom>Account: {props.user.account}</Typography>
                        <Typography gutterBottom>
                            Password:{' '}
                            {props.user.password
                                .split('')
                                .map(() => '*')
                                .join('')}
                        </Typography>
                    </Paper>
                </DialogContent>
                <DialogContent dividers>
                    <Typography variant='h5' paragraph>
                        Hosting Meeting
                    </Typography>
                    {ownMeetings.map((meeting, idx) => {
                        return (
                            <Paper key={idx} variant='outlined' className={classes.button} onClick={() => handleClick(meeting)}>
                                <Typography gutterBottom>Purpose: {meeting.purpose}</Typography>
                                <Typography gutterBottom>Date: {meeting.date}</Typography>
                            </Paper>
                        );
                    })}
                </DialogContent>
                <DialogContent dividers>
                    <Typography variant='h5' paragraph>
                        Participating Meeting
                    </Typography>
                    {invitedMeetings.map((meeting, idx) => {
                        return (
                            <Paper key={idx} variant='outlined' className={classes.button} onClick={() => handleClick(meeting)}>
                                <Typography gutterBottom>Purpose: {meeting.purpose}</Typography>
                                <Typography gutterBottom>Date: {meeting.date}</Typography>
                            </Paper>
                        );
                    })}
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='secondary' onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
