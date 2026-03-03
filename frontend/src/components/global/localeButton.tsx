import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link as RouterLink } from 'react-router-dom';
import { Chip, useTheme } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext'
import { neighborhoodNameByID } from '../../utils/neighborhoodByID';



export default function LocaleButton() {
    const { user } = useAuth();
    const theme = useTheme();
    // const neighborhood = useFetchNeighborhood()
    const neighborhoodID = user?.neighborhood_id
    const role = user?.role
    if (!neighborhoodID) return (
        <Chip
            label="Add location for Chefs near you"
            component={RouterLink}
            to={`/${role}/profile/edit`}
            clickable
            size="small"
            variant="outlined"
            color="default"
            id='add-locale-button'
        />
    )

    console.log(neighborhoodNameByID(neighborhoodID));
    


    return (
        <Chip
            icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
            label={neighborhoodNameByID(neighborhoodID) || 'Madison, WI'}
            component={RouterLink}
            to={`/${role}/browse?neighborhood=${encodeURIComponent(neighborhoodID)}`}
            clickable
            size="small"
            variant="outlined"
            sx={{
            mt: 0.75,
            fontWeight: 600,
            borderRadius: 999,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            transition: 'all 0.2s ease',
            '&:hover': {
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                borderColor: theme.palette.primary.light,
            },
            }}
            id='add-locale-button'
        />
    )
}