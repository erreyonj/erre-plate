import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import type { UpdateProfilePayload } from "../../types/profile";
import { extractAddressComponents } from "../../utils/extractAddressComponents";
import { PhotoUpload } from "../../components/user/photoUpload";
import { useTheme } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUpdateProfileMutation } from "../../hooks/useProfiles";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";
import { eplateColors } from "../../../design/theme";
import { queryKeys } from "../../services/queryKeys";

export default function CustomerProfileEdit() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("user", user);
  const updateProfile = useUpdateProfileMutation();
  const [isInEditMode, setIsInEditMode] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<UpdateProfilePayload>({
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      phone: user?.phone ?? "",
      dietary_preferences: user?.dietary_preferences ?? "",
      allergies: user?.allergies ?? "",
      address: {
        street: user?.address?.street ?? "",
        city: user?.address?.city ?? "",
        state: user?.address?.state ?? "",
        zip: user?.address?.zip ?? "",
        country: user?.address?.country ?? "",
        lat: user?.address?.lat ?? undefined,
        lng: user?.address?.lng ?? undefined,
      },
    },
  });

  const onSubmit = async (values: UpdateProfilePayload) => {
    await updateProfile.mutateAsync(values);
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    navigate(`/${user?.role}/profile`);
  };

  const addressLabel = `${user?.address?.street} ${user?.address?.city}, ${user?.address?.state} ${user?.address?.zip} ${user?.address?.country}`;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        Edit User Details
      </Typography>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "rgba(0,0,0,0.08)",
        }}
      >
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <PhotoUpload />

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                label="First name"
                fullWidth
                {...register("first_name", {
                  required: "First name is required",
                })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                disabled={!isInEditMode}
              />
              <TextField
                label="Last name"
                fullWidth
                {...register("last_name", {
                  required: "Last name is required",
                })}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                disabled={!isInEditMode}
              />
            </Box>

            <TextField
              label="Phone"
              fullWidth
              {...register("phone")}
              disabled={!isInEditMode}
            />

            {isLoaded && (
              <Autocomplete
                onLoad={(auto) => (autocompleteRef.current = auto)}
                onPlaceChanged={() => {
                  const place = autocompleteRef.current?.getPlace();
                  if (!place) return;
                  const extracted = extractAddressComponents(place);
                  setValue("address", extracted.address);
                }}
              >
                <TextField fullWidth label={addressLabel || "Enter address"} disabled={!isInEditMode}/>
              </Autocomplete>
            )}

            <TextField
              label="Dietary preferences"
              fullWidth
              multiline
              minRows={2}
              {...register("dietary_preferences")}
              disabled={!isInEditMode}
            />

            <TextField
              label="Allergies"
              fullWidth
              multiline
              minRows={2}
              {...register("allergies")}
              disabled={!isInEditMode}
            />

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
                  isSubmitting || updateProfile.isPending || !isInEditMode
                }
              >
                Save changes
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
