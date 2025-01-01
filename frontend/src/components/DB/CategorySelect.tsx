import React from "react";
import { Select, MenuItem, FormControl, SelectChangeEvent } from "@mui/material";

interface CategorySelectProps {
    categories: { id: string; name: string }[];
    selectedCategory: string | null;
    onCategoryChange: (event: SelectChangeEvent) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories, selectedCategory, onCategoryChange }) => {
    return (
        <FormControl fullWidth margin="normal">
            <Select
                labelId="category-label"
                value={selectedCategory || ""}
                onChange={onCategoryChange}
                displayEmpty
            >
                <MenuItem value="" disabled>Select a category</MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CategorySelect;