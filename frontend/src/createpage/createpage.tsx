import * as React from 'react';
import { Box, TextField, Stack, Container, Paper, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import NavBar from '../homepage/NavBar';

function CreatePage() {
  const [managerName, setManagerName] = React.useState('');
  const [managerDesc, setManagerDesc] = React.useState('');
  const [formError, setFormError] = React.useState(false);

  const navigate = useNavigate();

  const submitManager = () => {
    if (managerName.length == 0 || managerDesc.length == 0)
    {
        setFormError(true);
    }
    // Handle API Call here
    // Api returns an id
    navigate(`/reviews?id=${0}`);
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginTop:3}}>
            <Stack direction="column">
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Create a Manager</Typography>
                <Stack direction='column' spacing={4} alignItems="center" style={{margin: '10px'}}>
                    <Box>
                        <Typography style={{fontWeight: 'bold'}}>Manager Picture</Typography>
                        <input type="file" name="Manager Image" style={{ width: "100%", maxWidth: "400px", height: "auto"}}/>
                    </Box>
                    <Stack sx={{width:'100%', alignItems:"center"}}>
                    <Stack direction="column" spacing={2} sx={{alignItems: "center"}} style={{width: '100%'}}>
                        <TextField id="namefield" variant="outlined" label="Manager Name.." style={{width: '100%', marginLeft: '100px', marginRight: '100px'}} value={managerName} onChange={(val) => setManagerName(val.target.value)}/>
                        <TextField id="description" variant="outlined" label="Manager Description.." multiline rows={4} style={{width: '100%', marginLeft: '100px', marginRight: '100px'}} value={managerDesc} onChange={(val) => setManagerDesc(val.target.value)}/>
                        {(formError) ? <Typography style={{color: 'red'}}>Fill in all fields</Typography> : <></>}
                        <Button variant="contained" color="primary" onClick={submitManager}>
                            Create Manager
                        </Button>
                    </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    </Container>
    </>
  )
}

export default CreatePage
