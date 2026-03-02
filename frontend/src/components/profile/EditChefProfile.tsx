import { useForm } from "react-hook-form";
import { useUpdateChefProfile } from "../../hooks/useProfiles";
import { useState } from "react";
import {
  Card,
  TextField,
  Box,
  Select,
  Button,
  Switch,
  Typography,
  CardContent,
  MenuItem,
} from "@mui/material";
import type { UpdateChefProfilePayload } from "../../types/profile";
import { useChefProfile } from "../../hooks/useProfiles";
import { weekdayOptions } from "../../utils/weekdays";
import { eplateColors } from "../../../design/theme";
import { useNavigate } from "react-router-dom";

export default function EditChefProfile() {
  const { data: chef } = useChefProfile();
  const navigate = useNavigate();

  const { register, 
        handleSubmit, 
        setValue,
        formState: {isSubmitting, errors} 
    } = useForm({
    defaultValues: chef,
  });

  const updateChef = useUpdateChefProfile();
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [time, setTime] = useState('12:00')
  const [defaultCutoffDay, setDefaultCutoffDay] = useState('sunday')
  const [defaultDeliveryDay, setDefaultDeliveryDay] = useState('sunday')

  const onSubmit = async (values: UpdateChefProfilePayload) => {
    await updateChef.mutateAsync(values);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        Edit Chef Details
      </Typography>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "rgba(0,0,0,0.08)",
          padding: " 16px 16px 24px",
          height: "42rem",
        }}
      >
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", justifyContent: 'flex-start', gap: 2 }}
          >
            {/* Business Settings */}

            <TextField
              className="h-24"
              label="Tell 'em about you, chef!"
              {...register("bio")}
              multiline
              rows={3}
              disabled={!isInEditMode}
            />

            <TextField
              type="number"
              label="Hourly Rate"
              {...register("hourly_rate")}
              disabled={!isInEditMode}
            />

            {/* Delivery Settings */}

            <Box className="flex flex-col gap 1">    
                <Typography variant="body1" fontWeight={300} fontSize={'12px'}>Set Delivery Day</Typography>
                <Select {...register('delivery_day')} value={chef?.delivery_day || defaultDeliveryDay} label='Select Delivery Day'
                    onChange={(e)=>{
                        e.preventDefault()
                        setValue('delivery_day', e.target.value.toLowerCase())
                        setDefaultDeliveryDay(e.target.value)
                    }}
                    disabled={!isInEditMode}
                >
                    {weekdayOptions.map((day) => {
                        return (
                            <MenuItem key={day} value={day.toLowerCase()}>{day}</MenuItem>
                        )
                    })}
                </Select>
            </Box>

            <Box className="flex flex-col gap 1">    
                <Typography variant="body1" fontWeight={300} fontSize={'12px'}>Set Order Cutoff Day</Typography>
                <Select {...register('cutoff_day')} value={chef?.cutoff_day || defaultCutoffDay} label='Select Order Cutoff Day'
                    onChange={(e)=>{
                        e.preventDefault()
                        setValue('cutoff_day', e.target.value.toLowerCase())
                        setDefaultCutoffDay(e.target.value)
                    }}
                    disabled={!isInEditMode}
                >
                    {weekdayOptions.map((day) => {
                        return (
                            <MenuItem key={day} value={day.toLowerCase()}>{day}</MenuItem>
                        )
                    })}
                </Select>
            </Box>

            <Box className="flex flex-col gap 1">    
                <Typography variant="body1" fontWeight={300} fontSize={'12px'}>Set Order Window Cutoff Time</Typography>
            <TextField 
                type="time" 
                {...register("cutoff_time")} 
                value={time}
                onChange={(e)=>{
                    e.preventDefault()
                    setTime(e.target.value)
                }}
                disabled={!isInEditMode}
            />
            </Box>

            <TextField
              type="number"
              label="Set max orders you'll take per window.."
              {...register("max_orders_per_cycle")}
              disabled={!isInEditMode}
            />

            <Box className="flex gap 1">
                <Typography variant="h6">
                    Pause Orders?
                </Typography>
                <Switch {...register("is_paused")} />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                mt: 2,
              }}
            >
              {isInEditMode ? (
                <Button
                  type="button"
                  variant="text"
                  onClick={() => setIsInEditMode(!isInEditMode)}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  sx={{ bgcolor: eplateColors.terracotta }}
                  onClick={() => setIsInEditMode(!isInEditMode)}
                  // disabled={isSubmitting || updateProfile.isPending}
                >
                  Make Changes?
                </Button>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={
                  isSubmitting || updateChef.isPending || !isInEditMode
                }
              >
                Yes, Chef!
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
