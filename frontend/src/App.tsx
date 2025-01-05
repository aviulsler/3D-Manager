import React from "react";
import { Container, Box } from "@mui/material";
import DBSearch from "./components/DB/DBSearch.tsx";
import DBUpload from "./components/DB/DBUpload.tsx";

const App: React.FC = () => {
    return (
        <Box sx={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Container sx={{bgcolor: 'Background', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <DBSearch/>
                <DBUpload/>
            </Container>
        </Box>
    )
};

export default App;