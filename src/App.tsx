import { useState, useEffect } from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { AccountInfo, MeetingInfo } from './Interface';
import { roomNames, timePeriods, backendServerLocation } from './Constant';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DateFnsUtils from '@date-io/date-fns';
import LoginDialog from './LoginDialog/LoginDialog';
import RegisterDialog from './RegisterDialog/RegisterDialog';
import RoomSystem from './RoomSystem/RoomSystem';
import PersonalPage from './PersonalPage/PersonalPage';
import MeetingInfoPage from './MeetingInfoPage/MeetingInfoPage';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },
        userName: {
            marginRight: theme.spacing(1),
        },
        button: {
            marginLeft: theme.spacing(2),
        },
        background: {
            margin: theme.spacing(3),
            padding: theme.spacing(3),
        },
        root: {
            backgroundColor: theme.palette.grey[200],
        },
    })
);

function App() {
    const classes = useStyle();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const emptyAccount: AccountInfo = {
        account: '',
        password: '',
        nickname: '',
        id: -1,
    };

    const emptyMeetings: MeetingInfo[][] = [...new Array(roomNames.length)].map((disregard, roomIdx) => {
        return [...new Array(timePeriods.length)].map((disregard, meetingIdx) => {
            return {
                purpose: '',
                host: emptyAccount,
                members: [emptyAccount],
                detail: '',
                date: new Date().toLocaleDateString().replaceAll('/', '-'),
                id: -1,
                room: roomIdx,
                timePeriod: meetingIdx,
            };
        });
    });

    const [user, setUser] = useState<AccountInfo>(emptyAccount);
    const [isMeetingPageOpen, setMeetingPageOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<MeetingInfo>(emptyMeetings[0][0]);
    const [meetingInfos, setMeetingInfos] = useState(emptyMeetings);

    useEffect(() => {
        onSelectedDateChange(new Date()); // 一開始先抓今天的資料
    }, []);

    const onLogin = (account: AccountInfo) => {
        setUser(account);
    };

    const onLogout = () => {
        setUser({
            account: '',
            password: '',
            nickname: '',
            id: -1,
        });
    };

    const onSelectedDateChange = async (date: Date | null) => {
        if (date !== null && date.toLocaleDateString() !== selectedDate?.toLocaleDateString()) {
            const datas: MeetingInfo[] = await fetch(`${backendServerLocation}/api/meeting?date=` + date.toLocaleDateString().replaceAll('/', '-'), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => response.json());
            setSelectedDate(date);
            setMeetingInfos(emptyMeetings);
            setMeetingInfos((state) => {
                return state.map((room) => {
                    return room.map((meeting) => {
                        const data: MeetingInfo | undefined = datas.find(
                            (data) => data.room === meeting.room && data.timePeriod === meeting.timePeriod
                        );
                        if (data) {
                            return data;
                        } else {
                            return meeting;
                        }
                    });
                });
            });
        }
    };

    const onMeetingClick = (meetingInfo: MeetingInfo) => {
        setSelectedMeeting(meetingInfo);
        setMeetingPageOpen(true);
    };

    const onMeetingInfoPageClose = () => {
        setMeetingPageOpen(false);
    };

    const onMeetingInfoChange = async (meetingInfo: MeetingInfo) => {
        setSelectedMeeting(meetingInfo);
        setMeetingInfos((state) => {
            return state.map((room) => {
                return room.map((meeting) => {
                    if (meeting.room === meetingInfo.room && meeting.timePeriod === meetingInfo.timePeriod) {
                        return meetingInfo;
                    } else {
                        return meeting;
                    }
                });
            });
        });
    };

    const unLoginButtonSet: JSX.Element = (
        <>
            <LoginDialog onLogin={onLogin}></LoginDialog>
            <RegisterDialog onLogin={onLogin}></RegisterDialog>
        </>
    );

    const loginedButtonSet: JSX.Element = (
        <>
            <Typography variant='h6' className={classes.userName}>
                Hi! {user.nickname}
            </Typography>
            <PersonalPage user={user} onMeetingClick={onMeetingClick} />
            <Button color='inherit' variant='outlined' className={classes.button} onClick={onLogout}>
                Logout
            </Button>
        </>
    );

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h4' className={classes.title}>
                        Virtual Room Reservation Assistant
                    </Typography>
                    {user.id !== -1 ? loginedButtonSet : unLoginButtonSet}
                </Toolbar>
            </AppBar>
            <Grid container direction='column'>
                <Grid item className={classes.background} component={Paper} classes={{ root: classes.root }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker format='yyyy/MM/dd' label='Select a date' value={selectedDate} onChange={onSelectedDateChange} />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item className={classes.background} component={Paper} classes={{ root: classes.root }}>
                    <RoomSystem meetingInfos={meetingInfos} onClick={onMeetingClick} />
                </Grid>
            </Grid>
            {isMeetingPageOpen ? (
                <MeetingInfoPage info={selectedMeeting} user={user} onMeetingInfoChange={onMeetingInfoChange} onClose={onMeetingInfoPageClose} />
            ) : null}
        </>
    );
}

export default App;
