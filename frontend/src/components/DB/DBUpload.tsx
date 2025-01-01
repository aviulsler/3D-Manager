import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';

interface Category {
    id: string;
    name: string;
}

interface Subcategory {
    id: number;
    category_id: number;
    name: string;
}

const DBUpload = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
    const [itemName, setItemName] = useState<string>('');
    const [folderPath, setFolderPath] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);

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
        setSelectedSubcategory(event.target.value as string);
    };

    const handleItemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemName(event.target.value);
    };

    const handleFolderUpload = (acceptedFiles: File[]) => {
        const folder = acceptedFiles[0];
        setFolderPath(folder.webkitRelativePath);

        const formData = new FormData();
        formData.append('folder', folder);

        axios.post('/upload-folder', formData)
            .then(() => {
                console.log('Folder uploaded');
            })
            .catch((error) => {
                console.error('Error uploading folder:', error);
            });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleFolderUpload,
        noClick: true,
        noKeyboard: true,
        accept: { 'application/zip': ['.zip'], 'application/x-tar': ['.tar'], 'application/gzip': ['.gz'] },
    });

    const handleSubmit = () => {
        if (!itemName || !selectedSubcategory) {
            alert('Item name and subcategory are required');
            return;
        }

        axios.post('/api/items', {
            name: itemName,
            subcategory_id: selectedSubcategory,
            path: folderPath,
        })
            .then(() => {
                alert('Item added successfully');
            })
            .catch((error) => {
                alert('Failed to add item');
                console.error(error);
            });
    };

    return (
        <div>
            <Button onClick={() => setOpenDialog(true)}>Upload DB Entries</Button>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Upload DB Entries</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedCategory && (
                        <FormControl fullWidth>
                            <InputLabel>Subcategory</InputLabel>
                            <Select
                                value={selectedSubcategory}
                                onChange={handleSubcategoryChange}
                            >
                                {subcategories.map((subcategory) => (
                                    <MenuItem key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <TextField
                        label="Item Name"
                        fullWidth
                        value={itemName}
                        onChange={handleItemNameChange}
                        margin="normal"
                    />

                    <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '10px', marginTop: '10px' }}>
                        <input {...getInputProps()} />
                        <p>Drag & drop a folder here, or click to select a folder</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DBUpload;