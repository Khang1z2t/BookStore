import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, OutlinedInput} from "@mui/material";
import Button from "@mui/material/Button";

function ForgotPassword({open, handleClose}) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                    event.preventDefault();
                    handleClose();
                }, sx: {backgroundImage: 'none'},
            }}
        >
            <DialogTitle>Reset password</DialogTitle>
            <DialogContent
                sx={{display: 'flex', flexDirection: 'column', gap: 2, width: '100%'}}
            >
                <DialogContentText>
                    Enter your account&apos;s email address, and we&apos;ll send you a link to
                    reset your password.
                </DialogContentText>
                <OutlinedInput
                    autoFocus
                    required
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email address"
                    placeholder="Email address"
                    type="email"
                    fullWidth
                />
            </DialogContent>
            <DialogActions sx={{pb: 3, px: 3}}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" type="submit">
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ForgotPassword;