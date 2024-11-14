import React from 'react';
import { Case } from '../../types/Case';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

interface CaseItemProps {
    caseItem: Case;
    onDelete: (id: string) => void;
}

const CaseItem: React.FC<CaseItemProps> = ({ caseItem, onDelete }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/cases/${caseItem.id}`);
    }

    return (
        <Card onClick={handleClick}>
            <CardContent>
                <Typography variant="h5">{caseItem.title}</Typography>
            </CardContent>
            <IconButton 
                onClick={() => caseItem.id && onDelete(caseItem.id)}
            >
                <DeleteIcon />
            </IconButton>
        </Card>
    )
}

export default CaseItem;