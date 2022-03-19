import React, { useState, useRef, useEffect } from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ArticleIcon from '@mui/icons-material/Article';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FilterListIcon from '@mui/icons-material/FilterList';
import SyncIcon from '@mui/icons-material/Sync';
import SummarizeIcon from '@mui/icons-material/Summarize';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Button from '@mui/material/Button';
import { useForm } from '../../components/hooks';
import Formsy from 'formsy-react';
import { TextFieldFormsy, RadioGroupFormsy } from '../../components/formsy';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import { getEntityList, getFieldsList, getFiltersList } from '../../store/reports/reportsSlice';
import LinearProgress from '@mui/material/LinearProgress';
import SelectFields from '../../components/SelectFields';
import DragDropList from '../../components/DragDrop';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // margin: '20px'
    minHeight: '100%'
  },
  fileGen: {
    marginLeft: '10px'
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(0)
  }
}));

const NewReport = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const initialFields = {
    report_name: '',
    entity_type: '',
    fields: [],
    filters: [],
    type_of_property: '',
    file_generation: ''
  };
  const { form, handleChange, setForm } = useForm(initialFields);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const theme = useTheme();
  const loading1 = useSelector(({ loading }) => loading.loading1);
  const loading3 = useSelector(({ loading }) => loading.loading3);
  const entityList = useSelector(({ reports }) => reports.entityList);
  const fieldsData = useSelector(({ reports }) => reports.fieldsList);
  const filterParams = useSelector(({ reports }) => reports.filterParams);
  const [checked, setChecked] = useState([]);
  // console.log(filterParams);

  useEffect(() => {
    dispatch(getEntityList());
  }, []);

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1
    }
  }));

  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
    })
  }));

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
      1: <ArticleIcon />,
      2: <TextFieldsIcon />,
      3: <FilterListIcon />,
      4: <SyncIcon />,
      5: <SummarizeIcon />
    };
    const { icon } = props;
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(icon)]}
      </ColorlibStepIconRoot>
    );
  }

  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node
  };

  const steps = [
    'Create Report',
    'Select Fields',
    'Filters & Parameters',
    'Properties',
    'Report Summary'
  ];

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      await dispatch(getFieldsList(form)).then((res) => {
        if (res.payload && res.payload.length != 0) {
          setForm({ ...form, fields: [], filters: [] });
          setChecked([]);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
      });
      await dispatch(getFiltersList(form));
    } else if (activeStep === 1 || activeStep === 2 || activeStep === 3) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      console.log(form);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          height: 135,
          backgroundColor: 'primary.dark'
        }}>
        <Grid container direction="row" sx={{ p: 3, ml: 2 }}>
          <Grid item>
            <Typography color="primary.contrastText" variant="h4" fontWeight={'bold'}>
              Create new report
            </Typography>
            <Typography sx={{ mt: 1, mr: 1 }} color="primary.contrastText">
              Select one of the queries below to request your report.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      {loading3 && <LinearProgress color="warning" />}
      <Grid container direction="row" sx={{ pt: 3, mt: 3 }}>
        <Stack sx={{ width: '100%' }} spacing={4}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ p: 4 }}>
            <Formsy
              onValidSubmit={handleNext}
              onValid={enableButton}
              onInvalid={disableButton}
              ref={formRef}
              name="registerForm"
              className={classes.form}>
              {activeStep === 0 && (
                <Box
                  sx={{
                    '& .MuiTextField-root': {
                      mb: 1,
                      mt: 1
                    },
                    '& .react-tel-input.focused': { borderColor: theme.palette.primary.main },
                    pl: 4,
                    pr: 4,
                    pb: 2
                  }}>
                  <Grid
                    container
                    direction="row"
                    sx={{ mb: 2 }}
                    justifyContent="center"
                    alignItems="center">
                    <Grid sx={{ width: '60%' }} item>
                      <TextFieldFormsy
                        label="Report Name"
                        id="report_name"
                        name="report_name"
                        value={form.report_name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        fullWidth
                        // focused
                        InputLabelProps={{
                          shrink: true
                        }}
                        // size="small"
                      />
                    </Grid>
                  </Grid>
                  <RadioGroupFormsy
                    row
                    className={classes.radio}
                    margin="normal"
                    label="Entity Type"
                    type="radio"
                    id="entity_type"
                    name="entity_type"
                    value={form.entity_type}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="baseline">
                      {entityList.map((res, i) => (
                        <Grid key={i} xs={12} sm={6} md={2} item>
                          <FormControlLabel
                            value={res.method}
                            control={<Radio />}
                            label={<Typography noWrap>{res.name}</Typography>}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroupFormsy>
                </Box>
              )}

              {activeStep === 1 && (
                <SelectFields
                  fieldsData={fieldsData}
                  isSearch={true}
                  filters={false}
                  cmpkey={'select-fields'}
                  fields={form.fields}
                  handleChange={(tmp) => setForm({ ...form, fields: tmp })}
                />
              )}

              {activeStep === 2 && (
                <SelectFields
                  fieldsData={filterParams}
                  filters={true}
                  cmpkey={'select-filters'}
                  fields={form.filters}
                  handleChange={(tmp) => setForm({ ...form, filters: tmp })}
                />
              )}

              {activeStep === 3 && (
                <Box
                  sx={{
                    pl: 4,
                    pr: 4,
                    pb: 2,
                    width: '100%'
                  }}>
                  <RadioGroupFormsy
                    className={classes.radio}
                    margin="normal"
                    type="radio"
                    id="type_of_property"
                    name="type_of_property"
                    value={form.type_of_property}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}>
                    <FormControlLabel
                      value={'Api'}
                      disabled
                      control={<Radio size={'small'} />}
                      label={<Typography noWrap>Api</Typography>}
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <FormControlLabel
                      value={'File Generation'}
                      control={<Radio size={'small'} />}
                      label={<Typography noWrap>File Generation</Typography>}
                      sx={{ textTransform: 'capitalize' }}
                    />
                    {form.type_of_property && (
                      <>
                        <RadioGroupFormsy
                          margin="normal"
                          type="radio"
                          id="file_generation"
                          name="file_generation"
                          value={form.file_generation}
                          onChange={handleChange}
                          variant="outlined"
                          required
                          fullWidth
                          InputLabelProps={{
                            shrink: true
                          }}>
                          <Grid
                            container
                            sx={{ ml: 2 }}
                            direction="row"
                            justifyContent="space-between"
                            spacing={2}
                            alignItems="baseline">
                            <Grid xs={12} sm={6} md={4} item>
                              <FormControlLabel
                                value={'CSV'}
                                control={<Radio size={'small'} />}
                                label={<Typography noWrap>{'CSV'}</Typography>}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Grid>
                            <Grid xs={12} sm={6} md={4} item>
                              <FormControlLabel
                                disabled
                                value={'XLSX'}
                                control={<Radio size={'small'} />}
                                label={<Typography noWrap>{'XLSX'}</Typography>}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Grid>
                            <Grid xs={12} sm={6} md={4} item>
                              <FormControlLabel
                                disabled
                                value={'PDF'}
                                control={<Radio size={'small'} />}
                                label={<Typography noWrap>{'PDF'}</Typography>}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Grid>
                          </Grid>
                        </RadioGroupFormsy>
                        {form.file_generation && (
                          <>
                            <Grid
                              container
                              direction="row"
                              sx={{ mb: 2, width: '100%', ml: 4, mt: 2 }}
                              justifyContent="center"
                              alignItems="center">
                              <Grid item>
                                <Typography sx={{ borderBottom: 1 }} variant="h6">
                                  Change Column Order
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              sx={{ mb: 2, width: '100%', ml: 5 }}
                              alignItems="center">
                              <Grid xs={12} md={12} item>
                                <DragDropList
                                  checked={checked}
                                  setChecked={(tmp) => setChecked(tmp)}
                                  isChekbox={false}
                                  data={form.fields}
                                  onChangeSelected={(tmp) => setForm({ ...form, filters: tmp })}
                                  onChangeList={(tmp) => setForm({ ...form, fields: tmp })}
                                />
                              </Grid>
                            </Grid>
                          </>
                        )}
                      </>
                    )}

                    <FormControlLabel
                      value={'Database Sync'}
                      disabled
                      control={<Radio size={'small'} />}
                      label={<Typography noWrap>Database Sync</Typography>}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </RadioGroupFormsy>
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  style={{ textTransform: 'capitalize', fontSize: '16px' }}
                  sx={{ mt: 1, mb: 1, px: 6 }}>
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                <Button
                  sx={{ mt: 1, mb: 1, px: 6 }}
                  type="submit"
                  // fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={
                    !isFormValid ||
                    (activeStep === 1 && form.fields.length === 0) ||
                    (activeStep === 2 && form.filters.length === 0) ||
                    loading1
                  }
                  aria-label="Register"
                  style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                  {loading1 ? (
                    <CircularProgress size={24} olor="inherit" />
                  ) : activeStep === steps.length - 1 ? (
                    'Finish'
                  ) : (
                    'Next'
                  )}
                </Button>
              </Box>
            </Formsy>
          </Box>
        </Stack>
      </Grid>
    </div>
  );
};

export default NewReport;
