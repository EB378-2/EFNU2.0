"use client";

import { useForm } from '@refinedev/react-hook-form';
import { Create } from '@refinedev/mui';
import React, { useState, useEffect, Suspense } from 'react';
import { Spinner } from "@/components/ui/Spinner";
import {
  Box,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Autocomplete,
  ButtonGroup,
  Button,
  CircularProgress
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useTheme } from '@hooks/useTheme';
import { ProfileData } from "@/types/Profile";
import { PriorNotice } from '@/types/PriorNotice';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAircraftMTOW, useProfilePNAircraft, useProfilePNPIC } from '@components/functions/FetchFunctions';
import { useGetIdentity, useUpdate, useNotification, useList, useCreate } from '@refinedev/core';
import { UserPNProfile, UserAircraft, ProfileOption } from '@/types/Profile';

const PNCreate = () => {
  const t = useTranslations('PN');
  const theme = useTheme();
  const router = useRouter();
  const { data: identityData } = useGetIdentity<{ id: string }>();
  const { open } = useNotification();
  const { mutate: updateProfile } = useUpdate<UserPNProfile>();
  const { mutate: createAircraft } = useCreate<UserAircraft>();

  const [aircraftOptions, setAircraftOptions] = useState<string[]>([]);
  const [profilesOptions, setProfileOptions] = useState<ProfileOption[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);
  const [selectedBillableProfile, setSelectedBillableProfile] = useState<ProfileOption | null>(null);
  const [currentMTOW, setCurrentMTOW] = useState<number | undefined>(undefined);
  const [picOptions, setPicOptions] = useState<string[]>([]);
  const [billableExternal, setBillableExternal] = useState<boolean>(false);
  const [isCustomAircraft, setIsCustomAircraft] = useState<boolean>(false);

  // Fetch all aircraft from the database
  const { data: aircraftData, isLoading: isLoadingAircraft } = useList<UserAircraft>({
    resource: 'aircraft',
    pagination: {
      mode: 'off',
    },
  });
  
  const { data: ProfilesData, isLoading: isLoadingProfiles } = useList<ProfileData>({
    resource: 'profiles',
     filters: [
      {
        field: "public",
        operator: "eq",
        value: "true",
      },
    ],
    pagination: {
      mode: 'off',
    },
  });



  // Fetch PIC persons from profile
  const PICPersons = useProfilePNPIC({ profileId: identityData?.id ?? "" });
  const { mtow: fetchedMTOW, isLoading: isMTOWLoading } = useAircraftMTOW({ aircraftId: selectedAircraft ?? "" });

  // Initialize aircraft options from all aircraft in database
  useEffect(() => {
    if (aircraftData?.data) {
      setAircraftOptions(aircraftData.data.map(ac => ac.id));
    }
  }, [aircraftData]);

  // Initialize profiles options from filtered profile in database

  useEffect(() => {
    if (ProfilesData?.data) {
      const mappedOptions = ProfilesData.data.map((profile) => ({
        id: profile.id,
        label: profile.fullname,
      }));
      setProfileOptions(mappedOptions);
    }
  }, [ProfilesData]);


  // Update MTOW when aircraft selection changes
  useEffect(() => {
    if (selectedAircraft && aircraftData?.data) {
      const foundAircraft = aircraftData.data.find(ac => 
        ac.id.toLowerCase() === selectedAircraft.toLowerCase()
      );
      
      if (foundAircraft) {
        setCurrentMTOW(foundAircraft.mtow);
        setValue('mtow', foundAircraft.mtow, { shouldValidate: true });
        setIsCustomAircraft(false);
      } else {
        setIsCustomAircraft(true);
        setCurrentMTOW(undefined);
        setValue('mtow', undefined, { shouldValidate: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAircraft, aircraftData]);

  // Initialize PIC options
  useEffect(() => {
    if (PICPersons && PICPersons.length > 0) {
      setPicOptions(PICPersons);
    }
  }, [PICPersons]);

  const {
    refineCore: { formLoading, onFinish },
    saveButtonProps,
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm<PriorNotice>({
    refineCoreProps: {
      resource: 'priornotice',
    },
    mode: 'onChange',
    defaultValues: {
      aircraft: '',
      mtow: undefined,
    },
  });

  const watchedDepTime = watch('dep_time');
  const watchedArrTime = watch('arr_time');

  const [depArrSelected, setDepArrSelected] = useState<"DEP" | "ARR" | "LOCAL">('ARR');

  const aircraftB = useProfilePNAircraft({ profileId: identityData?.id ?? "" })

  const handleSaveAircraftAndPIC = async (aircraftRegistration: string | null, picName: string | null) => {
    try {
      // For aircraft
      if (aircraftRegistration) {
        const currentAircrafts = aircraftB || [];
        const aircraftExists = currentAircrafts.some(
          ac => ac.toLowerCase() === aircraftRegistration.toLowerCase()
        );

        if (!aircraftExists) {
          await updateProfile({
            resource: 'profiles',
            id: identityData?.id ?? "",
            values: {
              aircraft: [...currentAircrafts, aircraftRegistration],
            },
          });
        }
      }

      // For PIC
      if (picName) {
        const currentPICs = PICPersons || [];
        const picExists = currentPICs.some(pic => 
          pic.toLowerCase() === picName.toLowerCase()
        );

        if (!picExists) {
          await updateProfile({
            resource: 'profiles',
            id: identityData?.id ?? "",
            values: {
              presaved: {
                PIC: [...currentPICs, picName],
              },
            },
          });
        }
      }

      open?.({
        type: 'success',
        message: 'Profile updated successfully',
      });
    } catch (error) {
      open?.({
        type: 'error',
        message: 'Failed to update profile',
      });
      console.error("Failed to save aircraft and PIC:", error);
    }
  };

  const createNewAircraft = async (registration: string, mtow: number) => {
    try {
      await createAircraft({
        resource: 'aircraft',
        values: {
          id: registration,
          mtow: mtow,
        },
      });
      
      // Add the new aircraft to the options list
      setAircraftOptions(prev => [...prev, registration]);
    } catch (error) {
      console.error("Failed to create aircraft:", error);
      throw error;
    }
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      // Check if this is a custom aircraft and MTOW is provided
      if (isCustomAircraft && (!data.mtow || data.mtow <= 0)) {
        throw new Error(t("MTOWRequiredForNewAircraft"));
      }

      const processedData = {
        ...data,
        dep_time: data.dep_time?.trim() || undefined,
        arr_time: data.arr_time?.trim() || undefined,
        billable: billableExternal === true ? selectedBillableProfile?.id : undefined,
      };

      if (!processedData.dep_time && !processedData.arr_time) {
        throw new Error(t("EitherDepartureOrArrivalRequired"));
      }

      // Create aircraft if it's custom
      if (isCustomAircraft && data.aircraft && data.mtow) {
        await createNewAircraft(data.aircraft, data.mtow);
      }

      // Save to profile and submit
      await handleSaveAircraftAndPIC(data.aircraft, data.pic_name || null);
      await onFinish(processedData);
      router.push('/priornotice');
    } catch (error) {
      open?.({
        type: 'error',
        message: error instanceof Error ? error.message : 'Form submission failed',
      });
    }
  });

  const checkValueTime = (time?: string) => {
    const str = time ?? "";
    if (!/^\d{1,4}$/.test(str)) return false;
    if (str.length < 4) return true;
    const hour = parseInt(str.slice(0, 2), 10);
    const minute = parseInt(str.slice(2), 10);
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
  };

  useEffect(() => {
    if (checkValueTime(watchedDepTime) && checkValueTime(watchedArrTime)) {
      setDepArrSelected("LOCAL");
    } else if (checkValueTime(watchedDepTime)) {
      setDepArrSelected("DEP");
    } else if (checkValueTime(watchedArrTime)) {
      setDepArrSelected("ARR");
    } else {
      setDepArrSelected("ARR");
    }
  }, [watchedDepTime, watchedArrTime]);

  const handleSelect = (option: "DEP" | "ARR" | "LOCAL") => {
    setDepArrSelected(option);
  };

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        disabled: !isValid,
        onClick: async (e) => {
          e.preventDefault();
          const isValid = await trigger();
          if (isValid) {
            handleFormSubmit();
          }
        },
      }}
      goBack
      title={
        <Typography variant="h4">
          {t("title")}
        </Typography>
      }
    >
      <Box component="form" sx={{ mt: 3, minHeight: '60vh' }} onSubmit={handleFormSubmit}>
        <Suspense fallback={<Spinner/>}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" color={theme.palette.error.main}>
                {t("subtitle")}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box mt={2}>
                <ButtonGroup variant="contained" fullWidth>
                  <Button
                    onClick={() => handleSelect("DEP")}
                    color={depArrSelected === "DEP" ? "primary" : "inherit"}
                  >
                    DEP
                  </Button>
                  <Button
                    onClick={() => handleSelect("ARR")}
                    color={depArrSelected === "ARR" ? "primary" : "inherit"}
                  >
                    ARR
                  </Button>
                  <Button
                    onClick={() => handleSelect("LOCAL")}
                    color={depArrSelected === "LOCAL" ? "primary" : "inherit"}
                  >
                    LOCAL
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid>

            {depArrSelected === "LOCAL" && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('dep_time', {
                      pattern: {
                        value: /^([0-1][0-9]|2[0-3])[0-5][0-9]$/,
                        message: t("InvalidTimeFormat"),
                      },
                    })}
                    error={!!errors.dep_time}
                    helperText={errors.dep_time?.message as string}
                    fullWidth
                    label={t("DEP (UTC HHMM)")}
                    placeholder={t("Enterdeptimehere")}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('arr_time', {
                      pattern: {
                        value: /^([0-1][0-9]|2[0-3])[0-5][0-9]$/,
                        message: t("InvalidTimeFormat"),
                      },
                    })}
                    error={!!errors.arr_time}
                    helperText={errors.arr_time?.message as string}
                    fullWidth
                    label={t("ARR (UTC HHMM)")}
                    placeholder={t("Enterarrtimehere")}
                  />
                </Grid>
              </>
            )}
            {depArrSelected === "DEP" && (
              <Grid item xs={12} md={6}>
                <TextField
                  {...register('dep_time', {
                    pattern: {
                      value: /^([0-1][0-9]|2[0-3])[0-5][0-9]$/,
                      message: t("InvalidTimeFormat"),
                    },
                  })}
                  error={!!errors.dep_time}
                  helperText={errors.dep_time?.message as string}
                  fullWidth
                  label={t("DEP (UTC HHMM)")}
                  placeholder={t("Enterdeptimehere")}
                />
              </Grid>
            )}
            {depArrSelected === "ARR" && (
              <Grid item xs={12} md={6}>
                <TextField
                  {...register('arr_time', {
                    pattern: {
                      value: /^([0-1][0-9]|2[0-3])[0-5][0-9]$/,
                      message: t("InvalidTimeFormat"),
                    },
                  })}
                  error={!!errors.arr_time}
                  helperText={errors.arr_time?.message as string}
                  fullWidth
                  label={t("ARR (UTC HHMM)")}
                  placeholder={t("Enterarrtimehere")}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                {...register('dof')}
                fullWidth
                type="date"
                label={t("DateOfFlight")}
                defaultValue={new Date().toISOString().split('T')[0]}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="aircraft"
                control={control}
                rules={{ required: t("AircraftRequired") }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Autocomplete
                    freeSolo
                    options={aircraftOptions}
                    loading={isLoadingAircraft}
                    value={value || null}
                    onChange={(_, newValue) => {
                      setSelectedAircraft(newValue);
                      onChange(newValue || '');
                    }}
                    onInputChange={(_, newInputValue) => {
                      onChange(newInputValue);
                      setSelectedAircraft(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("Aircraft registration")}
                        inputRef={ref}
                        error={!!error}
                        helperText={error?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingAircraft ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register('mtow', {
                  required: isCustomAircraft ? t("MTOWRequiredForNewAircraft") : t("MTOWRequired"),
                  min: { value: 1, message: t("InvalidMTOW") },
                  max: { value: 10000, message: t("MTOWTooHigh") },
                  valueAsNumber: true,
                })}
                error={!!errors.mtow}
                helperText={errors.mtow?.message as string}
                fullWidth
                value={currentMTOW ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const input = e.target.value;
                  const numericValue = input === '' ? undefined : Number(input);
                  if (typeof numericValue === 'number' || numericValue === undefined) {
                    setCurrentMTOW(numericValue);
                  }
                  setValue('mtow', numericValue, { shouldValidate: true });
                }}
                type="number"
                label={t("MTOW (Kg)")}
                disabled={!isCustomAircraft && !isMTOWLoading && currentMTOW !== undefined}
                InputProps={{
                  readOnly: !isCustomAircraft && !isMTOWLoading && currentMTOW !== undefined,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="pic_name"
                control={control}
                rules={{ required: t("PICNameRequired") }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Autocomplete
                    freeSolo
                    options={picOptions}
                    value={value || ''}
                    onChange={(_, newValue) => {
                      onChange(newValue || '');
                    }}
                    onInputChange={(_, newInputValue) => {
                      onChange(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("PIC (Full name)")}
                        inputRef={ref}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name="ifr_arrival"
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} color="primary" />}
                    label={t("IFR Arrival")}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={billableExternal}
                    onChange={(e) => setBillableExternal(e.target.checked)}
                  />
                }
                label={t("BillToSoemeoneElse")}
              />
              {billableExternal === true && (
                <Controller
                  name="billable"
                  control={control}
                  rules={{ required: t("BillableRequired") }}
                  render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                    <Autocomplete
                      freeSolo
                      options={profilesOptions}
                      loading={isLoadingProfiles}
                      value={selectedBillableProfile}  // full object
                      onChange={(_, newValue) => {
                        if (typeof newValue === 'string') {
                          // User typed something not in options
                          setSelectedBillableProfile({ id: newValue, label: newValue });
                          onChange(newValue);
                        } else if (newValue && 'id' in newValue) {
                          setSelectedBillableProfile(newValue);
                          onChange(newValue.id);
                        } else {
                          setSelectedBillableProfile(null);
                          onChange('');
                        }
                      }}
                      onInputChange={(_, newInputValue) => {
                        // Update the input value, but don't change selection unless they select from dropdown
                        onChange(newInputValue);
                      }}
                      getOptionLabel={(option) => {
                        // option can be string or ProfileOption
                        if (typeof option === 'string') return option;
                        if (option?.label) return option.label;
                        return '';
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("BillableProfile")}
                          inputRef={ref}
                          error={!!error}
                          helperText={error?.message}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isLoadingProfiles ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />

                  )}
                />
              )}
            </Grid>
          </Grid>
        </Suspense>
      </Box>
    </Create>
  );
};

export default PNCreate;