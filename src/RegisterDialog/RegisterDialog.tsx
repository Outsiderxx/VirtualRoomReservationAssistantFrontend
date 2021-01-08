import { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { AccountInfo } from '../Interface';
import { backendServerLocation } from '../Constant';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ErrorDialog from '../ErrorDialog/ErrorDialog';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        registerButton: {
            marginLeft: theme.spacing(2),
        },
        button: {
            marginTop: theme.spacing(2),
        },
        title: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            paddingLeft: theme.spacing(3),
        },
    })
);

export default function RegisterDialog(props: { onLogin: (info: AccountInfo) => void }) {
    const classes = useStyle();
    const [isOpen, setOpen] = useState(false);
    const [isError, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nickname, setNickname] = useState('');
    const [nicknameError, setNicknameError] = useState(false);
    const [account, setAccount] = useState('');
    const [accountError, setAccountError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNickname('');
        setNicknameError(false);
        setAccount('');
        setAccountError(false);
        setPassword('');
        setPasswordError(false);
    };

    const closeError = () => {
        setError(false);
    };

    const onAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccount(event.target.value);
    };

    const onAccountBlur = () => {
        setAccountError(account === '');
    };

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const onPasswordBlur = () => {
        setPasswordError(password === '');
    };

    const onNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(event.target.value);
    };

    const onNicknameBlur = () => {
        setNicknameError(nickname === '');
    };

    const onSubmit = async () => {
        console.log(nickname, account, password);
        if (nickname === '' || account === '' || password === '') {
            setError(true);
            setErrorMessage('Please fill in all the fields');
        } else {
            const data = await fetch(`${backendServerLocation}/api/user/register`, {
                method: 'POST',
                body: JSON.stringify({
                    account: account,
                    password: password,
                    nickname: nickname,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }).then((response) => response.json());
            if (data.statusCode === 400) {
                setError(true);
                setErrorMessage('Account had been used.');
            } else {
                props.onLogin(data);
            }
        }
    };

    return (
        <>
            <Button color='inherit' variant='outlined' onClick={handleOpen} className={classes.registerButton}>
                Register
            </Button>
            <Dialog open={isOpen} onBackdropClick={handleClose} onEscapeKeyDown={handleClose} fullWidth maxWidth='xs'>
                <Typography className={classes.title} variant='h4'>
                    Register
                </Typography>
                <DialogContent dividers>
                    <Grid container spacing={2} direction='column'>
                        <Grid item>
                            <TextField
                                variant='outlined'
                                label='NickName'
                                placeholder='Enter your Nickname'
                                helperText={nicknameError ? 'Nickname is required' : ' '}
                                onChange={onNicknameChange}
                                onBlur={onNicknameBlur}
                                value={nickname}
                                error={nicknameError}
                                autoFocus
                                required
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                variant='outlined'
                                label='Account'
                                placeholder='Enter your account'
                                helperText={accountError ? 'Account is required' : ' '}
                                onChange={onAccountChange}
                                onBlur={onAccountBlur}
                                value={account}
                                error={accountError}
                                required
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                variant='outlined'
                                label='Password'
                                placeholder='Enter your password'
                                helperText={passwordError ? 'Password is required' : ' '}
                                onChange={onPasswordChange}
                                onBlur={onPasswordBlur}
                                value={password}
                                error={passwordError}
                                type='password'
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color='primary' variant='contained' onClick={onSubmit} className={classes.button}>
                        Confirm
                    </Button>
                    <Button color='secondary' variant='contained' onClick={handleClose} className={classes.button}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <ErrorDialog open={isError} errorMessage={errorMessage} closeError={closeError} />
        </>
    );
}
