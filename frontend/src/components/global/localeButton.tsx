import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link as RouterLink } from 'react-router-dom';
import { Chip, useTheme } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext'



export default function LocaleButton() {
    const { user } = useAuth();
    const theme = useTheme();
    const city = user?.address?.city
    if (!city) return (
        <Chip
            label="Add location"
            component={RouterLink}
            to="/profile/edit"
            clickable
            size="small"
            variant="outlined"
            color="default"
        />
    )


    return (
        <Chip
            icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
            label={city}
            component={RouterLink}
            to={`/browse?city=${encodeURIComponent(city)}`}
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
        />
    )
}