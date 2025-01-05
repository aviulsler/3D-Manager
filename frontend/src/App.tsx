import React from "react";
import { Container, Box } from "@mui/material";
import DBSearch from "./components/DB/DBSearch.tsx";

const App: React.FC = () => {
    return (
        <Box sx={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Container sx={{bgcolor: 'Background', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <DBSearch/>
            </Container>
        </Box>
    )
};

export default App;