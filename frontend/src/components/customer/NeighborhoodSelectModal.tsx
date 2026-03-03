import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    useTheme,
  } from '@mui/material'
  
  interface Neighborhood {
    id: number
    name: string
  }
  
  interface Props {
    open: boolean
    onClose: () => void
    onSelect: (id: number | null) => void
  }
  
  export default function NeighborhoodSelectorModal({
    open,
    onClose,
    onSelect,
  }: Props) {
    const theme = useTheme()
  
    // For now static — later fetch from API
    const neighborhoods: Neighborhood[] = [
      { id: 9, name: 'East Madison' },
      { id: 10, name: 'West Madison' },
      { id: 12, name: 'South Madison' },
    ]
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>
          Choose Neighborhood
        </DialogTitle>
  
        <DialogContent>
          <List>
            {neighborhoods.map((n) => (
              <ListItemButton
                key={n.id}
                onClick={() => onSelect(n.id)}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.light,
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography fontWeight={600}>
                      {n.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
  
            {/* Browse All Option */}
            <ListItemButton
              onClick={() => onSelect(null)}
              sx={{ borderRadius: 2 }}
            >
              <ListItemText
                primary={
                  <Typography color="text.secondary">
                    View All Neighborhoods
                  </Typography>
                }
              />
            </ListItemButton>
          </List>
        </DialogContent>
      </Dialog>
    )
  }