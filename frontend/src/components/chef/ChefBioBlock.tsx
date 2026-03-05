import { Box, Typography, Button, Fade } from '@mui/material'
import { useState } from 'react'


export default function ChefBioBlock({bio} : {bio: string | null}) {
  const [open, setOpen] = useState(false)

  if (!bio) return null

  return (
    <>
      {/* Bio Card */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          bgcolor: 'background.paper',
          boxShadow: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          About the Chef
        </Typography>

        <Typography
          variant="body1"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {bio}
        </Typography>

        <Button
          size="small"
          sx={{ mt: 2, px: 0 }}
          onClick={() => setOpen(true)}
        >
          Read more
        </Button>
      </Box>

      {/* Lightweight Modal */}
      <Fade in={open}>
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: open ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            p: 2,
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 4,
              p: 4,
              maxWidth: 600,
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: 5,
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              About the Chef
            </Typography>

            <Typography variant="body1">
              {bio}
            </Typography>

            <Button
              size="small"
              sx={{ mt: 3 }}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Fade>
    </>
  )
}