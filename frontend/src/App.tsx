import React from "react";
import DBSearch from "./components/DB/DBSearch.tsx";
import { Box} from "@mui/material";
import DBUpload from "./components/DB/DBUpload.tsx";

const App: React.FC = () => {
    return (
        <Box>
            <DBSearch />
            <DBUpload />
        </Box>
    );
};

export default App;