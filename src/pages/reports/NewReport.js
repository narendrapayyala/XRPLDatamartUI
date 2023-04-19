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
import {
  getEntityList,
  getFieldsList,
  getFiltersList,
  createReport,
  updateReport,
  dbTestConnection
} from '../../store/reports/reportsSlice';
import LinearProgress from '@mui/material/LinearProgress';
import SelectFields from '../../components/SelectFields';
import DragDropList from '../../components/DragDrop';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

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
  const location = useLocation();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const initialFields = {
    id: '',
    uuid: '',
    report_name: '',
    entity_type: '',
    fields: [],
    filters: [],
    property_type: '',
    file_generation: '',
    is_db_sync: false,
    access_type: 'private',
    db_creds: {
      database_connection: 'mysql',
      database: '',
      host: '',
      port: '',
      user: '',
      password: '',
      ds_date: moment().format('DD-MM-YYYY')
    }
  };
  const { form, handleChange, setForm } = useForm(initialFields);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const theme = useTheme();
  const loading1 = useSelector(({ loading }) => loading.loading1);
  const loading2 = useSelector(({ loading }) => loading.loading2);
  const loading3 = useSelector(({ loading }) => loading.loading3);
  const entityList = useSelector(({ reports }) => reports.entityList);
  const fieldsData = useSelector(({ reports }) => reports.fieldsList);
  const filterParams = useSelector(({ reports }) => reports.filterParams);
  const auth = useSelector(({ auth }) => auth.user.data);
  const [checked, setChecked] = useState([]);
  const [expanded1, setExpanded1] = useState(true);
  const [expanded2, setExpanded2] = useState(true);
  const [expanded3, setExpanded3] = useState(true);
  const [testStatus, setTestStatus] = useState(false);

  const setFormData = (data1, data2) => {
    Object.keys(data1).map(function (key1) {
      Object.keys(data2).map(function (key2) {
        if (key1 === key2) {
          data1[key1] = data2[key2];
        }
      });
    });
  };

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
          'linear-gradient( 95deg,rgb(9, 118, 219) 0%,rgb(9, 118, 219) 50%,rgb(9, 118, 219) 100%)'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(9, 118, 219) 0%,rgb(9, 118, 219) 50%,rgb(9, 118, 219) 100%)'
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
        'linear-gradient( 136deg, rgb(9, 118, 219) 0%, rgb(9, 118, 219) 50%, rgb(9, 118, 219) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(9, 118, 219) 0%, rgb(9, 118, 219) 50%, rgb(9, 118, 219) 100%)'
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

  useEffect(() => {
    if (location.state) {
      const data = {
        ...location.state,
        filters: JSON.parse(location.state.filters).map((res) => res.name),
        fields: JSON.parse(location.state.fields)
          .sort((a, b) => a.order - b.order)
          .map((res) => res.field),
        db_creds: location.state.db_creds ? JSON.parse(location.state.db_creds) : {}
      };
      setFormData(initialFields, data);
    }
    // console.log(initialFields);
    setForm({
      ...initialFields
    });
    setActiveStep(0);
  }, [location.state]);

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      await dispatch(getFieldsList({ ...form, state: location.state })).then((res) => {
        if (res.payload && res.payload.length != 0) {
          if (location.state) {
            if (location.state.entity_type != form.entity_type) {
              setForm({ ...form, fields: [], filters: [] });
            }
          } else {
            setForm({ ...form, fields: [], filters: [] });
          }
          setChecked([]);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
      });
      dispatch(getFiltersList(form));
    } else if (activeStep === 1 || activeStep === 2 || activeStep === 3) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      const target = [];
      await fieldsData.map((res) => {
        form.fields.map((res1, i) => {
          if (res.field === res1) {
            target.push({
              field: res.field,
              field_normalized: res.field_normalized,
              method: res.method,
              type: res.type,
              order: i,
              xrp_drops: res.xrp_drops,
              display_name: res.display_name
            });
          }
        });
      });
      const targetFilters = [];
      await filterParams.map((res) => {
        form.filters.map((res1) => {
          if (res.name === res1) {
            targetFilters.push(res);
          }
        });
      });
      const mainTemp = {
        ...form,
        fields: JSON.stringify(target),
        filters: JSON.stringify(targetFilters),
        is_db_sync: form.property_type == 'Database Sync' ? true : false,
        db_creds: JSON.stringify(form.db_creds)
      };
      if (!location.state) {
        delete mainTemp.id;
        delete mainTemp.uuid;
        // console.log(mainTemp);
        dispatch(createReport(mainTemp));
      } else {
        // console.log(mainTemp);
        dispatch(updateReport(mainTemp));
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const testConnection = async () => {
    await dispatch(dbTestConnection({ ...form.db_creds })).then((res) => {
      if (res && res.payload && res.payload.status) {
        setTestStatus(true);
      }
    });
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          height: 65,
          backgroundColor: 'primary.dark'
        }}>
        <Grid container direction="row" sx={{ p: 1.5, mt: 0.5 }}>
          <Grid item>
            <Typography color="primary.contrastText" variant="h5" fontWeight={'bold'}>
              {location.state ? 'Update report' : 'Create new report'}
            </Typography>
            {/* <Typography sx={{ mt: 1, mr: 1 }} color="primary.contrastText">
              Select one of the queries below to request your report.
            </Typography> */}
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
          <Box sx={{ p: 5 }}>
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
                        value={form?.report_name}
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
                      spacing={4}
                      alignItems="baseline">
                      {entityList.map((res, i) => (
                        <Grid key={i} xs={12} sm={6} md={3} lg={2} item>
                          <FormControlLabel
                            disabled={location.state ? true : false}
                            value={res.method}
                            control={<Radio />}
                            label={<Typography noWrap>{res.name}</Typography>}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Grid>
                      ))}
                      <Grid xs={12} sm={6} md={3} lg={2} item>
                        <FormControlLabel
                          disabled={true}
                          value={'Sidechains'}
                          control={<Radio />}
                          label={<Typography noWrap>{'Sidechains'}</Typography>}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={3} lg={2} item>
                        <FormControlLabel
                          disabled={true}
                          value={'Ledger'}
                          control={<Radio />}
                          label={<Typography noWrap>{'Ledger'}</Typography>}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Grid>
                    </Grid>
                  </RadioGroupFormsy>
                  {auth.user_type === 'admin' && (
                    <FormControl component="fieldset" sx={{ mt: 4 }}>
                      <FormLabel component="legend">Is Public? *</FormLabel>
                      <FormGroup aria-label="position" row>
                        <FormControlLabel
                          value={form.access_type}
                          checked={form.access_type === 'public' ? true : false}
                          control={<Switch color="primary" />}
                          label="Public"
                          onChange={(e) =>
                            setForm({
                              ...form,
                              access_type: e.target.checked ? 'public' : 'private'
                            })
                          }
                          labelPlacement="start"
                        />
                      </FormGroup>
                    </FormControl>
                  )}
                </Box>
              )}

              {activeStep === 1 && (
                <SelectFields
                  fieldsData={fieldsData}
                  isSearch={true}
                  filters={false}
                  cmpkey={'select-fields'}
                  entity_type={form.entity_type}
                  fields={form.fields}
                  handleChange={(tmp) => setForm({ ...form, fields: tmp })}
                  activeStep={activeStep}
                  updateStatus={
                    location.state ? location.state.entity_type === form.entity_type : false
                  }
                />
              )}

              {activeStep === 2 && (
                <SelectFields
                  fieldsData={filterParams}
                  filters={true}
                  isSearch={true}
                  cmpkey={'select-filters'}
                  entity_type={null}
                  fields={form.filters}
                  handleChange={(tmp) => setForm({ ...form, filters: tmp })}
                  activeStep={activeStep}
                  updateStatus={
                    location.state ? location.state.entity_type === form.entity_type : false
                  }
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
                    id="property_type"
                    name="property_type"
                    value={form.property_type}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}>
                    <FormControlLabel
                      value={'Api'}
                      // disabled
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
                    {form.property_type == 'File Generation' && (
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
                                value={'PDF'}
                                disabled
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
                                <Typography variant="h6">Change Column Order</Typography>
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              sx={{
                                mb: 2,
                                width: '100%',
                                ml: 5,
                                border: 2,
                                borderColor: theme.palette.grey[300]
                              }}
                              alignItems="center">
                              <Grid xs={12} md={12} item>
                                <DragDropList
                                  checked={checked}
                                  fieldsData={fieldsData}
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
                      control={<Radio size={'small'} />}
                      label={<Typography noWrap>Database Sync</Typography>}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </RadioGroupFormsy>
                  {form.property_type == 'Database Sync' && (
                    <>
                      <Grid
                        container
                        sx={{
                          '& .MuiTextField-root': {
                            mb: 1.5,
                            mt: 1.5
                          },
                          '& .react-tel-input.focused': { borderColor: theme.palette.primary.main },
                          pl: 4,
                          pr: 4,
                          pb: 2,
                          mt: 1
                        }}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline">
                        <Grid sx={{ width: '60%' }} item>
                          <TextFieldFormsy
                            label="Type of Database"
                            id="db_creds.database_connection"
                            name="db_creds.database_connection"
                            value={form?.db_creds?.database_connection}
                            onChange={handleChange}
                            variant="outlined"
                            required
                            select
                            fullWidth
                            InputLabelProps={{
                              shrink: true
                            }}>
                            <MenuItem sx={{ textTransform: 'capitalize' }} value={'mysql'}>
                              {'MySql'}
                            </MenuItem>
                          </TextFieldFormsy>
                        </Grid>
                        <Grid sx={{ width: '60%' }} item>
                          <TextFieldFormsy
                            label="Host Name"
                            autoComplete="true"
                            id="db_creds.host"
                            name="db_creds.host"
                            value={form?.db_creds?.host}
                            onChange={handleChange}
                            variant="outlined"
                            required
                            fullWidth
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </Grid>
                        <Grid sx={{ width: '60%' }} item>
                          <TextFieldFormsy
                            label="Port"
                            autoComplete="true"
                            id="db_creds.port"
                            type="number"
                            name="db_creds.port"
                            value={form?.db_creds?.port}
                            onChange={handleChange}
                            variant="outlined"
                            required
                            fullWidth
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </Grid>
                        <Grid sx={{ width: '60%' }} item>
                          <TextFieldFormsy
                            label="Username"
                            autoComplete="true"
                            id="db_creds.user"
                            name="db_creds.user"
                            value={form?.db_creds?.user}
                            onChange={handleChange}
                            variant="outlined"
                            required
                            fullWidth
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </Grid>
                        <Grid sx={{ width: '60%' }} item>
                          <TextFieldFormsy
                            label="Password"
                            autoComplete="true"
                            id="db_creds.password"
                            name="db_creds.password"
                            type="password"
                            value={form?.db_creds?.password}
                            onChange={handleChange}
                            variant="outlined"
                            required
                            fullWidth
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </Grid>
                        <Grid sx={{ width: '60%' }} item>
                          <TextFieldFormsy
                            label="Default Schema"
                            id="db_creds.database"
                            autoComplete="true"
                            name="db_creds.database"
                            value={form?.db_creds?.database}
                            onChange={handleChange}
                            variant="outlined"
                            required
                            fullWidth
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Box>
              )}

              {activeStep === 4 && (
                <Box sx={{ width: '100%' }}>
                  <Grid
                    sx={{ mb: 2 }}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item>
                      <Typography color="primary.main" variant="h5" fontWeight={'bold'}>
                        {form.report_name} -{' '}
                        {entityList.find((res) => res.method === form.entity_type).name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Accordion
                    sx={{ background: theme.palette.grey[100] }}
                    expanded={expanded1}
                    onChange={(e, value) => setExpanded1(value)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="fields-content"
                      id="fields-header">
                      <Typography>Selected Fields</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List sx={{ p: 0 }} dense>
                        {form.fields.map((res, i) => (
                          <ListItem key={i}>
                            <ListItemText
                              primary={
                                i +
                                1 +
                                '. ' +
                                fieldsData.find((resNew) => resNew.field === res).display_name
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    sx={{ background: theme.palette.grey[100] }}
                    expanded={expanded2}
                    onChange={(e, value) => setExpanded2(value)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="filters-content"
                      id="filters-header">
                      <Typography>Selected Parameters</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List sx={{ p: 0 }} dense>
                        {form.filters.map((res, i) => (
                          <ListItem key={i}>
                            <ListItemText primary={i + 1 + '. ' + res} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    sx={{ background: theme.palette.grey[100] }}
                    expanded={expanded3}
                    onChange={(e, value) => setExpanded3(value)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="properties-content"
                      id="properties-header">
                      <Typography>Properties</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {form.property_type === 'Database Sync' ? (
                        <List sx={{ p: 0 }} dense>
                          <ListItem>
                            <ListItemText
                              primary={'Type of Database'}
                              secondary={form.db_creds.database_connection}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={'Host Name'} secondary={form.db_creds.host} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={'Port'} secondary={form.db_creds.port} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={'Username'} secondary={form.db_creds.user} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={'Password'} secondary={form.db_creds.password} />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary={'Default Schema'}
                              secondary={form.db_creds.database}
                            />
                          </ListItem>
                        </List>
                      ) : (
                        <List sx={{ p: 0 }} dense>
                          <ListItem>
                            <ListItemText
                              primary={form.property_type}
                              secondary={form.file_generation}
                            />
                          </ListItem>
                        </List>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  pt: 2
                }}>
                <Button
                  color="inherit"
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  style={{ textTransform: 'capitalize', fontSize: '16px' }}
                  sx={{ mt: 1, mb: 1, px: 6 }}>
                  Back
                </Button>
                {activeStep === 3 && form.property_type == 'Database Sync' ? (
                  <Button
                    sx={{ mt: 1, mb: 1, px: 6 }}
                    type="button"
                    // fullWidth
                    variant="contained"
                    onClick={() => testConnection()}
                    color="primary"
                    className={classes.submit}
                    disabled={
                      !isFormValid ||
                      (activeStep === 1 && form.fields.length === 0) ||
                      (activeStep === 2 && form.filters.length === 0) ||
                      loading2
                    }
                    aria-label="Test Connection"
                    style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                    {loading2 ? <CircularProgress size={24} color="inherit" /> : 'Test Connection'}
                  </Button>
                ) : (
                  <Box sx={{ flex: '1 1 auto' }} />
                )}
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
                    (activeStep === 3 && form.property_type == 'Database Sync' && !testStatus) ||
                    loading1
                  }
                  aria-label="Register"
                  style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                  {loading1 ? (
                    <CircularProgress size={24} color="inherit" />
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
