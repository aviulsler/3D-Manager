import React, { useEffect, useState } from "react";
import axios from "axios";
import { Category, Item, Subcategory } from "../../types.ts";
import { Box, Typography, SelectChangeEvent, MenuItem, Select, List, ListItem } from "@mui/material";

const DBSearch: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/categories")
            .then((response) => {
                setCategories(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    const handleCategoryChange = (event: SelectChangeEvent) => {
        const categoryId = event.target.value as string;
        setSelectedCategory(categoryId);
        setSelectedSubcategory(null);

        axios
            .get(`http://localhost:5000/api/subcategories/filter?category_id=${categoryId}`)
            .then((response) => {
                setSubcategories(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching subcategories:", error);
            });
    };

    const handleSubcategoryChange = (event: SelectChangeEvent) => {
        const subcategoryId = event.target.value as string;
        setSelectedSubcategory(subcategoryId);

        axios
            .get(`http://localhost:5000/api/items/filter?subcategory_id=${subcategoryId}`)
            .then((response) => {
                setItems(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
            });
    };

    return (
        <Box
            sx={{
                bgcolor: "darkgray",
                width: "80%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography>DBSearch</Typography>
            <Select
                sx={{ width: "30%" }}
                labelId="category-label"
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
                displayEmpty
            >
                <MenuItem value="" disabled>
                    Select a category
                </MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                ))}
            </Select>
            {selectedCategory && (
                <Select
                    sx={{ width: "30%" }}
                    labelId="subcategory-label"
                    value={selectedSubcategory || ""}
                    onChange={handleSubcategoryChange}
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        Select a subcategory
                    </MenuItem>
                    {subcategories.map((subcategory) => (
                        <MenuItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                        </MenuItem>
                    ))}
                </Select>
            )}
            {selectedSubcategory && (
                <List>
                    {items.map((item) => (
                        <ListItem key={item.id} value={item.id}>
                            {item.name}
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default DBSearch;