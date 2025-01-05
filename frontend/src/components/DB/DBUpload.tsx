import React, { useEffect, useState } from "react";
import axios from "axios";
import { Category, Subcategory } from "../../types.ts";
import {
    Box,
    Typography,
    SelectChangeEvent,
    MenuItem,
    Select,
    Button,
    DialogActions,
    DialogContent,
    Dialog,
    DialogTitle
} from "@mui/material";

const DBUpload: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

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
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // accessKey: "bKq0IH3sdEbCmkPOWG0Q",
        // secretKey: "mVLHEHi2usU4SpSx1vLk67LevXWhXAsmyXhwGwtn",
        const files = event.target.files;
        if (files) {
            console.log("Files in the folder:", files);
        }
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
            <Typography>DBUpload</Typography>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Upload Item
            </Button>
            <Dialog open={open} onClose={handleClose} sx={{ height: '50vh', width: '50vh' }}>
                <DialogTitle>Upload Item</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Select
                            sx={{ width: "100%" }}
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
                                sx={{ width: "100%" }}
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
                            <Button
                                component="label"
                                variant="contained"
                                tabIndex={-1}
                            >
                                Upload folder
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    multiple
                                    webkitdirectory="true"
                                    directory="true"
                                    style={{
                                        position: 'absolute',
                                        width: '1px',
                                        height: '1px',
                                        margin: '-1px',
                                        padding: '0',
                                        border: '0',
                                        clip: 'rect(0 0 0 0)',
                                        overflow: 'hidden',
                                    }}
                                />
                            </Button>
                        )}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DBUpload;