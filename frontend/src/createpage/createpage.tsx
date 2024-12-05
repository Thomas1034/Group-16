import * as React from 'react';
import { Box, TextField, Stack, Container, Paper, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import NavBar from '../homepage/NavBar';

function CreatePage() {
  const [managerName, setManagerName] = React.useState('');
  const [managerDesc, setManagerDesc] = React.useState('');
  const [managerUrl, setManagerUrl] = React.useState('');
  const [managerImage, setManagerImage] = React.useState<File | null>(null);
  const [formError, setFormError] = React.useState(false);

  const navigate = useNavigate();

  const submitManager = async () => {
    if (managerName.length == 0 || managerDesc.length == 0)
    {
        setFormError(true);
    }

    const formData = new FormData();
    formData.append('name', managerName);
    formData.append('description', managerDesc);
    formData.append('url', managerUrl);
    if (managerImage) {
      formData.append('image', managerImage);
    }
    const token = localStorage.getItem("userID");

    try {
      const response = await fetch('https://contactcrucible.xyz/api/contact-managers', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        //TODO: Wait for backend to fix API to actually return this info
        navigate(`/reviews?id=${data.id}`);
      } else {
        console.error('Failed to create manager');
      }
    } catch (error) {
      console.error('Error creating manager:', error);
    }
  };


  return (
    <>
      <NavBar setSearch={() => {}} showSearchBar={false}/>
      <Container maxWidth="lg" sx={{ padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginTop:3}}>
            <Stack direction="column">
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Create a Manager</Typography>
                <Stack direction='column' spacing={4} alignItems="center" style={{margin: '10px'}}>
                    <Box>
                        <Typography style={{fontWeight: 'bold'}}>Manager Picture</Typography>
                        <input 
                          type="file" 
                          name="Manager Image" 
                          style={{ width: "100%", maxWidth: "400px", height: "auto"}} 
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (event.target.files && event.target.files[0]) {
                              setManagerImage(event.target.files[0]);
                            }
                          }}/>
                    </Box>
                    <Stack sx={{width:'100%', alignItems:"center"}}>
                    <Stack direction="column" spacing={2} sx={{alignItems: "center"}} style={{width: '100%'}}>
                        <TextField id="namefield" variant="outlined" label="Manager Name.." style={{width: '100%', marginLeft: '100px', marginRight: '100px'}} value={managerName} onChange={(val) => setManagerName(val.target.value)}/>
                        <TextField id="description" variant="outlined" label="Manager Description.." multiline rows={4} style={{width: '100%', marginLeft: '100px', marginRight: '100px'}} value={managerDesc} onChange={(val) => setManagerDesc(val.target.value)}/>
                        <TextField id="url" variant="outlined" label="Manager URL.." style={{ width: '100%', marginLeft: '100px', marginRight: '100px' }} value={managerUrl} onChange={(val) => setManagerUrl(val.target.value)} />
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
