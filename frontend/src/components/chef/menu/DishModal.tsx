import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import type { Dish } from '../../../types/menu'
import DishForm from './DishForm'

interface DishModalProps {
  open: boolean
  dishes: Dish[]
  onClose: () => void
  onSelectDish: (dish: Dish) => void
  onCreateDish: (dish: Omit<Dish, 'id'>) => void
}

export default function DishModal({
  open,
  dishes,
  onClose,
  onSelectDish,
  onCreateDish,
}: DishModalProps) {
  const [tab, setTab] = useState<'existing' | 'new'>('existing')

  function handleCreate(dish: Omit<Dish, 'id'>) {
    onCreateDish(dish)
    setTab('existing')
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 0 }}>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          aria-label="Dish selection mode"
        >
          <Tab value="existing" label="Select existing dish" />
          <Tab value="new" label="Create new dish" />
        </Tabs>
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        {tab === 'existing' && (
          <Box className="space-y-2">
            {dishes.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                You haven&apos;t created any dishes yet. Switch to &quot;Create new dish&quot; to
                add your first recipe.
              </Typography>
            ) : (
              <List sx={{ maxHeight: 360, overflow: 'auto' }}>
                {dishes.map((dish) => (
                  <ListItem key={dish.id} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        onSelectDish(dish)
                        onClose()
                      }}
                    >
                      <ListItemText
                        primary={dish.name}
                        secondary={
                          <span>
                            <span className="capitalize">{dish.meal_type}</span> ·{' '}
                            {dish.description}
                          </span>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
        {tab === 'new' && (
          <DishForm
            onSubmit={(payload) => {
              handleCreate(payload)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

