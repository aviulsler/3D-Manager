import React from "react";
import {Select, MenuItem, FormControl, SelectChangeEvent} from "@mui/material";

interface SubcategorySelectProps {
    subcategories: { id: string; name: string }[];
    selectedSubcategory: string | null;
    onSubcategoryChange: (event: SelectChangeEvent) => void;
}

const SubcategorySelect: React.FC<SubcategorySelectProps> = ({ subcategories, selectedSubcategory, onSubcategoryChange }) => {
    return (
        <FormControl fullWidth margin="normal">
            <Select
                labelId="subcategory-label"
                value={selectedSubcategory || ""}
                onChange={onSubcategoryChange}
                displayEmpty
            >
                <MenuItem value="" disabled>Select a subcategory</MenuItem>
                {subcategories.map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SubcategorySelect;
