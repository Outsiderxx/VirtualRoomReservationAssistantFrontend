import { useState, useEffect, ChangeEvent } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { MeetingInfo, AccountInfo } from '../Interface';
import { roomNames, timePeriods, backendServerLocation } from '../Constant';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ErrorDialog from '../ErrorDialog/ErrorDialog';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            paddingLeft: theme.spacing(3),
        },
        paper: {
            padding: theme.spacing(2),
        },
        input: {
            marginBottom: theme.spacing(2),
        },
    })
);

export default function MeetingInfoPage(props: {
    info: MeetingInfo;
    user: AccountInfo;
    onClose: () => void;
    onMeetingInfoChange: (meetingInfo: MeetingInfo) => void;
}) {
    const classes = useStyle();
    const [isEditPageOpen, setEditPageOpen] = useState(false);
    const [isInfoPageOpen, setInfoPageOpen] = useState(false);
    const [isErrorPageOpen, setErrorPageOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [purpose, setPurpose] = useState(props.info.purpose);
    const [isPurposeError, setPurposeError] = useState(false);
    const [host, setHost] = useState(props.info.host);
    const [members, setMembers] = useState(props.info.members);
    const [isMemberError, setMemberError] = useState(false);
    const [detail, setDetial] = useState(props.info.detail);
    const [isDetailError, setDetailError] = useState(false);

    useEffect(() => {
        handleCurrentState();
    }, []);

    useEffect(() => {
        setMembers(props.info.members);
    }, [props.info.members]);

    useEffect(() => {
        setHost(props.info.host);
    }, [props.info.host]);

    const onEditBtnClick = () => {
        setInfoPageOpen(false);
        setEditPageOpen(true);
    };

    const onDeleteBtnClick = async () => {
        await fetch(`${backendServerLocation}/api/meeting/${props.info.id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
        });
        props.onMeetingInfoChange({
            purpose: '',
            host: {
                account: '',
                password: '',
                nickname: '',
                id: -1,
            },
            members: [
                {
                    account: '',
                    password: '',
                    nickname: '',
                    id: -1,
                },
            ],
            detail: '',
            date: props.info.date,
            id: -1,
            room: props.info.room,
            timePeriod: props.info.timePeriod,
        });
        handleInfoPageClose();
    };

    const onConfirmBtnClick = async () => {
        if (!purpose || !members[0].account || !detail) {
            setErrorPageOpen(true);
            setErrorMessage(
                `Please fill in the following field(s): ${purpose === '' ? 'Purpose' : ''} ${members[0].account === '' ? 'Participant ' : ''} ${
                    detail === '' ? 'Detail' : ''
                }`
            );
        } else {
            let data: any;
            if (props.info.id === -1) {
                data = await fetch(`${backendServerLocation}/api/meeting`, {
                    method: 'POST',
                    body: JSON.stringify({
                        hostAccount: props.user.account,
                        membersAccount: members.map((member) => member.account),
                        purpose: purpose,
                        detail: detail,
                        date: props.info.date,
                        timePeriod: props.info.timePeriod,
                        room: props.info.room,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }).then((response) => response.json());
            } else {
                data = await fetch(`${backendServerLocation}/${props.info.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        hostAccount: props.user.account,
                        membersAccount: members.map((member) => member.account),
                        purpose: purpose,
                        detail: detail,
                        date: props.info.date,
                        timePeriod: props.info.timePeriod,
                        room: props.info.room,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }).then((response) => response.json());
            }
            if (data.statusCode === 400) {
                setErrorPageOpen(true);
                setErrorMessage((data as Error).message);
            } else {
                setInfoPageOpen(true);
                setEditPageOpen(false);
                props.onMeetingInfoChange(data);
            }
        }
    };

    const handleErrorPageClose = () => {
        setErrorPageOpen(false);
        if (props.user.id === -1 && props.info.id === -1) {
            // 無登入點擊空閒時段時關閉錯誤訊息等於關閉整個頁面
            props.onClose();
        }
    };

    const handleInfoPageClose = () => {
        setInfoPageOpen(false);
        props.onClose();
    };

    const handleEditPageClose = () => {
        setEditPageOpen(false);
        setPurpose(props.info.purpose);
        setMembers(props.info.members);
        setDetial(props.info.detail);
        if (!props.info.purpose) {
            props.onClose();
        } else {
            setInfoPageOpen(true);
        }
    };

    const onPurposeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPurpose(event.target.value);
    };

    const onPurposeBlur = () => {
        setPurposeError(purpose === '');
    };

    const onMemberChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMembers(
            event.target.value.split(',').map((each) => {
                return {
                    account: each,
                    nickname: '',
                    id: -1,
                    password: '',
                };
            })
        );
    };
    const onMemberBlur = () => {
        setMemberError(members[0].account === '');
    };

    const onDetailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDetial(event.target.value);
    };

    const onDetailBlur = () => {
        setDetailError(detail === '');
    };

    const handleCurrentState = () => {
        if (props.user.id === -1 && props.info.id === -1 && !isErrorPageOpen) {
            setErrorPageOpen(true);
            setErrorMessage('You need to login first !');
        } else if (props.info.id !== -1 && !isInfoPageOpen && !isEditPageOpen) {
            setInfoPageOpen(true);
        } else if (props.user.id !== -1 && !isEditPageOpen && !isInfoPageOpen) {
            setEditPageOpen(true);
        }
    };

    const isParticipant = (): boolean => {
        if (props.info.members.find((single) => single.account === props.user.account)) {
            return true;
        }
        return false;
    };

    const editPage: JSX.Element = (
        <>
            <Dialog open={isEditPageOpen} onBackdropClick={handleEditPageClose} onEscapeKeyDown={handleEditPageClose} fullWidth maxWidth='sm'>
                <Typography className={classes.title} variant='h4'>
                    {props.info.purpose ? 'Edit' : 'Create'} Meeting
                </Typography>
                <DialogContent dividers>
                    <TextField
                        className={classes.input}
                        onChange={onPurposeChange}
                        onBlur={onPurposeBlur}
                        value={purpose}
                        error={isPurposeError}
                        helperText={isPurposeError ? 'Purpose is required' : ' '}
                        variant='outlined'
                        placeholder='Enter Purpose'
                        label='Purpose'
                        fullWidth
                        autoFocus
                        required
                    />
                    <TextField
                        className={classes.input}
                        value={props.user.account}
                        variant='outlined'
                        label='Host'
                        helperText=' '
                        disabled
                        fullWidth
                        required
                    />
                    <TextField
                        className={classes.input}
                        onChange={onMemberChange}
                        onBlur={onMemberBlur}
                        value={members.map((member) => member.account).join(',')}
                        error={isMemberError}
                        helperText={isMemberError ? 'Participant is required' : ' '}
                        variant='outlined'
                        placeholder="Enter Member(s), and separate it by ','"
                        label='Member(s)'
                        fullWidth
                        required
                    />
                    <TextField
                        className={classes.input}
                        onChange={onDetailChange}
                        onBlur={onDetailBlur}
                        value={detail}
                        error={isDetailError}
                        helperText={isDetailError ? 'Detail is required' : ' '}
                        variant='outlined'
                        placeholder='Enter Detail'
                        label='Detail'
                        fullWidth
                        multiline
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='primary' onClick={onConfirmBtnClick}>
                        Confirm
                    </Button>
                    <Button variant='contained' color='secondary' onClick={handleEditPageClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

    const infoPage: JSX.Element = (
        <Dialog open={isInfoPageOpen} onBackdropClick={handleInfoPageClose} onEscapeKeyDown={handleInfoPageClose} fullWidth maxWidth='sm'>
            <Typography className={classes.title} variant='h4'>
                Meeting Information
            </Typography>
            <DialogContent dividers>
                <Paper variant='outlined' className={classes.paper}>
                    <Typography noWrap variant='h6'>
                        Purpose: {purpose}
                    </Typography>
                    <Typography noWrap variant='h6'>
                        Host: {`${host.nickname}(${host.account})`}
                    </Typography>
                    <Typography noWrap variant='h6'>
                        Room Name: {roomNames[props.info.room]}
                    </Typography>
                    <Typography noWrap variant='h6'>
                        Time Period: {timePeriods[props.info.timePeriod]}
                    </Typography>
                    {(isParticipant() || host.account === props.user.account) && (
                        <>
                            {members.map((member, idx) => {
                                return (
                                    <Typography key={member.account} variant='h6'>{`Member${idx + 1}: ${member.nickname}(${
                                        member.account
                                    })`}</Typography>
                                );
                            })}
                            <Typography variant='h6'>Detail: {detail}</Typography>
                        </>
                    )}
                </Paper>
            </DialogContent>
            <DialogActions>
                {host.account === props.user.account && (
                    <>
                        <Button variant='contained' color='primary' onClick={onEditBtnClick}>
                            Edit
                        </Button>
                        <Button variant='contained' color='secondary' onClick={onDeleteBtnClick}>
                            Delete
                        </Button>
                    </>
                )}
                <Button variant='contained' color='secondary' onClick={handleInfoPageClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <>
            {infoPage}
            {editPage}
            <ErrorDialog open={isErrorPageOpen} errorMessage={errorMessage} closeError={handleErrorPageClose} />
        </>
    );
}
