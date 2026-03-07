import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    useTheme,
    Box
  } from '@mui/material'
import { useNeighborhoodsQuery } from '../../hooks/useNeighborhoods'
import { Cancel, Close } from '@mui/icons-material'
  
  
  interface Props {
    open: boolean
    onClose: () => void
    onSelect: (id: number | 'all') => void
  }
  
  export default function NeighborhoodSelectorModal({
    open,
    onClose,
    onSelect,
  }: Props) {
    const theme = useTheme()
  
    const { data } = useNeighborhoodsQuery()
    const neighborhoods = data?.data
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <Box className={`flex justify-between`}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Choose Neighborhood
          </DialogTitle>
        </Box>
  
        <DialogContent>
          <List>
            {neighborhoods?.map((n) => (
              <ListItemButton
                key={n.id}
                onClick={() => {
                  onSelect(n.id)
                }}
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
              onClick={() => {
                onSelect('all')
              }}
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