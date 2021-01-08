import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function ErrorDialog(props: { open: boolean; errorMessage: string; closeError: () => void }) {
    return (
        <Dialog open={props.open} maxWidth='sm' fullWidth={true}>
            <DialogContent>
                <Typography variant='h6'>{props.errorMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='secondary' onClick={props.closeError}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}
