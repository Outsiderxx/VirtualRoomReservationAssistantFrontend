import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { MeetingInfo } from '../Interface';
import { roomNames, timePeriods } from '../Constant';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: theme.palette.grey[200],
            },
        },
    })
);

export default function RoomSystem(props: { meetingInfos: Array<MeetingInfo>[]; onClick: (meetingInfo: MeetingInfo) => void }) {
    const classes = useStyle();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='left' key='Room Name'>
                            Room Name
                        </TableCell>
                        {timePeriods.map((name, idx) => {
                            return (
                                <TableCell align='center' key={`${idx}+${name}`}>
                                    {name}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roomNames.map((name, roomIdx) => {
                        return (
                            <TableRow key={name}>
                                <TableCell>{roomNames[roomIdx]}</TableCell>
                                {props.meetingInfos[roomIdx].map((meeting, meetingIdx) => {
                                    return (
                                        <TableCell
                                            className={classes.paper}
                                            variant='footer'
                                            align='center'
                                            key={`${roomIdx}+${meetingIdx}`}
                                            onClick={() => props.onClick(meeting)}>
                                            {meeting.id !== -1 ? (
                                                <>
                                                    <Typography>{`Purpose: ${meeting.purpose}`}</Typography>
                                                    <Typography>{`Host Name: ${meeting.host.nickname}`}</Typography>
                                                </>
                                            ) : (
                                                <Typography>Available</Typography>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
