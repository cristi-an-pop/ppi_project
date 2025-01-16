import React from 'react';
import { Case } from '../../types/Case';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';

interface CaseItemProps {
    caseItem: Case;
    onDelete: (id: string) => void;
}

const API_BASE_URL = "http://localhost:5000";

const CaseItem: React.FC<CaseItemProps> = ({ caseItem, onDelete }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleClick = () => {
        const currentUrl = location.pathname;
        navigate(`${currentUrl}/${caseItem.id}`);
    }

    return (
        <Card>
            <CardContent onClick={handleClick}>
                <Typography variant="h5">{caseItem.title}</Typography>
                <img 
                    src={ `${API_BASE_URL}/${caseItem.image}` || ''} 
                    alt="Preview" 
                    style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'contain',
                        borderRadius: '4px'
                    }} 
                />
            </CardContent>
            <IconButton onClick={() => caseItem.id && onDelete(caseItem.id)}>
                <DeleteIcon />
            </IconButton>
        </Card>
    )
}

export default CaseItem;